import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarClock, Eye, Clock, Users, IndianRupee, LayoutGrid, RefreshCw, TrendingDown, TrendingUp, Upload, BarChart3, Lightbulb, Info } from "lucide-react";
import { PageHeader, SectionTitle, SampleBadge, IconSquare } from "@/components/studio/AppShell";
import { VideoTable } from "@/components/studio/VideoTable";
import analytics from "@/data/analytics.json";
import notifications from "@/data/notifications.json";
import { compact, formatDate, thumbFor, videos } from "@/lib/studio";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Channel Overview — Creator Studio" },
      { name: "description", content: "Your YouTube channel at a glance: views, watch time, subscribers and recent uploads." },
      { property: "og:title", content: "Channel Overview — Creator Studio" },
      { property: "og:description", content: "Your YouTube channel at a glance: views, watch time, subscribers and recent uploads." },
    ],
  }),
  component: Dashboard,
});

const s = analytics.summary;
const cards = [
  { label: "Total views", value: compact(s.views.value), change: s.views.change, icon: Eye, key: "views" as const },
  { label: "Watch time", value: `${compact(s.watchHours.value)} hrs`, change: s.watchHours.change, icon: Clock, key: "watchHours" as const },
  { label: "Subscribers", value: compact(s.subscribers.value), change: s.subscribers.change, icon: Users, key: "subscribers" as const, extra: `+${compact(s.subscribers.gained)} / −${s.subscribers.lost}` },
  { label: "Est. revenue", value: `₹${compact(s.revenue.value)}`, change: s.revenue.change, icon: IndianRupee, key: "views" as const, sample: true },
];

const metrics = [
  { key: "views", label: "Views" },
  { key: "watchHours", label: "Watch time" },
  { key: "subscribers", label: "Subscribers" },
] as const;
const ranges = ["7 days", "28 days", "90 days", "365 days"];

function Dashboard() {
  const [metric, setMetric] = useState<(typeof metrics)[number]["key"]>("views");
  const [range, setRange] = useState("28 days");
  const scheduled = videos.filter((v) => v.status === "Scheduled");
  const published = videos.filter((v) => v.status === "Published");

  return (
    <div>
      <PageHeader
        title="Channel Overview"
        subtitle="Manage your videos and track how your channel is growing."
        icon={LayoutGrid}
        actions={
          <>
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="h-11 rounded-xl bg-muted px-4 text-sm font-medium outline-hidden"
            >
              {ranges.map((r) => <option key={r} value={r}>Last {r}</option>)}
            </select>
            <IconSquare label="Refresh"><RefreshCw className="h-5 w-5" /></IconSquare>
          </>
        }
      />

      <SectionTitle aside={<SampleBadge />}>Your channel at a glance</SectionTitle>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c, i) => {
          const featured = i === 0;
          const up = c.change >= 0;
          return (
            <div
              key={c.label}
              className={cn(
                "relative rounded-[1.4rem] p-5 transition hover:-translate-y-0.5",
                featured ? "bg-primary text-primary-foreground shadow-lift" : "bg-card shadow-soft",
              )}
            >
              <div className="flex items-center justify-between">
                <p className={cn("label-caps", featured ? "opacity-90" : "text-muted-foreground")}>{c.label}</p>
                <c.icon className={cn("h-5 w-5", featured ? "opacity-90" : "text-primary")} />
              </div>
              <p className="mt-4 text-3xl font-bold tracking-tight">{c.value}</p>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className={cn("inline-flex items-center gap-1 font-semibold", !featured && (up ? "text-success" : "text-destructive"))}>
                  {up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  {up ? "+" : ""}{c.change}%
                </span>
                <span className={featured ? "opacity-80" : "text-muted-foreground"}>{c.extra ?? "vs previous period"}</span>
              </div>
              <div className="mt-4 h-10">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.series}>
                    <Bar dataKey={c.key} radius={3} fill={featured ? "var(--primary-foreground)" : "var(--chart-3)"} fillOpacity={featured ? 0.55 : 1} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {c.sample && <p className="mt-2 text-[10px] text-muted-foreground">Estimate · sample only</p>}
            </div>
          );
        })}
      </div>

      <div className="mt-10 grid gap-6 xl:grid-cols-3">
        <div className="rounded-[1.6rem] bg-card p-6 shadow-soft xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold">How your videos are performing</h3>
              <p className="text-xs text-muted-foreground">Views over time · last {range}</p>
            </div>
            <div className="flex rounded-xl bg-background p-1">
              {metrics.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMetric(m.key)}
                  className={cn(
                    "rounded-lg px-3.5 py-1.5 text-xs font-semibold transition",
                    metric === m.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.series} margin={{ left: -10, right: 8 }}>
                <defs>
                  <linearGradient id="fillMain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" tickFormatter={(v) => compact(v)} />
                <Tooltip
                  formatter={(v: number) => compact(v)}
                  contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", fontSize: 12 }}
                />
                <Area type="monotone" dataKey={metric} stroke="var(--primary)" strokeWidth={2.5} fill="url(#fillMain)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[1.6rem] bg-card p-6 shadow-soft">
          <h3 className="text-lg font-semibold">Quick actions</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { to: "/upload", label: "Upload video", icon: Upload },
              { to: "/calendar", label: "Schedule video", icon: CalendarClock },
              { to: "/analytics", label: "View analytics", icon: BarChart3 },
              { to: "/ideas", label: "Plan content", icon: Lightbulb },
            ].map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className="flex flex-col gap-3 rounded-2xl bg-background p-4 text-sm font-semibold transition hover:bg-accent hover:text-accent-foreground"
              >
                <a.icon className="h-5 w-5 text-primary" /> {a.label}
              </Link>
            ))}
          </div>
          <h3 className="mt-7 text-sm font-semibold">Recent activity</h3>
          <ul className="mt-3 space-y-3">
            {notifications.slice(0, 3).map((n) => (
              <li key={n.id} className="flex gap-3 text-xs">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                <div>
                  <p>{n.text}</p>
                  <p className="text-muted-foreground">{n.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <SectionTitle aside={<Link to="/calendar" className="text-sm font-semibold text-primary">See calendar</Link>}>
        Videos waiting to go live
      </SectionTitle>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {scheduled.map((v) => (
          <div key={v.id} className="overflow-hidden rounded-[1.4rem] bg-card shadow-soft">
            <img src={thumbFor(v.thumb)} alt={v.title} loading="lazy" width={1088} height={608} className="aspect-video w-full object-cover" />
            <div className="p-4">
              <p className="label-caps text-muted-foreground">{v.type}</p>
              <p className="mt-1 line-clamp-1 font-semibold">{v.title}</p>
              <p className="mt-2 text-xs text-primary">{formatDate(v.date)} · 7:00 PM IST</p>
            </div>
          </div>
        ))}
        {published.slice(0, 2).map((v) => (
          <div key={v.id} className="overflow-hidden rounded-[1.4rem] bg-card shadow-soft">
            <img src={thumbFor(v.thumb)} alt={v.title} loading="lazy" width={1088} height={608} className="aspect-video w-full object-cover" />
            <div className="p-4">
              <p className="label-caps text-muted-foreground">Just published</p>
              <p className="mt-1 line-clamp-1 font-semibold">{v.title}</p>
              <p className="mt-2 text-xs text-muted-foreground">{compact(v.views)} views</p>
            </div>
          </div>
        ))}
      </div>

      <SectionTitle aside={<Link to="/content" className="text-sm font-semibold text-primary">All videos</Link>}>
        Recent uploads
      </SectionTitle>
      <VideoTable rows={published.slice(0, 6)} compactMode />
    </div>
  );
}
