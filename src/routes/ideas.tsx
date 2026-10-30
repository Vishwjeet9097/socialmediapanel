import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Lightbulb, Plus } from "lucide-react";
import { PageHeader } from "@/components/studio/AppShell";
import initial from "@/data/ideas.json";
import { formatDate } from "@/lib/studio";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ideas")({
  head: () => ({
    meta: [
      { title: "Content Ideas — Creator Studio" },
      { name: "description", content: "Capture video ideas and move them from idea to upload." },
      { property: "og:title", content: "Content Ideas — Creator Studio" },
      { property: "og:description", content: "Capture video ideas and move them from idea to upload." },
    ],
  }),
  component: IdeasPage,
});

const columns = ["Idea", "Planned", "Script Ready", "In Production", "Ready to Upload"];

function IdeasPage() {
  const [ideas, setIdeas] = useState(initial);
  const [title, setTitle] = useState("");

  const add = () => {
    if (!title.trim()) return;
    setIdeas((i) => [...i, { id: crypto.randomUUID(), title, topic: "General", type: "Video", priority: "Medium", status: "Idea", date: "" }]);
    setTitle("");
  };
  const advance = (id: string) =>
    setIdeas((list) =>
      list.map((x) => (x.id === id ? { ...x, status: columns[Math.min(columns.indexOf(x.status) + 1, columns.length - 1)] ?? x.status } : x)),
    );

  return (
    <div>
      <PageHeader title="Content Ideas" subtitle="Jot it down now, film it later." icon={Lightbulb} />
      <div className="mt-8 flex gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="New video idea…"
          className="flex-1 rounded-xl bg-muted px-4 py-3 text-sm outline-hidden focus:ring-2 focus:ring-ring/30"
        />
        <button onClick={add} className="flex items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-soft">
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3 xl:grid-cols-5">
        {columns.map((c) => (
          <div key={c} className="rounded-[1.4rem] bg-card p-4">
            <p className="label-caps text-muted-foreground">{c}</p>
            <div className="mt-3 space-y-3">
              {ideas.filter((i) => i.status === c).map((i) => (
                <div key={i.id} className="rounded-xl bg-background p-3 shadow-soft">
                  <p className="text-sm font-semibold">{i.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{i.topic} · {i.type}{i.date && ` · ${formatDate(i.date)}`}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", i.priority === "High" ? "bg-destructive/12 text-destructive" : "bg-muted text-muted-foreground")}>{i.priority}</span>
                    {c !== columns.at(-1) && (
                      <button onClick={() => advance(i.id)} className="text-xs font-semibold text-primary">Move on →</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
