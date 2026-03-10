"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function NewQueryForms() {
  return (
    <Dialog>
      {/* No Base UI, usamos 'render' em vez de 'asChild' */}
      <DialogTrigger render={<Button variant="default" />}>
        Agendar Nova Consulta
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Nova Consulta</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="paciente">Paciente</Label>
            <Input id="paciente" placeholder="Nome do paciente" />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="data">Data e Horário</Label>
            <Input id="data" type="datetime-local" />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="submit">Salvar Agendamento</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}