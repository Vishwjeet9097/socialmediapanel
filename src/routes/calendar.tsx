import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader, SectionTitle } from "@/components/studio/AppShell";
import { formatDate, statusTone, thumbFor, videos } from "@/lib/studio";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Content Calendar — Creator Studio" },
      { name: "description", content: "Plan your next upload and see your publishing queue in one calendar." },
      { property: "og:title", content: "Content Calendar — Creator Studio" },
      { property: "og:description", content: "Plan your next upload and see your publishing queue in one calendar." },
    ],
  }),
  component: CalendarPage,
});

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function CalendarPage() {
  const [month, setMonth] = useState(new Date(2026, 10, 1));
  const y = month.getFullYear();
  const m = month.getMonth();
  const offset = (new Date(y, m, 1).getDay() + 6) % 7;
  const count = new Date(y, m + 1, 0).getDate();
  const cells = Array.from({ length: Math.ceil((offset + count) / 7) * 7 }, (_, i) => i - offset + 1);
  const key = (d: number) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const queue = videos.filter((v) => v.status === "Scheduled" || v.status === "Draft").sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div>
      <PageHeader title="Content Calendar" subtitle="Plan your next upload. Times shown in Asia/Kolkata." icon={CalendarDays} />

      <div className="mt-8 rounded-[1.6rem] bg-card p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{month.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</h3>
          <div className="flex gap-2">
            <button aria-label="Previous month" onClick={() => setMonth(new Date(y, m - 1, 1))} className="rounded-lg bg-background p-2"><ChevronLeft className="h-4 w-4" /></button>
            <button aria-label="Next month" onClick={() => setMonth(new Date(y, m + 1, 1))} className="rounded-lg bg-background p-2"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-7 gap-2">
          {days.map((d) => <div key={d} className="label-caps pb-1 text-center text-muted-foreground">{d}</div>)}
          {cells.map((d, i) => {
            const valid = d >= 1 && d <= count;
            const items = valid ? videos.filter((v) => v.date === key(d)) : [];
            return (
              <div key={i} className={cn("min-h-24 rounded-xl p-2", valid ? "bg-background" : "opacity-0")}>
                {valid && <p className="text-xs font-semibold text-muted-foreground">{d}</p>}
                {items.map((v) => (
                  <div key={v.id} className={cn("mt-1 truncate rounded-md px-1.5 py-1 text-[10px] font-semibold", statusTone[v.status])} title={v.title}>
                    {v.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <SectionTitle>Publishing queue</SectionTitle>
      <div className="space-y-3">
        {queue.map((v) => (
          <div key={v.id} className="flex items-center gap-4 rounded-2xl bg-card p-3 shadow-soft">
            <img src={thumbFor(v.thumb)} alt="" loading="lazy" width={1088} height={608} className="h-14 w-24 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{v.title}</p>
              <p className="text-xs text-muted-foreground">{formatDate(v.date)} · 7:00 PM IST · {v.visibility}</p>
            </div>
            <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", statusTone[v.status])}>{v.status}</span>
          </div>
        ))}
        <p className="pt-2 text-xs text-muted-foreground">Automatic publishing will work once your YouTube channel is connected.</p>
      </div>
    </div>
  );
}
