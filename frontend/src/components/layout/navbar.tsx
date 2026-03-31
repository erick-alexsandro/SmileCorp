"use client";

import * as React from "react";
import { useEffect, useId, useState } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  ChevronDown,
  LogOut,
  Menu,
  Settings,
  Package,
  User,
  Calendar,
  Users,
  CreditCard,
  Calendars,
  SearchIcon,
  LoaderCircleIcon,
  Coins,
  BanknoteArrowUp,
  BanknoteArrowDown,
  Truck,
  ClipboardPlus,
  SquareActivity,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { UserButton } from '@neondatabase/auth/react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface NavLinkItem {
  title: string;
  href: string;
  description?: string;
  icon?: React.ElementType;
  badge?: string;
}

interface NavItem {
  title: string;
  href?: string;
  children?: NavLinkItem[];
}

// ─── Data ────────────────────────────────────────────────────────────────────

const navItems: NavItem[] = [
  {
    title: "Atendimentos",
    children: [
      {
        title: "Agenda",
        href: "/treatment/scheduling",
        description: "Acompanhe os agendamentos e horários dos clientes",
        icon: Calendar,
      },
      {
        title: "Pacientes",
        href: "/patients",
        description: "Gerencie as informações dos pacientes",
        icon: Users,
      },
      {
        title: "Pontuários",
        href: "/points",
        description: "Gerencie os pontos dos pacientes",
        icon: ClipboardPlus,
      },
      {
        title: "Procedimentos",
        href: "/procedures",
        description: "Visualize e altere os procedimentos",
        icon: SquareActivity,
      },
    ],
  },
  {
    title: "Financeiro",
    children: [
      {
        title: "Fluxo de Caixa",
        href: "/cashflow",
        description: "Acompanhe as entradas e saídas financeiras",
        icon: Coins,
      },
      { 
        title: "Contas a Pagar",
        href: "/accounts-payable",
        description: "Gerencie as contas a pagar e seus vencimentos",
        icon: BanknoteArrowUp,
      },
      {
        title: "Contas a Receber",
        href: "/accounts-receivable",
        description: "Gerencie as contas a receber e seus vencimentos",
        icon: BanknoteArrowDown,
      },
    ],
  },
  {
    title: "Estoque",
    children: [
      {
        title: "Produtos e Insumos",
        href: "/products",
        description: "Gerencie os produtos e insumos do estoque ",
        icon: Package,
      },
      {
        title: "Fornecedores",
        href: "/suppliers",
        description: "Gerencie as informações dos fornecedores",
        icon: Truck,
      },
    ],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & {
    title: string;
    icon?: React.ElementType;
    badge?: string;
  }
>(({ className, title, children, icon: Icon, badge, ...props }, ref) => (
  <li>
    <NavigationMenuLink asChild>
      <a
        ref={ref}
        className={cn(
          "group flex select-none gap-3 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-accent focus:bg-accent",
          className,
        )}
        {...props}
      >
        {Icon && (
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-background shadow-xs transition-colors group-hover:border-primary/30 group-hover:bg-primary/5">
            <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium leading-none">{title}</span>
            {badge && (
              <Badge
                variant="secondary"
                className="h-4 rounded-sm px-1 py-0 text-[10px] font-semibold"
              >
                {badge}
              </Badge>
            )}
          </div>
          {children && (
            <p className="mt-1 line-clamp-2 text-xs leading-snug text-muted-foreground">
              {children}
            </p>
          )}
        </div>
      </a>
    </NavigationMenuLink>
  </li>
));
ListItem.displayName = "ListItem";

// ─── SearchBar ─────────────────────────────────────────────────────────

const SearchBar = () => {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const id = useId();

  useEffect(() => {
    if (value) {
      setIsLoading(true);

      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }

    setIsLoading(false);
  }, [value]);

  return (
    <div className="w-full max-w-xs space-y-2 px-3">
      <div className="relative">
        <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50">
          <SearchIcon className="size-4" />
          <span className="sr-only">Pesquisar....</span>
        </div>
        <Input
          id={id}
          type="search"
          placeholder="Pesquisar..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="peer px-9 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none"
        />
        {isLoading && (
          <div className="text-muted-foreground pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-3 peer-disabled:opacity-50">
            <LoaderCircleIcon className="size-4 animate-spin" />
            <span className="sr-only">Carregando...</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Mobile Sheet Nav ─────────────────────────────────────────────────────────

function MobileNavSection({
  item,
  onClose,
}: {
  item: NavItem;
  onClose: () => void;
}) {
  const [open, setOpen] = React.useState(false);

  if (!item.children) {
    return (
      <Link
        href={item.href ?? "#"}
        onClick={onClose}
        className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
      >
        {item.title}
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
      >
        {item.title}
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="mt-1 ml-3 space-y-0.5 border-l pl-3">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={onClose}
              className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              {child.icon && <child.icon className="h-4 w-4 shrink-0" />}
              <span>{child.title}</span>
              {child.badge && (
                <Badge
                  variant="secondary"
                  className="ml-auto h-4 px-1 text-[10px]"
                >
                  {child.badge}
                </Badge>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileSheet({ user, clinic }: { user?: any; clinic?: any }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex w-80 flex-col p-0">
        <SheetHeader className="border-b px-4 py-3">
          <SheetTitle asChild>
            <Link
              href="/"
              className="flex items-center gap-2"
              onClick={() => setOpen(false)}
            >
              <Logo />
            </Link>
          </SheetTitle>
          {clinic?.name && (
            <div className="mt-2 text-sm text-muted-foreground">{clinic.name}</div>
          )}
        </SheetHeader>

        <ScrollArea className="flex-1 px-4 py-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <MobileNavSection
                key={item.title}
                item={item}
                onClose={() => setOpen(false)}
              />
            ))}
          </nav>

          <Separator className="my-4" />

          <div className="space-y-1">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Account
            </p>
            {[
              { icon: User, label: "Profile", href: "/profile" },
              { icon: Settings, label: "Settings", href: "/settings" },
              { icon: CreditCard, label: "Billing", href: "/billing" },
            ].map(({ icon: Icon, label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              {user?.user_metadata?.avatar_url || user?.avatar_url ? (
                <AvatarImage src={user?.user_metadata?.avatar_url || user?.avatar_url} alt={user?.email || 'avatar'} />
              ) : (
                <AvatarFallback className="text-xs font-semibold">{(user?.email || 'U').charAt(0)}</AvatarFallback>
              )}
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{user?.user_metadata?.name || user?.name || (user?.email?.split('@')[0]) || 'Usuário'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || ''}</p>
              {clinic?.name && (
                <p className="text-xs text-muted-foreground truncate">{clinic.name}</p>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start text-destructive hover:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair da conta
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Logo ─────────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-7 w-7 items-center justify-center">
        <Image src="/logo.svg" width={500} height={500} alt="logo" />
      </div>
      <span className="font-semibold tracking-tight">SmileCorp</span>
    </div>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────

export function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [clinic, setClinic] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const res = await fetch('/api/user');
        if (!res.ok) return;
        const json = await res.json();
        const u = json.user || json;
        if (!mounted) return;
        setUser(u);

        // Try to extract clinic/organization information from several common shapes
        const getClinic = (u: any) => {
          if (!u) return null;
          // better-auth organization plugin may put organization or organizations
          if (u.organization) {
            const o = u.organization;
            if (typeof o === 'object') return { id: o.id || o.organization_id || o.clinic_id, name: o.name || o.nome, cnpj: o.cnpj };
            return { id: o, name: String(o) };
          }
          if (u.organizations && Array.isArray(u.organizations) && u.organizations.length > 0) {
            const o = u.organizations[0];
            return { id: o.id || o.organization_id || o.clinic_id, name: o.name || o.nome };
          }
          if (u.current_organization) {
            const o = u.current_organization;
            return { id: o.id || o.organization_id || o.clinic_id, name: o.name || o.nome };
          }
          // neon auth / jwt style
          if (u.user_metadata && u.user_metadata.clinic) {
            const c = u.user_metadata.clinic;
            if (typeof c === 'object') return { id: c.id || c.clinic_id, name: c.name || c.nome };
            return { id: u.user_metadata.clinic_id || u.user_metadata.clinic, name: String(u.user_metadata.clinic) };
          }
          if (u.user_metadata && (u.user_metadata.organization || u.user_metadata.org)) {
            const c = u.user_metadata.organization || u.user_metadata.org;
            if (typeof c === 'object') return { id: c.id || c.organization_id, name: c.name || c.nome };
            return { id: c, name: String(c) };
          }
          if (u.app_metadata && (u.app_metadata.clinic || u.app_metadata.organization)) {
            const c = u.app_metadata.clinic || u.app_metadata.organization;
            if (typeof c === 'object') return { id: c.id || c.clinic_id, name: c.name || c.nome };
            return { id: c, name: String(c) };
          }
          // fallback: direct clinic claim
          if (u.clinic_id || u.clinic) return { id: u.clinic_id || u.clinic, name: u.clinic_name || u.clinic || null };
          return null;
        };

        const c = json.clinic || getClinic(u);
        if (c) setClinic(c);
      } catch (e) {
        // ignore
      }
    }

    loadUser();
    return () => { mounted = false; };
  }, []);
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Main navigation row */}
      <div className="px-4">
        <div className="mx-auto flex h-14  items-center gap-4">
          {/* Mobile hamburger */}
          <MobileSheet user={user} clinic={clinic} />

          {/* Logo */}
          <Link href="/" className="mr-2 flex items-center">
            <Logo />
          </Link>

          {/* Clinic name (if available) */}
          <div className="hidden md:block mr-4">
            <span className="text-sm font-medium text-muted-foreground">{clinic?.name ?? 'Sem clínica'}</span>
          </div>

          {/* Desktop navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {navItems.map((item) =>
                item.children ? (
                  <NavigationMenuItem key={item.title}>
                    <NavigationMenuTrigger className="h-8 text-sm font-medium bg-transparent">
                      {item.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul
                        className={cn(
                          "grid gap-1 p-3",
                          item.children.length > 4
                            ? "w-[520px] grid-cols-2"
                            : "w-[360px] grid-cols-1",
                        )}
                      >
                        {item.children.map((child) => (
                          <ListItem
                            key={child.href}
                            title={child.title}
                            href={child.href}
                            icon={child.icon}
                            badge={child.badge}
                          >
                            {child.description}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem key={item.title}>
                    <Link href={item.href ?? "#"} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "h-8 text-sm font-medium bg-transparent",
                        )}
                      >
                        {item.title}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ),
              )}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right side actions */}
          <div className="ml-auto flex items-center gap-1">
            {/* Search */}
            <SearchBar />

            {/* Separator */}
            <Separator orientation="vertical" className="" />

            {/* User Auth */}
            <UserButton size="icon" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
