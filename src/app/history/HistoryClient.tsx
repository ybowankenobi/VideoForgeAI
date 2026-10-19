"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  Play,
  AlertCircle,
  Clock,
  Sparkles,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { formatDate, formatDuration, VIDEO_MODELS } from "@/lib/utils";

type Gen = {
  id: number;
  prompt: string;
  model: string;
  duration: number;
  resolution: string;
  aspectRatio: string;
  status: string;
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  error?: string | null;
  createdAt: string;
};

export default function HistoryClient() {
  const [generations, setGenerations] = useState<Gen[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/generations?limit=30", {
        cache: "no-store",
      });
      const data = await res.json();
      setGenerations(data.generations ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Poll any in-progress items
  useEffect(() => {
    const inProgress = generations.filter(
      (g) => g.status === "pending" || g.status === "processing"
    );
    if (!inProgress.length) return;
    const int = setInterval(async () => {
      const updates = await Promise.all(
        inProgress.map(async (g) => {
          const r = await fetch(`/api/generate/${g.id}`);
          return r.json();
        })
      );
      setGenerations((prev) =>
        prev.map((g) => {
          const u = updates.find((u: any) => u.id === g.id);
          return u ? { ...g, ...u } : g;
        })
      );
    }, 2000);
    return () => clearInterval(int);
  }, [generations]);

  const modelNames = Object.fromEntries(VIDEO_MODELS.map((m) => [m.id, m.name]));

  return (
    <>
      <section className="mb-8">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Generation History
            </h1>
            <p className="mt-2 text-sm text-white/60">
              Your recent video generations. Completed videos are stored in the
              local database.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={load}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:bg-white/10"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-2 text-sm font-medium text-white"
            >
              <Sparkles className="h-4 w-4" />
              New generation
            </Link>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-white/60">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading history...
        </div>
      ) : generations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/5">
            <Clock className="h-6 w-6 text-white/50" />
          </div>
          <h3 className="text-lg font-semibold text-white">
            No generations yet
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-white/50">
            Head back to the generator and create your first AI video. All your
            generations will appear here.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-medium text-white"
          >
            <Sparkles className="h-4 w-4" />
            Start generating
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {generations.map((g) => (
            <div
              key={g.id}
              className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/20 sm:flex-row"
            >
              <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg bg-black sm:w-48">
                {g.status === "completed" && g.thumbnailUrl ? (
                  <a
                    href={g.videoUrl ?? "#"}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={g.thumbnailUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition hover:bg-black/40">
                      <Play className="h-8 w-8 text-white opacity-0 transition group-hover:opacity-100" />
                    </div>
                  </a>
                ) : g.status === "completed" && g.videoUrl ? (
                  <video
                    src={g.videoUrl}
                    className="h-full w-full object-cover"
                    muted
                  />
                ) : g.status === "failed" ? (
                  <div className="flex h-full w-full items-center justify-center bg-red-500/10">
                    <AlertCircle className="h-8 w-8 text-red-400" />
                  </div>
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center animated-gradient">
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                    <p className="mt-2 text-[10px] uppercase tracking-wider text-white/70">
                      {g.status}
                    </p>
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm text-white">{g.prompt}</p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] text-purple-300">
                    {modelNames[g.model] ?? g.model}
                  </span>
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/70">
                    {formatDuration(g.duration)}
                  </span>
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/70">
                    {g.resolution}
                  </span>
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/70">
                    {g.aspectRatio}
                  </span>
                  <span
                    className={
                      "rounded-full px-2 py-0.5 text-[10px] font-medium " +
                      (g.status === "completed"
                        ? "bg-emerald-500/15 text-emerald-300"
                        : g.status === "failed"
                          ? "bg-red-500/15 text-red-300"
                          : "bg-amber-500/15 text-amber-300")
                    }
                  >
                    {g.status}
                  </span>
                </div>
                {g.error && (
                  <p className="mt-2 text-xs text-red-300/80">
                    Error: {g.error}
                  </p>
                )}
                <p className="mt-2 text-[11px] text-white/40">
                  {formatDate(g.createdAt)}
                </p>
              </div>
              <div className="flex shrink-0 items-start gap-2">
                {g.status === "completed" && g.videoUrl && (
                  <>
                    <a
                      href={g.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white transition hover:bg-white/10"
                    >
                      View
                    </a>
                    <a
                      href={g.videoUrl}
                      download
                      className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-1.5 text-xs font-medium text-white"
                    >
                      Download
                    </a>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
