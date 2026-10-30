import t1 from "@/assets/thumb-1.jpg";
import t2 from "@/assets/thumb-2.jpg";
import t3 from "@/assets/thumb-3.jpg";
import t4 from "@/assets/thumb-4.jpg";
import videosData from "@/data/videos.json";

export type Video = (typeof videosData)[number];
export type VideoStatus = "Published" | "Scheduled" | "Draft" | "Failed";

const thumbs: Record<number, string> = { 1: t1, 2: t2, 3: t3, 4: t4 };
export const thumbFor = (n: number) => thumbs[n] ?? t1;

export const videos: Video[] = videosData;

export function compact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

export function formatDate(iso: string): string {
  if (!iso) return "—";
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

export const statusTone: Record<string, string> = {
  Published: "bg-success/12 text-success",
  Scheduled: "bg-accent text-accent-foreground",
  Draft: "bg-muted text-muted-foreground",
  Failed: "bg-destructive/12 text-destructive",
};
