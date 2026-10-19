import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const VIDEO_MODELS = [
  {
    id: "cogvideox-5b",
    name: "CogVideoX 5B",
    description:
      "Open-source text-to-video model by Tsinghua. Supports up to 6s base, extended via autoregressive chaining for long videos.",
    maxDuration: 480,
    badge: "Open Source",
  },
  {
    id: "stable-video-diffusion-3",
    name: "Stable Video Diffusion 3",
    description:
      "Stability AI's open video generation model. High fidelity motion, great for cinematic scenes up to 8 minutes with temporal upscaling.",
    maxDuration: 480,
    badge: "Open Source",
  },
  {
    id: "animatediff-lightning",
    name: "AnimateDiff Lightning",
    description:
      "Fast open-source animation model. Ideal for stylized and anime content. Lightning-fast distillation for quick previews.",
    maxDuration: 240,
    badge: "Open Source",
  },
  {
    id: "modelscope-i2v",
    name: "ModelScope I2V",
    description:
      "Alibaba's open image-to-video model. Excellent motion consistency. Supports text-to-video for 8-minute narrative content.",
    maxDuration: 480,
    badge: "Open Source",
  },
  {
    id: "open-sora",
    name: "Open-Sora 2.0",
    description:
      "Community-driven open reproduction of Sora. Supports high-resolution long-form video up to 8 minutes via temporal VAE.",
    maxDuration: 480,
    badge: "Open Source",
  },
] as const;

export const RESOLUTIONS = ["480p", "720p", "1080p", "1440p", "4K"] as const;
export const ASPECT_RATIOS = ["9:16", "16:9", "1:1", "4:3", "21:9"] as const;

// Curated sample videos used for demo/simulation mode when no Replicate key
export const SAMPLE_VIDEOS = [
  {
    url: "https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4",
    thumb:
      "https://images.pexels.com/photos/3571264/pexels-photo-3571264.jpeg?auto=compress&w=640",
    tags: ["cinematic", "nature", "landscape", "mountains", "sunset", "epic"],
  },
  {
    url: "https://videos.pexels.com/video-files/4434150/4434150-uhd_2560_1440_30fps.mp4",
    thumb:
      "https://images.pexels.com/photos/4434150/pexels-photo-4434150.jpeg?auto=compress&w=640",
    tags: ["ocean", "waves", "beach", "aerial", "tropical", "water"],
  },
  {
    url: "https://videos.pexels.com/video-files/29639317/12784964_2560_1440_30fps.mp4",
    thumb:
      "https://images.pexels.com/photos/29639317/free-photo-of-cyberpunk-city-at-night.jpeg?auto=compress&w=640",
    tags: ["cyberpunk", "city", "neon", "night", "futuristic", "urban"],
  },
  {
    url: "https://videos.pexels.com/video-files/854669/854669-hd_1920_1080_30fps.mp4",
    thumb:
      "https://images.pexels.com/photos/854669/pexels-photo-854669.jpeg?auto=compress&w=640",
    tags: ["space", "galaxy", "stars", "nebula", "cosmic", "astronaut"],
  },
  {
    url: "https://videos.pexels.com/video-files/2491284/2491284-uhd_2560_1440_30fps.mp4",
    thumb:
      "https://images.pexels.com/photos/2491284/pexels-photo-2491284.jpeg?auto=compress&w=640",
    tags: ["forest", "magical", "fantasy", "mystical", "fog", "green"],
  },
  {
    url: "https://videos.pexels.com/video-files/3129957/3129957-uhd_2560_1440_25fps.mp4",
    thumb:
      "https://images.pexels.com/photos/3129957/pexels-photo-3129957.jpeg?auto=compress&w=640",
    tags: ["city", "timelapse", "urban", "traffic", "lights", "skyline"],
  },
  {
    url: "https://videos.pexels.com/video-files/1093662/1093662-hd_1920_1080_30fps.mp4",
    thumb:
      "https://images.pexels.com/photos/1093662/pexels-photo-1093662.jpeg?auto=compress&w=640",
    tags: ["fire", "abstract", "macro", "particles", "slow motion"],
  },
  {
    url: "https://videos.pexels.com/video-files/4068327/4068327-uhd_2560_1440_30fps.mp4",
    thumb:
      "https://images.pexels.com/photos/4068327/pexels-photo-4068327.jpeg?auto=compress&w=640",
    tags: ["underwater", "ocean", "fish", "coral", "blue", "diving"],
  },
  {
    url: "https://videos.pexels.com/video-files/2098946/2098946-hd_1920_1080_30fps.mp4",
    thumb:
      "https://images.pexels.com/photos/2098946/pexels-photo-2098946.jpeg?auto=compress&w=640",
    tags: ["anime", "animation", "stylized", "cartoon", "3d"],
  },
  {
    url: "https://videos.pexels.com/video-files/2817803/2817803-uhd_2560_1440_25fps.mp4",
    thumb:
      "https://images.pexels.com/photos/2817803/pexels-photo-2817803.jpeg?auto=compress&w=640",
    tags: ["snow", "winter", "mountains", "arctic", "cold", "aerial"],
  },
  {
    url: "https://videos.pexels.com/video-files/2169880/2169880-uhd_2560_1440_30fps.mp4",
    thumb:
      "https://images.pexels.com/photos/2169880/pexels-photo-2169880.jpeg?auto=compress&w=640",
    tags: ["portrait", "person", "woman", "fashion", "studio", "beautiful"],
  },
  {
    url: "https://videos.pexels.com/video-files/3209292/3209292-uhd_2560_1440_25fps.mp4",
    thumb:
      "https://images.pexels.com/photos/3209292/pexels-photo-3209292.jpeg?auto=compress&w=640",
    tags: ["rain", "city", "street", "moody", "cinematic", "night"],
  },
];

export function pickSampleVideo(prompt: string) {
  const lower = prompt.toLowerCase();
  let best = SAMPLE_VIDEOS[0];
  let bestScore = -1;
  for (const vid of SAMPLE_VIDEOS) {
    let score = 0;
    for (const tag of vid.tags) {
      if (lower.includes(tag)) score += 2;
    }
    // partial word match
    for (const word of lower.split(/\W+/).filter(Boolean)) {
      if (word.length > 3 && vid.tags.some((t) => t.includes(word))) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = vid;
    }
  }
  // If no match, randomize for variety
  if (bestScore <= 0) {
    best = SAMPLE_VIDEOS[Math.floor(Math.random() * SAMPLE_VIDEOS.length)];
  }
  return best;
}

export function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s ? `${m}m ${s}s` : `${m}m`;
}

export function formatDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
