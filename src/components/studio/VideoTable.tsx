import { useMemo, useState } from "react";
import { ArrowUpDown, Copy, MoreHorizontal, Trash2, BarChart3, Pencil, CalendarClock } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { compact, formatDate, statusTone, thumbFor, type Video } from "@/lib/studio";
import { cn } from "@/lib/utils";

type SortKey = "date" | "views" | "likes";

export function VideoTable({
  rows,
  onDelete,
  compactMode = false,
}: {
  rows: Video[];
  onDelete?: (id: string) => void;
  compactMode?: boolean;
}) {
  const [sort, setSort] = useState<SortKey>("date");
  const [pendingDelete, setPendingDelete] = useState<Video | null>(null);

  const sorted = useMemo(
    () =>
      [...rows].sort((a, b) =>
        sort === "date" ? b.date.localeCompare(a.date) : (b[sort] as number) - (a[sort] as number),
      ),
    [rows, sort],
  );

  const SortBtn = ({ k, children }: { k: SortKey; children: string }) => (
    <button
      onClick={() => setSort(k)}
      className={cn("inline-flex items-center gap-1", sort === k && "text-primary")}
    >
      {children} <ArrowUpDown className="h-3 w-3" />
    </button>
  );

  if (!rows.length) {
    return (
      <div className="rounded-2xl border border-dashed py-16 text-center">
        <p className="font-semibold">Nothing here yet</p>
        <p className="mt-1 text-sm text-muted-foreground">Try a different filter or upload a new video.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-sm">
        <thead>
          <tr className="label-caps text-left text-muted-foreground">
            <th className="pb-3 font-semibold">Video</th>
            <th className="pb-3 font-semibold">Type</th>
            <th className="pb-3 font-semibold"><SortBtn k="date">Date</SortBtn></th>
            <th className="pb-3 text-right font-semibold"><SortBtn k="views">Views</SortBtn></th>
            {!compactMode && <th className="pb-3 text-right font-semibold">Watch hrs</th>}
            <th className="pb-3 text-right font-semibold"><SortBtn k="likes">Likes</SortBtn></th>
            {!compactMode && <th className="pb-3 text-right font-semibold">Comments</th>}
            <th className="pb-3 pl-6 font-semibold">Status</th>
            <th className="pb-3" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((v) => {
            const empty = v.status !== "Published";
            return (
              <tr key={v.id} className="border-t transition hover:bg-accent/50">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={thumbFor(v.thumb)}
                      alt=""
                      loading="lazy"
                      width={1088}
                      height={608}
                      className="h-11 w-20 shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-medium">{v.title}</p>
                      {!compactMode && (
                        <p className="truncate text-xs text-muted-foreground">{v.description}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="text-muted-foreground">{v.type}</td>
                <td className="text-muted-foreground">{formatDate(v.date)}</td>
                <td className="text-right tabular-nums">{empty ? "—" : compact(v.views)}</td>
                {!compactMode && (
                  <td className="text-right tabular-nums">{empty ? "—" : compact(v.watchHours)}</td>
                )}
                <td className="text-right tabular-nums">{empty ? "—" : compact(v.likes)}</td>
                {!compactMode && (
                  <td className="text-right tabular-nums">{empty ? "—" : compact(v.comments)}</td>
                )}
                <td className="pl-6">
                  <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", statusTone[v.status])}>
                    {v.status}
                  </span>
                </td>
                <td className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger aria-label="Video actions" className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                      <DropdownMenuItem onClick={() => toast("Editing is a preview in demo mode")}>
                        <Pencil className="h-4 w-4" /> Edit details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast("Scheduling preview — nothing is published")}>
                        <CalendarClock className="h-4 w-4" /> Schedule
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast("Analytics for this video use sample data")}>
                        <BarChart3 className="h-4 w-4" /> View analytics
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          navigator.clipboard?.writeText(`https://youtu.be/${v.id}`);
                          toast.success("Link copied");
                        }}
                      >
                        <Copy className="h-4 w-4" /> Copy video link
                      </DropdownMenuItem>
                      {onDelete && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => setPendingDelete(v)}>
                            <Trash2 className="h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this video?</AlertDialogTitle>
            <AlertDialogDescription>
              "{pendingDelete?.title}" will be removed from this list. This only affects demo data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (pendingDelete) onDelete?.(pendingDelete.id);
                toast.success("Video removed");
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
