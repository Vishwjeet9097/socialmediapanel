import { createFileRoute } from "@tanstack/react-router";
import { Tv, Link2 } from "lucide-react";
import { PageHeader } from "@/components/studio/AppShell";
import channel from "@/data/channel.json";
import { compact, formatDate, thumbFor } from "@/lib/studio";

export const Route = createFileRoute("/channel")({
  head: () => ({
    meta: [
      { title: "Channel — Creator Studio" },
      { name: "description", content: "Your channel details, banner and YouTube connection status." },
      { property: "og:title", content: "Channel — Creator Studio" },
      { property: "og:description", content: "Your channel details, banner and YouTube connection status." },
    ],
  }),
  component: ChannelPage,
});

function ChannelPage() {
  const facts = [
    ["Subscribers", compact(channel.subscribers)],
    ["Total videos", String(channel.totalVideos)],
    ["Created", formatDate(channel.createdAt)],
  ];
  return (
    <div>
      <PageHeader title="Channel" subtitle="How your channel looks to viewers." icon={Tv} />
      <div className="mt-8 overflow-hidden rounded-[1.6rem] bg-card shadow-soft">
        <img src={thumbFor(2)} alt="Channel banner" width={1088} height={608} className="h-48 w-full object-cover" />
        <div className="flex flex-wrap items-end gap-5 px-6 pb-6">
          <span className="-mt-10 grid h-24 w-24 place-items-center rounded-full border-4 border-card bg-primary text-3xl font-bold text-primary-foreground">W</span>
          <div className="pt-4">
            <h2 className="text-2xl font-bold">{channel.name}</h2>
            <p className="text-sm text-muted-foreground">{channel.handle} · {channel.url}</p>
          </div>
        </div>
        <p className="px-6 pb-6 text-sm">{channel.description}</p>
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-4">
        {facts.map(([l, v]) => (
          <div key={l} className="rounded-2xl bg-card p-5 shadow-soft">
            <p className="label-caps text-muted-foreground">{l}</p>
            <p className="mt-2 text-2xl font-bold">{v}</p>
          </div>
        ))}
        <div className="rounded-2xl bg-primary p-5 text-primary-foreground shadow-lift">
          <p className="label-caps opacity-80">Your YouTube channel</p>
          <p className="mt-2 flex items-center gap-2 text-lg font-bold"><Link2 className="h-4 w-4" /> {channel.connection}</p>
          <p className="mt-1 text-xs opacity-80">Connecting your real channel comes later.</p>
        </div>
      </div>
    </div>
  );
}
