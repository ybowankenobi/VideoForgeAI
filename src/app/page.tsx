import Generator from "@/components/Generator";
import {
  Sparkles,
  Zap,
  Clock,
  Film,
  GitBranch,
  Cpu,
  Lock,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="fade-up relative mb-10">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/70">
            <span className="relative flex h-2 w-2 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Now supporting up to 8 minutes · 4K resolution · 5 open-source
            models
          </div>
          <h1 className="bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-5xl font-bold leading-tight tracking-tight text-transparent md:text-6xl lg:text-7xl">
            Generate stunning videos
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-blue-400 bg-clip-text">
              up to 8 minutes long
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-white/60 md:text-lg">
            VideoForge AI is a fully open-source text-to-video platform powered
            by state-of-the-art models including CogVideoX, Stable Video
            Diffusion, Open-Sora, AnimateDiff, and ModelScope — no closed
            black-box APIs required.
          </p>
        </div>

        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { icon: Clock, label: "Up to 8 min", sub: "Long-form video" },
            { icon: Film, label: "Up to 4K", sub: "High resolution" },
            { icon: Zap, label: "Fast inference", sub: "Distilled models" },
            { icon: Lock, label: "Open weights", sub: "Run anywhere" },
          ].map((f) => (
            <div
              key={f.label}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center"
            >
              <f.icon className="mx-auto h-5 w-5 text-purple-400" />
              <div className="mt-2 text-sm font-semibold text-white">
                {f.label}
              </div>
              <div className="text-[11px] text-white/50">{f.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Generator */}
      <section className="fade-up" style={{ animationDelay: "80ms" }}>
        <Generator />
      </section>

      {/* Feature strip */}
      <section
        className="fade-up mt-14 rounded-2xl border border-white/10 bg-white/[0.02] p-8"
        style={{ animationDelay: "160ms" }}
      >
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-purple-300">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white">
              Choose your model
            </h3>
            <p className="mt-1 text-sm text-white/60">
              Pick from 5 leading open-source video generation models, each
              tuned for different aesthetics from cinematic to anime.
            </p>
          </div>
          <div>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white">
              Long-form temporal chaining
            </h3>
            <p className="mt-1 text-sm text-white/60">
              Our autoregressive keyframe pipeline extends base models (usually
              4–6s) to produce coherent multi-minute narratives with preserved
              characters and scene consistency.
            </p>
          </div>
          <div>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/15 text-pink-300">
              <GitBranch className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white">
              Self-hostable &amp; MIT/Apache 2.0
            </h3>
            <p className="mt-1 text-sm text-white/60">
              All code and model weights are open source. Run it on your own
              GPU cluster, or connect your own inference backend.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
