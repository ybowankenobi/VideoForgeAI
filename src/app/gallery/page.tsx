import { db } from "@/db";
import { generations } from "@/db/schema";
import { desc, eq, isNotNull } from "drizzle-orm";
import { VIDEO_MODELS, formatDate, formatDuration } from "@/lib/utils";
import { Play, Eye, Sparkles } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const videos = await db
    .select()
    .from(generations)
    .where(eq(generations.status, "completed"))
    .orderBy(desc(generations.createdAt))
    .limit(24);

  // Seed with some featured examples if empty
  const featured = videos.length
    ? videos
    : [
        {
          id: -1,
          prompt:
            "Cinematic aerial shot of a futuristic cyberpunk city at night with flying cars, neon reflections, rain on asphalt, volumetric fog, 8K",
          model: "cogvideox-5b",
          duration: 12,
          resolution: "1080p",
          aspectRatio: "16:9",
          videoUrl:
            "https://videos.pexels.com/video-files/29639317/12784964_2560_1440_30fps.mp4",
          thumbnailUrl:
            "https://images.pexels.com/photos/29639317/free-photo-of-cyberpunk-city-at-night.jpeg?auto=compress&w=640",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        },
        {
          id: -2,
          prompt:
            "Epic mountain landscape at golden hour, clouds rolling over snow-capped peaks, drone shot",
          model: "open-sora",
          duration: 24,
          resolution: "1440p",
          aspectRatio: "16:9",
          videoUrl:
            "https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4",
          thumbnailUrl:
            "https://images.pexels.com/photos/3571264/pexels-photo-3571264.jpeg?auto=compress&w=640",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
        },
        {
          id: -3,
          prompt:
            "A majestic tiger walking through a lush bamboo forest, dappled sunlight, slow motion, shallow depth of field",
          model: "stable-video-diffusion-3",
          duration: 10,
          resolution: "1080p",
          aspectRatio: "16:9",
          videoUrl:
            "https://videos.pexels.com/video-files/1093662/1093662-hd_1920_1080_30fps.mp4",
          thumbnailUrl:
            "https://images.pexels.com/photos/1093662/pexels-photo-1093662.jpeg?auto=compress&w=640",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
        },
        {
          id: -4,
          prompt:
            "An astronaut floating outside a space station with Earth in the background, stars, cinematic lens flare",
          model: "cogvideox-5b",
          duration: 16,
          resolution: "4K",
          aspectRatio: "21:9",
          videoUrl:
            "https://videos.pexels.com/video-files/854669/854669-hd_1920_1080_30fps.mp4",
          thumbnailUrl:
            "https://images.pexels.com/photos/854669/pexels-photo-854669.jpeg?auto=compress&w=640",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        },
        {
          id: -5,
          prompt:
            "Cozy cabin in a snowy forest at dusk, smoke from chimney, warm window light, gentle snowfall",
          model: "animatediff-lightning",
          duration: 8,
          resolution: "1080p",
          aspectRatio: "16:9",
          videoUrl:
            "https://videos.pexels.com/video-files/2817803/2817803-uhd_2560_1440_25fps.mp4",
          thumbnailUrl:
            "https://images.pexels.com/photos/2817803/pexels-photo-2817803.jpeg?auto=compress&w=640",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36),
        },
        {
          id: -6,
          prompt: "Underwater coral reef teeming with colorful tropical fish, sun rays",
          model: "modelscope-i2v",
          duration: 20,
          resolution: "1080p",
          aspectRatio: "16:9",
          videoUrl:
            "https://videos.pexels.com/video-files/4068327/4068327-uhd_2560_1440_30fps.mp4",
          thumbnailUrl:
            "https://images.pexels.com/photos/4068327/pexels-photo-4068327.jpeg?auto=compress&w=640",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
        },
        {
          id: -7,
          prompt:
            "Mystical forest with bioluminescent plants and fireflies at twilight, magical atmosphere, Studio Ghibli inspired",
          model: "animatediff-lightning",
          duration: 30,
          resolution: "1080p",
          aspectRatio: "16:9",
          videoUrl:
            "https://videos.pexels.com/video-files/2491284/2491284-uhd_2560_1440_30fps.mp4",
          thumbnailUrl:
            "https://images.pexels.com/photos/2491284/pexels-photo-2491284.jpeg?auto=compress&w=640",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
        },
        {
          id: -8,
          prompt: "Timelapse of a city skyline at sunset, clouds moving, lights turning on",
          model: "open-sora",
          duration: 45,
          resolution: "1440p",
          aspectRatio: "16:9",
          videoUrl:
            "https://videos.pexels.com/video-files/3129957/3129957-uhd_2560_1440_25fps.mp4",
          thumbnailUrl:
            "https://images.pexels.com/photos/3129957/pexels-photo-3129957.jpeg?auto=compress&w=640",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96),
        },
        {
          id: -9,
          prompt: "Rainy city street at night with reflections, neon signs, people with umbrellas",
          model: "stable-video-diffusion-3",
          duration: 60,
          resolution: "1080p",
          aspectRatio: "16:9",
          videoUrl:
            "https://videos.pexels.com/video-files/3209292/3209292-uhd_2560_1440_25fps.mp4",
          thumbnailUrl:
            "https://images.pexels.com/photos/3209292/pexels-photo-3209292.jpeg?auto=compress&w=640",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120),
        },
      ];

  const modelNames = Object.fromEntries(
    VIDEO_MODELS.map((m) => [m.id, m.name])
  );

  return (
    <>
      <section className="mb-8">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Community Gallery
            </h1>
            <p className="mt-2 text-sm text-white/60">
              A curated feed of videos generated with open-source models on
              VideoForge AI.
            </p>
          </div>
          <Link
            href="/"
            className="hidden items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 md:flex"
          >
            <Sparkles className="h-4 w-4" />
            Create your own
          </Link>
        </div>
      </section>

      {featured.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">
          <p className="text-white/60">No videos yet. Be the first to generate!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((v: any) => (
            <a
              key={v.id}
              href={v.videoUrl}
              target="_blank"
              rel="noreferrer"
              className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition hover:border-white/20"
            >
              <div className="relative aspect-video overflow-hidden bg-black">
                {v.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={v.thumbnailUrl}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full animated-gradient" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-2 py-1 text-[10px] font-medium text-white/90 backdrop-blur">
                  <Play className="h-3 w-3" />
                  {formatDuration(v.duration)}
                </div>
                <div className="absolute right-3 top-3 rounded-full border border-white/10 bg-black/60 px-2 py-1 text-[10px] font-medium text-white/90 backdrop-blur">
                  {v.resolution} · {v.aspectRatio}
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-md ring-1 ring-white/40">
                    <Play className="h-6 w-6 fill-white text-white" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="line-clamp-2 text-sm text-white/90">{v.prompt}</p>
                <div className="mt-3 flex items-center justify-between text-[11px] text-white/50">
                  <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-purple-300">
                    {modelNames[v.model] ?? v.model}
                  </span>
                  <span>{formatDate(v.createdAt)}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </>
  );
}
