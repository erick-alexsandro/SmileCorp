"use client";

import { NewQueryForms } from "./_components/new-query-forms";
import { CalendarEventCard } from "./_components/calendar-event-card";

import ShadcnBigCalendar from "@/components/shadcn-big-calendar/shadcn-big-calendar";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { format } from "date-fns/format";

import { RefreshCcw, SlidersHorizontal } from "lucide-react";
import moment from "moment";
import { SetStateAction, useState, useEffect } from "react";

// Big calendar do react instalado pelo npm
import type { CalendarProps } from "react-big-calendar";
import { momentLocalizer, Views } from "react-big-calendar";

moment.locale("pt-br");

const messages = {
  today: "Hoje",
  previous: "Anterior",
  next: "Próximo",

  month: "Mês",
  week: "Semana",
  day: "Dia",
  agenda: "Agenda",

  date: "Data",
  time: "Hora",
  event: "Evento",

  allDay: "Dia inteiro",
  noEventsInRange: "Nenhum evento neste período",
};

const localizer = momentLocalizer(moment);

type CalendarEvent = {
  title: string;
  patient?: string;
  start: Date;
  end: Date;
  variant?: "primary" | "secondary" | "outline";
};

const startOfToday = new Date();
startOfToday.setHours(0, 0, 0, 0);

const createDate = (date: string, time: string) => {
  return moment(`${date} ${time}`, "YYYY-MM-DD HH:mm").toDate();
};

