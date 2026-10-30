import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Bell,
  BarChart3,
  CalendarDays,
  CircleHelp,
  Clapperboard,
  HardDrive,
  LayoutGrid,
  Lightbulb,
  Menu,
  Search,
  Settings,
  SlidersHorizontal,
  Tv,
  Upload,
  X,
  Youtube,
  ArrowUpRight,
} from "lucide-react";
import channel from "@/data/channel.json";
import notifications from "@/data/notifications.json";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Overview", icon: LayoutGrid },
  { to: "/content", label: "Content", icon: Clapperboard },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/ideas", label: "Content Ideas", icon: Lightbulb },
  { to: "/channel", label: "Channel", icon: Tv },
] as const;

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const pct = (channel.storage.used / channel.storage.total) * 100;
  return (
    <div className="flex h-full flex-col px-7 pb-8 pt-10 text-sidebar-foreground">
      <Link
        to="/upload"
        onClick={onNavigate}
        className="flex items-center justify-center gap-2 rounded-full bg-sidebar-primary py-3.5 text-sm font-semibold text-sidebar-primary-foreground shadow-lift transition hover:-translate-y-0.5"
      >
        <Upload className="h-4 w-4" /> Upload New Video
      </Link>

      <nav className="mt-10 flex flex-col gap-1">
        {nav.map((item) => {
          const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-4 rounded-xl px-3 py-3 text-sm font-medium transition",
                active ? "bg-sidebar-accent" : "opacity-80 hover:bg-sidebar-accent hover:opacity-100",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-10">
        <p className="label-caps opacity-80">Storage details</p>
        <div className="mt-4 flex items-center gap-2 text-xs">
          <HardDrive className="h-4 w-4" /> Video storage
        </div>
        <div className="mt-2 h-1 rounded-full bg-sidebar-accent">
          <div className="h-1 rounded-full bg-sidebar-primary" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-[11px] opacity-80">
          {channel.storage.used} GB of {channel.storage.total} GB used
        </p>
        <button className="mt-6 flex items-center gap-1 text-xs font-semibold">
          Upgrade storage <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen p-0 md:p-5">
      <div className="mx-auto flex min-h-screen max-w-[1500px] flex-col overflow-hidden bg-background md:min-h-[calc(100vh-2.5rem)] md:rounded-[2rem]">
        {/* Top bar */}
        <header className="flex items-center gap-4 px-5 py-5 md:px-8">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-6 w-6 text-primary" />
          </button>
          <Link to="/" className="flex w-auto items-center gap-2.5 lg:w-[240px]">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Youtube className="h-5 w-5" />
            </span>
            <span className="text-xl font-bold tracking-tight text-primary">Creator Studio</span>
          </Link>
          <div className="relative hidden max-w-md flex-1 md:block">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search videos, ideas, scripts"
              className="w-full rounded-full bg-muted py-3 pl-11 pr-4 text-sm outline-hidden placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/30"
            />
          </div>
          <div className="ml-auto flex items-center gap-5 text-foreground">
            <Popover>
              <PopoverTrigger aria-label="Notifications" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-destructive" />
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 rounded-2xl p-0">
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <p className="text-sm font-semibold">Notifications</p>
                  <span className="text-[10px] text-muted-foreground">Sample events</span>
                </div>
                {notifications.map((n) => (
                  <div key={n.id} className="border-b px-4 py-3 last:border-0">
                    <p className="text-sm">{n.text}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{n.time}</p>
                  </div>
                ))}
              </PopoverContent>
            </Popover>
            <CircleHelp className="hidden h-5 w-5 sm:block" />
            <Link to="/channel" aria-label="Settings" className="hidden sm:block">
              <Settings className="h-5 w-5" />
            </Link>
            <div className="ml-2 flex items-center gap-3">
              <span className="hidden text-xs font-medium text-muted-foreground sm:block">{channel.owner}</span>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {channel.owner[0]}
              </span>
            </div>
            <SlidersHorizontal className="hidden h-6 w-6 text-muted-foreground md:block" />
          </div>
        </header>

        <div className="flex flex-1">
          <aside className="hidden w-[270px] shrink-0 rounded-tr-[3.5rem] bg-sidebar lg:block">
            <SidebarBody />
          </aside>
          <main className="min-w-0 flex-1 px-5 pb-10 pt-4 md:px-10">{children}</main>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setOpen(false)} />
          <aside className="relative h-full w-72 rounded-r-[2.5rem] bg-sidebar">
            <button
              className="absolute right-5 top-5 text-sidebar-foreground"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarBody onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  actions,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div>
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-primary">{title}</h1>
          {Icon && (
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft">
              <Icon className="h-5 w-5" />
            </span>
          )}
        </div>
        {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="ml-auto flex items-center gap-3">{actions}</div>}
    </div>
  );
}

export function SectionTitle({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="mb-4 mt-10 flex items-center justify-between">
      <h2 className="text-lg font-semibold uppercase tracking-wide text-foreground">{children}</h2>
      {aside}
    </div>
  );
}

export function SampleBadge() {
  return (
    <span className="rounded-full bg-warning/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-warning">
      Sample data
    </span>
  );
}

export function IconSquare({ children, label }: { children: ReactNode; label: string }) {
  return (
    <button
      aria-label={label}
      className="grid h-11 w-11 place-items-center rounded-xl bg-muted text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
    >
      {children}
    </button>
  );
}
