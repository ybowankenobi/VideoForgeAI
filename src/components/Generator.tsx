"use client";

import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Wand2,
  Loader2,
  Video,
  Download,
  Share2,
  RefreshCw,
  Dice5,
  Settings2,
  X,
  Check,
  Copy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VIDEO_MODELS, RESOLUTIONS, ASPECT_RATIOS } from "@/lib/utils";

type GenStatus = {
  id: number;
  status: string;
  progress?: number;
  stage?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  error?: string;
  prompt?: string;
  model?: string;
  duration?: number;
  resolution?: string;
  aspectRatio?: string;
  simulated?: boolean;
};

const EXAMPLE_PROMPTS = [
  "Cinematic aerial shot of a futuristic cyberpunk city at night with flying cars, neon reflections, rain on asphalt, volumetric fog, 8K",
  "Epic mountain landscape at golden hour, clouds rolling over snow-capped peaks, river winding through valley, drone shot, cinematic color grading",
  "A majestic tiger walking through a lush bamboo forest, dappled sunlight, slow motion, shallow depth of field, National Geographic style",
  "Underwater coral reef teeming with colorful tropical fish, sun rays penetrating the clear blue water, serene and peaceful",
  "An astronaut floating outside a space station with Earth in the background, stars, cinematic lens flare, hyperrealistic",
  "Cozy cabin in a snowy forest at dusk, smoke from chimney, warm window light, gentle snowfall, cinematic B-roll",
  "A ballerina dancing in a grand abandoned theater, dust motes in sunbeams, slow graceful movements, cinematic 35mm film",
  "Mystical forest with bioluminescent plants and fireflies at twilight, magical atmosphere, Studio Ghibli inspired animation",
];

