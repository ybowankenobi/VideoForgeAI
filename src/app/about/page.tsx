import type { Metadata } from "next";
import {
  Cpu,
  Code2,
  Server,
  Layers,
  Clock,
  Zap,
  GitBranch,
  ExternalLink,
} from "lucide-react";
import { VIDEO_MODELS } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Models — VideoForge AI",
  description:
    "Learn about the open-source models powering VideoForge AI: CogVideoX, Stable Video Diffusion, Open-Sora, AnimateDiff, ModelScope I2V.",
};

export default function AboutPage() {
  const stack = [
    { icon: Code2, label: "Next.js 16", sub: "App Router, React Server Components" },
    { icon: Server, label: "Drizzle ORM", sub: "TypeScript SQL client" },
    { icon: Layers, label: "PostgreSQL", sub: "Persistent generation history" },
    { icon: Zap, label: "Replicate API", sub: "Optional hosted inference" },
    { icon: Clock, label: "Long-form pipeline", sub: "Autoregressive chaining up to 8m" },
    { icon: Cpu, label: "Open weights", sub: "Self-hostable on your own GPU" },
  ];

  return (
    <>
      <section className="mb-10">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/70">
          <GitBranch className="h-3.5 w-3.5" />
          Apache 2.0 · Open Source
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
          About VideoForge AI
        </h1>
        <p className="mt-4 max-w-3xl text-base text-white/60">
          VideoForge AI is an open-source video generation platform that
          democratizes access to high-quality text-to-video. Unlike commercial
          closed services that limit you to a few seconds and opaque models, we
          built this on top of the best open research models from around the
          world and extended them to support videos up to 8 minutes long.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-medium text-white"
          >
            <GitBranch className="h-4 w-4" />
            View source on GitHub
            <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10"
          >
            Try the generator
          </a>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-5 text-2xl font-bold text-white">Supported models</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {VIDEO_MODELS.map((m) => (
            <div
              key={m.id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">{m.name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/60">
                    {m.description}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-emerald-300">
                  {m.badge}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-4 border-t border-white/5 pt-4 text-xs text-white/50">
                <div>
                  <div className="text-white/40">Max duration</div>
                  <div className="mt-0.5 font-medium text-white">
                    {m.maxDuration < 60
                      ? `${m.maxDuration}s`
                      : `${Math.floor(m.maxDuration / 60)} minutes`}
                  </div>
                </div>
                <div>
                  <div className="text-white/40">Type</div>
                  <div className="mt-0.5 font-medium text-white">Text → Video</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-5 text-2xl font-bold text-white">
          How 8-minute videos work
        </h2>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm leading-relaxed text-white/70">
            Most open-source video models today only generate 4–6 seconds of
            content at a time. VideoForge AI uses a research-grade pipeline to
            extend these into long, coherent videos:
          </p>
          <ol className="mt-5 space-y-4">
            {[
              [
                "Prompt parsing & shot planning",
                "We break your prompt into a sequence of shots using an LLM director, planning characters, scene transitions, and camera motion for the entire 8 minutes.",
              ],
              [
                "Keyframe generation",
                "We generate keyframe anchors every 4–6 seconds using your chosen base model, ensuring semantic consistency via shared prompt embeddings and a fixed seed.",
              ],
              [
                "Autoregressive chaining",
                "Each segment is conditioned on the last frame of the previous segment, eliminating cuts and maintaining visual continuity.",
              ],
              [
                "Temporal VAE upscaling",
                "Once all segments are produced, a temporal variational autoencoder blends, upscales and smooths transitions between them.",
              ],
              [
                "Final render",
                "Frames are encoded with H.264/H.265 at your chosen resolution and aspect ratio, up to 4K.",
              ],
            ].map(([title, body], i) => (
              <li key={title} className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-xs font-bold text-white">
                  {i + 1}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{title}</h4>
                  <p className="mt-1 text-sm text-white/60">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section>
        <h2 className="mb-5 text-2xl font-bold text-white">Tech stack</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {stack.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/15 text-purple-300">
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{s.label}</div>
                <div className="text-[11px] text-white/50">{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
