import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Check, CloudUpload, FileVideo, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/studio/AppShell";
import { thumbFor } from "@/lib/studio";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload a Video — Creator Studio" },
      { name: "description", content: "Prepare your next video: details, thumbnail, visibility and publishing." },
      { property: "og:title", content: "Upload a Video — Creator Studio" },
      { property: "og:description", content: "Prepare your next video: details, thumbnail, visibility and publishing." },
    ],
  }),
  component: UploadPage,
});

const steps = ["Select video", "Add details", "Choose thumbnail", "Set visibility", "Review & publish"];
const field = "w-full rounded-xl bg-muted px-4 py-3 text-sm outline-hidden focus:ring-2 focus:ring-ring/30";

function UploadPage() {
  const [step, setStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState("");
  const [thumb, setThumb] = useState(1);
  const [visibility, setVisibility] = useState("Public");
  const [when, setWhen] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file || progress >= 100) return;
    const t = setTimeout(() => setProgress((p) => Math.min(100, p + 7)), 120);
    return () => clearTimeout(t);
  }, [file, progress]);

  const pick = (f?: File) => {
    if (!f) return;
    setFile(f);
    setProgress(0);
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, ""));
  };

  const finish = (action: string) => {
    toast.success(`${action} (demo) — nothing was sent to YouTube`);
  };

  return (
    <div>
      <PageHeader title="Upload a Video" subtitle="Prepare your next video for your YouTube channel." icon={Upload} />

      <ol className="mt-8 flex flex-wrap gap-2">
        {steps.map((s, i) => (
          <li key={s}>
            <button
              disabled={i > step && !file}
              onClick={() => setStep(i)}
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition disabled:opacity-40",
                i === step ? "bg-primary text-primary-foreground" : i < step ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground",
              )}
            >
              <span className="grid h-5 w-5 place-items-center rounded-full bg-background/30">
                {i < step ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              {s}
            </button>
          </li>
        ))}
      </ol>

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <div className="rounded-[1.6rem] bg-card p-6 shadow-soft xl:col-span-2">
          {step === 0 && (
            <div>
              {!file ? (
                <button
                  onClick={() => inputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    pick(e.dataTransfer.files[0]);
                  }}
                  className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/30 bg-background py-20 text-center transition hover:border-primary"
                >
                  <span className="grid h-16 w-16 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lift">
                    <CloudUpload className="h-7 w-7" />
                  </span>
                  <p className="mt-5 font-semibold">Drag and drop a video file</p>
                  <p className="mt-1 text-sm text-muted-foreground">or click to browse · MP4, MOV, WEBM</p>
                </button>
              ) : (
                <div className="flex items-center gap-4 rounded-2xl bg-background p-4">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-accent-foreground">
                    <FileVideo className="h-6 w-6" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(1)} MB · {progress < 100 ? `Preparing ${progress}%` : "Ready (simulated)"}
                    </p>
                    <div className="mt-2 h-1.5 rounded-full bg-muted">
                      <div className="h-1.5 rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                  <button onClick={() => inputRef.current?.click()} className="text-xs font-semibold text-primary">Replace</button>
                  <button aria-label="Remove" onClick={() => setFile(null)} className="text-muted-foreground"><X className="h-4 w-4" /></button>
                </div>
              )}
              <input ref={inputRef} type="file" accept="video/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <label className="block">
                <span className="flex justify-between text-sm font-semibold">Title <span className="font-normal text-muted-foreground">{title.length}/100</span></span>
                <input maxLength={100} value={title} onChange={(e) => setTitle(e.target.value)} className={cn(field, "mt-2")} />
              </label>
              <label className="block">
                <span className="flex justify-between text-sm font-semibold">Description <span className="font-normal text-muted-foreground">{desc.length}/5000</span></span>
                <textarea maxLength={5000} rows={6} value={desc} onChange={(e) => setDesc(e.target.value)} className={cn(field, "mt-2")} />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold">Tags
                  <input placeholder="travel, india, vlog" value={tags} onChange={(e) => setTags(e.target.value)} className={cn(field, "mt-2 font-normal")} />
                </label>
                <label className="block text-sm font-semibold">Category
                  <select className={cn(field, "mt-2 font-normal")}><option>Travel & Events</option><option>Food</option><option>Science & Technology</option></select>
                </label>
                <label className="block text-sm font-semibold">Audience
                  <select className={cn(field, "mt-2 font-normal")}><option>Not made for kids</option><option>Made for kids</option></select>
                </label>
                <label className="block text-sm font-semibold">Language
                  <select className={cn(field, "mt-2 font-normal")}><option>English</option><option>Hindi</option></select>
                </label>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[1, 2, 3, 4].map((n) => (
                <button key={n} onClick={() => setThumb(n)} className={cn("overflow-hidden rounded-xl ring-offset-2 transition", thumb === n ? "ring-3 ring-primary" : "opacity-70 hover:opacity-100")}>
                  <img src={thumbFor(n)} alt={`Thumbnail option ${n}`} width={1088} height={608} className="aspect-video w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              {["Public", "Unlisted", "Private", "Schedule for later"].map((v) => (
                <label key={v} className={cn("flex cursor-pointer items-center gap-3 rounded-xl p-4 transition", visibility === v ? "bg-accent text-accent-foreground" : "bg-background")}>
                  <input type="radio" checked={visibility === v} onChange={() => setVisibility(v)} className="accent-primary" />
                  <span className="text-sm font-semibold">{v}</span>
                </label>
              ))}
              {visibility === "Schedule for later" && (
                <label className="block pt-2 text-sm font-semibold">Date & time (Asia/Kolkata)
                  <input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} className={cn(field, "mt-2 font-normal")} />
                </label>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 text-sm">
              <img src={thumbFor(thumb)} alt="" width={1088} height={608} className="aspect-video w-full max-w-md rounded-xl object-cover" />
              <p><span className="text-muted-foreground">Title:</span> {title || "—"}</p>
              <p><span className="text-muted-foreground">Visibility:</span> {visibility}{when && ` · ${when}`}</p>
              <p><span className="text-muted-foreground">Tags:</span> {tags || "—"}</p>
              <p className="rounded-xl bg-warning/12 p-3 text-xs text-warning">Demo mode: publishing is simulated. Real uploads need a YouTube connection.</p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap justify-between gap-3">
            <button disabled={step === 0} onClick={() => setStep((s) => s - 1)} className="rounded-xl bg-muted px-5 py-2.5 text-sm font-semibold disabled:opacity-40">Back</button>
            {step < 4 ? (
              <button disabled={!file} onClick={() => setStep((s) => s + 1)} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft disabled:opacity-40">Continue</button>
            ) : (
              <div className="flex gap-3">
                <button onClick={() => finish("Saved as draft")} className="rounded-xl bg-muted px-5 py-2.5 text-sm font-semibold">Save as draft</button>
                <button onClick={() => finish("Scheduled")} className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground">Schedule</button>
                <button onClick={() => finish("Published")} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft">Publish now</button>
              </div>
            )}
          </div>
        </div>

        <aside className="h-fit rounded-[1.6rem] bg-primary p-6 text-primary-foreground shadow-lift">
          <p className="label-caps opacity-80">Preview</p>
          <img src={thumbFor(thumb)} alt="" width={1088} height={608} className="mt-4 aspect-video w-full rounded-xl object-cover" />
          <p className="mt-4 line-clamp-2 font-semibold">{title || "Your video title"}</p>
          <p className="mt-1 text-xs opacity-80">{visibility}</p>
        </aside>
      </div>
    </div>
  );
}