export default function Generator() {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [model, setModel] = useState<string>("cogvideox-5b");
  const [duration, setDuration] = useState(10);
  const [resolution, setResolution] = useState<string>("1080p");
  const [aspectRatio, setAspectRatio] = useState<string>("16:9");
  const [motionStrength, setMotionStrength] = useState(50);
  const [seed, setSeed] = useState<number | "">("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [current, setCurrent] = useState<GenStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const pollRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
    };
  }, []);

  async function startGeneration() {
    if (!prompt.trim() || submitting) return;
    setError(null);
    setSubmitting(true);
    setCurrent(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          negativePrompt: negativePrompt || undefined,
          model,
          duration,
          resolution,
          aspectRatio,
          motionStrength,
          seed: seed === "" ? undefined : seed,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to start generation");
        setSubmitting(false);
        return;
      }
      setCurrent({ id: data.id, status: "pending", prompt });
      setSubmitting(false);
      beginPolling(data.id);
    } catch (e) {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  function beginPolling(id: number) {
    if (pollRef.current) window.clearInterval(pollRef.current);
    const tick = async () => {
      try {
        const res = await fetch(`/api/generate/${id}`);
        const data = await res.json();
        setCurrent(data);
        if (data.status === "completed" || data.status === "failed") {
          if (pollRef.current) window.clearInterval(pollRef.current);
          pollRef.current = null;
        }
      } catch {
        // ignore
      }
    };
    tick();
    pollRef.current = window.setInterval(tick, 1500);
  }

  function randomSeed() {
    setSeed(Math.floor(Math.random() * 2_000_000_000));
  }

  function pickExample(p: string) {
    setPrompt(p);
  }

  async function copyLink() {
    if (!current?.videoUrl) return;
    await navigator.clipboard.writeText(current.videoUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const modelMeta = VIDEO_MODELS.find((m) => m.id === model) ?? VIDEO_MODELS[0];
  const canGenerate = prompt.trim().length >= 3 && !submitting;
  const isGenerating =
    current?.status === "pending" || current?.status === "processing";
  const isDone = current?.status === "completed" && current.videoUrl;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Left: Controls */}
      <div className="lg:col-span-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Prompt to video
              </h2>
              <p className="mt-0.5 text-sm text-white/50">
                Describe the video you want to create
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-purple-300">
              <Wand2 className="h-5 w-5" />
            </div>
          </div>

          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/60">
            Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A cinematic drone shot of a serene alpine lake at sunrise, mist rising from the water, pine forests reflecting on the surface, slow motion..."
            rows={5}
            className="w-full resize-none rounded-xl border border-white/10 bg-[#0b0b14] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
          />

          <div className="mt-4">
            <button
              onClick={() => setShowAdvanced((v) => !v)}
              className="flex items-center gap-1.5 text-xs font-medium text-white/60 transition hover:text-white"
            >
              <Settings2 className="h-3.5 w-3.5" />
              {showAdvanced ? "Hide" : "Show"} advanced options
              {showAdvanced ? <X className="h-3 w-3" /> : null}
            </button>
          </div>

          {showAdvanced && (
            <div className="mt-4 space-y-4 rounded-xl border border-white/5 bg-black/20 p-4 fade-up">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/60">
                  Negative prompt
                </label>
                <input
                  type="text"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="blurry, distorted, low quality, watermark..."
                  className="w-full rounded-lg border border-white/10 bg-[#0b0b14] px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-purple-500/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/60">
                    Resolution
                  </label>
                  <select
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-[#0b0b14] px-3 py-2 text-sm text-white outline-none focus:border-purple-500/50"
                  >
                    {RESOLUTIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/60">
                    Aspect Ratio
                  </label>
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-[#0b0b14] px-3 py-2 text-sm text-white outline-none focus:border-purple-500/50"
                  >
                    {ASPECT_RATIOS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/60">
                    Seed
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={seed}
                      onChange={(e) =>
                        setSeed(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      placeholder="random"
                      className="w-full rounded-lg border border-white/10 bg-[#0b0b14] px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-purple-500/50"
                    />
                    <button
                      onClick={randomSeed}
                      title="Random seed"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
                    >
                      <Dice5 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/60">
                    Motion strength ({motionStrength})
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={motionStrength}
                    onChange={(e) => setMotionStrength(Number(e.target.value))}
                    style={
                      {
                        ["--slider-pct" as any]: `${motionStrength}%`,
                      } as React.CSSProperties
                    }
                    className="mt-2 w-full"
                  />
                </div>
              </div>
            </div>
          )}

          <label className="mt-5 mb-2 block text-xs font-medium uppercase tracking-wider text-white/60">
            Model
          </label>
          <div className="space-y-2">
            {VIDEO_MODELS.map((m) => (
              <button
                key={m.id}
                onClick={() => setModel(m.id)}
                className={cn(
                  "w-full rounded-xl border px-4 py-3 text-left transition",
                  model === m.id
                    ? "border-purple-500/50 bg-purple-500/10"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/5"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">
                    {m.name}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                      model === m.id
                        ? "bg-purple-500/20 text-purple-200"
                        : "bg-white/5 text-white/50"
                    )}
                  >
                    {m.badge}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-white/50">
                  {m.description}
                </p>
              </button>
            ))}
          </div>

          <label className="mt-5 mb-2 block text-xs font-medium uppercase tracking-wider text-white/60">
            Duration: {duration < 60 ? `${duration} seconds` : `${Math.floor(duration / 60)} min ${duration % 60} sec`}
          </label>
          <input
            type="range"
            min={4}
            max={480}
            step={4}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            style={
              {
                ["--slider-pct" as any]: `${((duration - 4) / (480 - 4)) * 100}%`,
              } as React.CSSProperties
            }
            className="w-full"
          />
          <div className="mt-1.5 flex justify-between text-[10px] uppercase tracking-wider text-white/40">
            <span>4s</span>
            <span>1m</span>
            <span>4m</span>
            <span>8m</span>
          </div>
          <p className="mt-2 rounded-lg border border-white/5 bg-white/[0.02] p-2 text-[11px] text-white/50">
            <span className="text-amber-300/80">Note:</span> Long videos (≥1m) use
            autoregressive keyframe chaining &amp; temporal upscaling. Generations
            take longer for 8-minute outputs.
          </p>

          <button
            onClick={startGeneration}
            disabled={!canGenerate}
            className={cn(
              "mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-white transition",
              canGenerate
                ? "bg-gradient-to-r from-purple-600 via-fuchsia-500 to-blue-600 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
                : "cursor-not-allowed bg-white/10 opacity-60"
            )}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Queueing...
              </>
            ) : isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Video
              </>
            )}
          </button>

          {error && (
            <p className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}
        </div>
      </div>

      {/* Right: Preview / Examples */}
      <div className="lg:col-span-3">
        <div className="flex h-full flex-col gap-6">
          {/* Preview pane */}
          <div className="relative flex min-h-[400px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b14]">
            {!current && !isDone && (
              <div className="flex h-full min-h-[400px] flex-col items-center justify-center p-8 text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 rounded-full bg-purple-500/30 blur-3xl" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-purple-600/30 to-blue-600/30">
                    <Video className="h-9 w-9 text-white" strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Your video will appear here
                </h3>
                <p className="mt-2 max-w-md text-sm text-white/50">
                  Choose from one of the models, write a detailed prompt, and
                  click generate. Videos up to 8 minutes in resolution up to 4K
                  are supported.
                </p>
              </div>
            )}

            {isGenerating && (
              <div className="flex h-full min-h-[400px] flex-col items-center justify-center p-8">
                <div className="relative mb-6 flex h-20 w-20 items-center justify-center">
                  <div className="absolute inset-0 animate-pulse rounded-full bg-purple-500/30 blur-xl" />
                  <div className="spin-slow relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/10 border-t-purple-500">
                    <Sparkles className="h-8 w-8 text-purple-300" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Generating your video
                </h3>
                <p className="mt-1 text-sm text-white/60">
                  {current?.stage ?? "Preparing..."}
                </p>
                <div className="mt-6 h-2 w-full max-w-md overflow-hidden rounded-full bg-white/10">
                  <div
                    className="progress-shine relative h-full rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-blue-500 transition-all duration-500"
                    style={{ width: `${current?.progress ?? 5}%` }}
                  />
                </div>
                <div className="mt-2 text-xs font-medium text-white/70">
                  {current?.progress ?? 0}%
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3 text-left text-xs sm:grid-cols-4">
                  <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                    <div className="text-white/40">Model</div>
                    <div className="mt-0.5 font-medium text-white">
                      {modelMeta.name}
                    </div>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                    <div className="text-white/40">Duration</div>
                    <div className="mt-0.5 font-medium text-white">
                      {duration < 60
                        ? `${duration}s`
                        : `${Math.floor(duration / 60)}m ${duration % 60}s`}
                    </div>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                    <div className="text-white/40">Resolution</div>
                    <div className="mt-0.5 font-medium text-white">
                      {resolution}
                    </div>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                    <div className="text-white/40">Aspect</div>
                    <div className="mt-0.5 font-medium text-white">
                      {aspectRatio}
                    </div>
                  </div>
                </div>
                {current?.simulated && (
                  <p className="mt-4 text-[11px] text-white/40">
                    Running in demo mode with sample videos. Configure
                    REPLICATE_API_TOKEN for real open-source model inference.
                  </p>
                )}
              </div>
            )}

            {current?.status === "failed" && (
              <div className="flex h-full min-h-[400px] flex-col items-center justify-center p-8 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-400">
                  <X className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Generation failed
                </h3>
                <p className="mt-2 max-w-md text-sm text-white/50">
                  {current.error ?? "Unknown error. Try a different prompt."}
                </p>
                <button
                  onClick={() => {
                    setCurrent(null);
                  }}
                  className="mt-5 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try again
                </button>
              </div>
            )}

            {isDone && current.videoUrl && (
              <div className="flex flex-col fade-up">
                <div className="relative aspect-video w-full bg-black">
                  <video
                    key={current.videoUrl}
                    src={current.videoUrl}
                    controls
                    autoPlay
                    loop
                    className="h-full w-full"
                    poster={current.thumbnailUrl ?? undefined}
                  />
                </div>
                <div className="border-t border-white/10 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="line-clamp-2 text-sm text-white">
                        {current.prompt ?? prompt}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-white/50">
                        <span className="rounded-full bg-white/5 px-2 py-0.5">
                          {modelMeta.name}
                        </span>
                        <span className="rounded-full bg-white/5 px-2 py-0.5">
                          {current.duration ?? duration}s
                        </span>
                        <span className="rounded-full bg-white/5 px-2 py-0.5">
                          {current.resolution ?? resolution}
                        </span>
                        <span className="rounded-full bg-white/5 px-2 py-0.5">
                          {current.aspectRatio ?? aspectRatio}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={current.videoUrl}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/10"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </a>
                      <button
                        onClick={copyLink}
                        className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/10"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            Copy URL
                          </>
                        )}
                      </button>
                      <button
                        onClick={async () => {
                          if (navigator.share) {
                            try {
                              await navigator.share({
                                title: "AI Generated Video",
                                text: current.prompt ?? prompt,
                                url: current.videoUrl,
                              });
                            } catch {
                              // ignore
                            }
                          } else {
                            copyLink();
                          }
                        }}
                        className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/10"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                        Share
                      </button>
                      <button
                        onClick={() => setCurrent(null)}
                        className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-2 text-xs font-medium text-white"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        New
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Example prompts */}
          {!isGenerating && !isDone && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-3 flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-purple-400" />
                <h3 className="text-sm font-semibold text-white">
                  Need inspiration? Try one of these:
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {EXAMPLE_PROMPTS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => pickExample(p)}
                    className="group rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5 text-left text-xs text-white/70 transition hover:border-purple-500/30 hover:bg-purple-500/5 hover:text-white"
                  >
                    <span className="mr-1.5 text-purple-400">›</span>
                    {p.length > 90 ? p.slice(0, 90) + "…" : p}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
