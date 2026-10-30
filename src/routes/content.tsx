import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Clapperboard, Search } from "lucide-react";
import { PageHeader } from "@/components/studio/AppShell";
import { VideoTable } from "@/components/studio/VideoTable";
import { videos as initial } from "@/lib/studio";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/content")({
  head: () => ({
    meta: [
      { title: "Content — Creator Studio" },
      { name: "description", content: "Browse, filter and manage all your videos, Shorts, live streams and drafts." },
      { property: "og:title", content: "Content — Creator Studio" },
      { property: "og:description", content: "Browse, filter and manage all your videos, Shorts, live streams and drafts." },
    ],
  }),
  component: ContentPage,
});

const tabs = ["All", "Shorts", "Videos", "Live", "Drafts", "Scheduled", "Published", "Failed"] as const;

function ContentPage() {
  const [rows, setRows] = useState(initial);
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const [q, setQ] = useState("");

  const filtered = rows.filter((v) => {
    const t =
      tab === "All" ||
      (tab === "Shorts" && v.type === "Short") ||
      (tab === "Videos" && v.type === "Video") ||
      (tab === "Live" && v.type === "Live") ||
      (tab === "Drafts" && v.status === "Draft") ||
      v.status === tab;
    return t && v.title.toLowerCase().includes(q.toLowerCase());
  });

  return (
    <div>
      <PageHeader title="Content" subtitle="Every video on your channel, in one place." icon={Clapperboard} />
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1 rounded-xl bg-muted p-1">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-lg px-3.5 py-1.5 text-xs font-semibold transition",
                tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="relative ml-auto w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title"
            className="w-full rounded-xl bg-muted py-2.5 pl-10 pr-3 text-sm outline-hidden focus:ring-2 focus:ring-ring/30"
          />
        </div>
      </div>
      <div className="mt-6">
        <VideoTable rows={filtered} onDelete={(id) => setRows((r) => r.filter((v) => v.id !== id))} />
      </div>
    </div>
  );
}