export default function SchedulingPage() {
  const [view, setView] = useState(Views.WEEK);
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [allDoctors, setAllDoctors] = useState<string[]>([]);
  const [procedimentosMap, setProcedimentosMap] = useState<Record<number, string>>({});
  const [reloadToken, setReloadToken] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const defaultFilters = {
    doctor: "",
    patient: "",
    startDate: "",
    endDate: "",
  };

  const [filters, setFilters] =
    useState<Record<string, string>>(defaultFilters);
  const [filtersDraft, setFiltersDraft] =
    useState<Record<string, string>>(defaultFilters);

  // Fetch all doctors on mount
  const fetchEvents = () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (filters.doctor) params.append("doctor", filters.doctor);
    if (filters.patient) params.append("patient", filters.patient);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);

    fetch(`http://localhost:8080/api/agendamentos?${params}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("DADOS FILTRADOS DO BACKEND:", data);
        const formattedEvents = data.map((item: any) => {
          const listedProcedures = item.procedimentos?.length
            ? item.procedimentos
                .map((p: any) => (typeof p === "string" ? p : p.nome || ""))
                .filter(Boolean)
            : [];

          const idsProcedures = item.procedimentosIds?.length
            ? item.procedimentosIds
                .map((id: number) => procedimentosMap[id])
                .filter(Boolean)
            : [];

          const procedureText =
            listedProcedures.length > 0
              ? listedProcedures.join(", ")
              : idsProcedures.length > 0
              ? idsProcedures.join(", ")
              : item.observacoes || "Procedimento não informado";

          return {
            title: item.profissional?.nome || "Profissional não informado",
            patient: item.paciente ? item.paciente.nome : "Sem nome",
            procedure: procedureText,
            start: new Date(item.data + "T" + item.horarioInicio),
            end: new Date(item.data + "T" + item.previsaoTermino),
            variant: "primary" as const,
          };
        });
        setEvents(formattedEvents);
      })
      .catch((err) => console.error("Erro na busca filtrada:", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    // Load all procedures once, so we can display names for agendamentos
    fetch("http://localhost:8080/api/procedimentos")
      .then((res) => res.json())
      .then((data) => {
        const procMap: Record<number, string> = {};
        data.forEach((proc: any) => {
          if (proc?.id != null) {
            procMap[Number(proc.id)] = proc.nome || "Procedimento";
          }
        });
        setProcedimentosMap(procMap);
      })
      .catch((err) => console.error("Erro ao buscar procedimentos:", err));

    fetch("http://localhost:8080/api/agendamentos")
      .then((res) => res.json())
      .then((data) => {
        const docs = Array.from(
          new Set(data.map((item: any) => item.profissional?.nome).filter(Boolean)),
        );
        setAllDoctors(docs);
      })
      .catch((err) => console.error("Erro ao buscar médicos:", err));

    fetchEvents();
  }, []);

  // Fetch filtered events when filters, refresh token or procedure names map change
  useEffect(() => {
    fetchEvents();
  }, [filters.doctor, filters.patient, filters.startDate, filters.endDate, reloadToken, procedimentosMap]);

  const handleRefresh = () => {
    setReloadToken((old) => old + 1);
  };

  const eventPropGetter: CalendarProps<CalendarEvent>["eventPropGetter"] = (
    event,
  ) => {
    const variant = event.variant ?? "primary";
    return {
      className: `event-variant-${variant}`,
    };
  };

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const handleViewChange = (newView: SetStateAction<any>) => {
    setView(newView);
  };

  const filteredEvents = events.filter((event) => {
    if (filters.doctor && event.title !== filters.doctor) {
      return false;
    }

    if (
      filters.patient &&
      !event.patient?.toLowerCase().includes(filters.patient.toLowerCase())
    ) {
      return false;
    }

    if (filters.startDate) {
      const filterStart = moment(filters.startDate, "YYYY-MM-DD").startOf(
        "day",
      );
      if (moment(event.start).isBefore(filterStart)) {
        return false;
      }
    }

    if (filters.endDate) {
      const filterEnd = moment(filters.endDate, "YYYY-MM-DD").endOf("day");
      if (moment(event.start).isAfter(filterEnd)) {
        return false;
      }
    }

    return true;
  });

  const activeFiltersCount = Object.values(filters).filter(
    (value) => value !== "",
  ).length;
  // Adicione logo antes do return da página
  console.log("Eventos filtrados:", filteredEvents);
  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 overflow-hidden pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">
            Agenda SmileCorp
          </h2>
          <p className="text-muted-foreground italic text-sm">
            Controle de consultas e horários
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={handleRefresh}
          >
            <RefreshCcw />
          </Button>
          <Sheet>
            <SheetTrigger aschild>
              <Button variant="outline" className="relative gap-2 cursor-pointer">
                <SlidersHorizontal className="h-4 w-4" />
                Filtros
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader className="">
                <SheetTitle>Filtrar Agenda</SheetTitle>
              </SheetHeader>
              <FieldGroup className="px-5">
                <FieldSet>
                  <FieldDescription>
                    Refine a visualização dos eventos
                  </FieldDescription>
                  <div className="space-y-4 pt-4">
                    <Field>
                      <FieldLabel>Paciente</FieldLabel>
                      <Input
                        placeholder="Nome do paciente"
                        value={filtersDraft.patient}
                        onChange={(e) =>
                          setFiltersDraft({
                            ...filtersDraft,
                            patient: e.target.value,
                          })
                        }
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Doutor</FieldLabel>
                      <Select
                        value={filtersDraft.doctor}
                        onValueChange={(v) =>
                          setFiltersDraft({
                            ...filtersDraft,
                            doctor: v === "none" ? "" : (v ?? ""),
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o doutor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Todos</SelectItem>
                          {allDoctors.map((d) => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field>
                      <FieldLabel>Data Inicial</FieldLabel>
                      <DatePicker
                        date={
                          filtersDraft.startDate
                            ? (() => {
                                const [y, m, d] = filtersDraft.startDate
                                  .split("-")
                                  .map(Number);
                                return new Date(y, m - 1, d); // local midnight, no UTC shift
                              })()
                            : undefined
                        }
                        setDate={(newDate) =>
                          setFiltersDraft({
                            ...filtersDraft,
                            startDate: newDate
                              ? format(newDate, "yyyy-MM-dd")
                              : "",
                          })
                        }
                      />
                    </Field>

                    <Field>
                      <FieldLabel>Data Final</FieldLabel>
                      <DatePicker
                        date={
                          filtersDraft.endDate
                            ? (() => {
                                const [y, m, d] = filtersDraft.endDate
                                  .split("-")
                                  .map(Number);
                                return new Date(y, m - 1, d); // local midnight, no UTC shift
                              })()
                            : undefined
                        }
                        setDate={(newDate) =>
                          setFiltersDraft({
                            ...filtersDraft,
                            endDate: newDate
                              ? format(newDate, "yyyy-MM-dd")
                              : "",
                          })
                        }
                      />
                    </Field>
                  </div>
                </FieldSet>
                <div className="flex flex-col gap-2 pt-6">
                  <Button onClick={() => setFilters(filtersDraft)}>
                    Aplicar filtros
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilters(defaultFilters);
                      setFiltersDraft(defaultFilters);
                    }}
                  >
                    Limpar
                  </Button>
                </div>
              </FieldGroup>
            </SheetContent>
          </Sheet>
          
          <NewQueryForms />
        </div>
      </div>

      <div className="relative rounded-xl border bg-card text-card-foreground shadow">
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/70 p-4">
            <div className="mb-3 h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        )}

        <div className="p-1 sm:p-4">
          {isLoading && filteredEvents.length === 0 ? (
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-14 w-full animate-pulse rounded-lg bg-muted"
                />
              ))}
            </div>
          ) : (
            <ShadcnBigCalendar
              localizer={localizer}
              messages={messages}
              components={{
                event: (props) => <CalendarEventCard {...props} showHover={true} />,
                agenda: {
                  event: (props) => <CalendarEventCard {...props} showHover={false} />,
                },
              }}
              style={{ height: "calc(100vh - 250px)", minHeight: "600px" }}
              className="border-none"
              date={date}
              onNavigate={handleNavigate}
              view={view}
              onView={handleViewChange}
              events={filteredEvents}
              eventPropGetter={eventPropGetter}
              allDayAccessor={() => false}
            />
          )}
        </div>
      </div>
    </main>
  );
}
