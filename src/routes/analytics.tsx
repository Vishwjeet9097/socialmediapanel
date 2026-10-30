import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BarChart3 } from "lucide-react";
import { PageHeader, SectionTitle, SampleBadge } from "@/components/studio/AppShell";
import analytics from "@/data/analytics.json";
import { compact, thumbFor, videos } from "@/lib/studio";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Creator Studio" },
      { name: "description", content: "Views, watch time, reach and audience breakdowns for your YouTube channel." },
      { property: "og:title", content: "Analytics — Creator Studio" },
      { property: "og:description", content: "Views, watch time, reach and audience breakdowns for your YouTube channel." },
    ],
  }),
  component: AnalyticsPage,
});

const pieColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
const tip = { borderRadius: 12, border: "1px solid var(--border)", fontSize: 12 };

function AnalyticsPage() {
  const { summary: s, reach, audience } = analytics;
  const stats = [
    ["Views", compact(s.views.value)],
    ["Watch time", `${compact(s.watchHours.value)} hrs`],
    ["Subscribers", compact(s.subscribers.value)],
    ["Impressions", compact(reach.impressions)],
    ["Click-through rate", `${reach.ctr}%`],
    ["Avg. view duration", reach.avgViewDuration],
  ];
  const top = [...videos].filter((v) => v.views > 0).sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <div>
      <PageHeader title="Analytics" subtitle="See what's working and who's watching." icon={BarChart3} actions={<SampleBadge />} />

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {stats.map(([l, v]) => (
          <div key={l} className="rounded-2xl bg-card p-4 shadow-soft">
            <p className="label-caps text-muted-foreground">{l}</p>
            <p className="mt-2 text-2xl font-bold">{v}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="rounded-[1.6rem] bg-card p-6 shadow-soft">
          <h3 className="font-semibold">Views over time</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer>
              <LineChart data={analytics.series}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="day" fontSize={11} tickLine={false} axisLine={false} stroke="var(--muted-foreground)" />
                <YAxis fontSize={11} tickLine={false} axisLine={false} stroke="var(--muted-foreground)" tickFormatter={compact} />
                <Tooltip contentStyle={tip} formatter={(v: number) => compact(v)} />
                <Line dataKey="views" stroke="var(--primary)" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-[1.6rem] bg-card p-6 shadow-soft">
          <h3 className="font-semibold">Subscribers gained</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer>
              <BarChart data={analytics.series}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="day" fontSize={11} tickLine={false} axisLine={false} stroke="var(--muted-foreground)" />
                <YAxis fontSize={11} tickLine={false} axisLine={false} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={tip} />
                <Bar dataKey="subscribers" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <SectionTitle>Audience</SectionTitle>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-[1.6rem] bg-primary p-6 text-primary-foreground shadow-lift">
          <p className="label-caps opacity-80">Viewers</p>
          <p className="mt-3 text-4xl font-bold">{audience.new}%</p>
          <p className="text-sm opacity-80">new viewers</p>
          <p className="mt-4 text-4xl font-bold">{audience.returning}%</p>
          <p className="text-sm opacity-80">returning viewers</p>
          <p className="mt-4 text-xs opacity-80">{audience.subscriberViews}% of views come from subscribers</p>
        </div>
        {[{ t: "Age", d: audience.age }, { t: "Devices", d: audience.devices }].map((g) => (
          <div key={g.t} className="rounded-[1.6rem] bg-card p-6 shadow-soft">
            <h3 className="font-semibold">{g.t}</h3>
            <div className="h-40">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={g.d} dataKey="value" nameKey="label" innerRadius={42} outerRadius={64} paddingAngle={3}>
                    {g.d.map((_, i) => <Cell key={i} fill={pieColors[i % 5]} />)}
                  </Pie>
                  <Tooltip contentStyle={tip} formatter={(v: number) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="grid grid-cols-2 gap-1 text-xs">
              {g.d.map((x, i) => (
                <li key={x.label} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: pieColors[i % 5] }} />
                  {x.label} <span className="ml-auto text-muted-foreground">{x.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="rounded-[1.6rem] bg-card p-6 shadow-soft">
          <h3 className="font-semibold">Top countries</h3>
          <ul className="mt-4 space-y-3">
            {audience.countries.map((c) => (
              <li key={c.label} className="text-sm">
                <div className="flex justify-between"><span>{c.label}</span><span className="text-muted-foreground">{c.value}%</span></div>
                <div className="mt-1.5 h-1.5 rounded-full bg-muted"><div className="h-1.5 rounded-full bg-primary" style={{ width: `${c.value}%` }} /></div>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[1.6rem] bg-card p-6 shadow-soft">
          <h3 className="font-semibold">Top performing videos</h3>
          <ul className="mt-4 space-y-3">
            {top.map((v, i) => (
              <li key={v.id} className="flex items-center gap-3 text-sm">
                <span className="w-4 font-bold text-primary">{i + 1}</span>
                <img src={thumbFor(v.thumb)} alt="" loading="lazy" width={1088} height={608} className="h-10 w-16 rounded-lg object-cover" />
                <span className="min-w-0 flex-1 truncate">{v.title}</span>
                <span className="text-xs text-muted-foreground">{v.type}</span>
                <span className="w-14 text-right font-semibold tabular-nums">{compact(v.views)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
