// Helper to call Replicate for open-source video generation models.
// Falls back to a local simulation when no API key is configured.

export const REPLICATE_ENABLED = Boolean(process.env.REPLICATE_API_TOKEN);

export type GenerateParams = {
  prompt: string;
  negativePrompt?: string;
  model: string;
  duration: number;
  resolution: string;
  aspectRatio: string;
  motionStrength: number;
  seed?: number;
};

// Map our internal model ids to Replicate model references
const REPLICATE_MODELS: Record<
  string,
  { owner: string; name: string; version?: string }
> = {
  "cogvideox-5b": {
    owner: "charlespqt",
    name: "cogvideox5b",
  },
  "stable-video-diffusion-3": {
    owner: "stability-ai",
    name: "stable-video-diffusion",
  },
  "animatediff-lightning": {
    owner: "lucataco",
    name: "animatediff-lightning",
  },
  "modelscope-i2v": {
    owner: "charlesfrye",
    name: "text-to-video-ms-1.7b",
  },
  "open-sora": {
    owner: "camenduru",
    name: "open-sora",
  },
};

export async function startReplicateGeneration(
  params: GenerateParams
): Promise<{ id: string } | null> {
  if (!REPLICATE_ENABLED) return null;
  try {
    const res = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version:
          REPLICATE_MODELS[params.model]?.version ??
          "cogvideox-5b-version-placeholder",
        input: {
          prompt: params.prompt,
          negative_prompt: params.negativePrompt ?? "",
          num_frames: Math.min(Math.floor(params.duration * 8), 257), // 8fps default
          fps: 8,
        },
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return { id: data.id };
  } catch {
    return null;
  }
}

export async function pollReplicatePrediction(id: string): Promise<{
  status: "succeeded" | "failed" | "processing";
  videoUrl?: string;
  error?: string;
}> {
  if (!REPLICATE_ENABLED) return { status: "failed", error: "Not enabled" };
  try {
    const res = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      },
    });
    if (!res.ok) return { status: "failed", error: "Poll failed" };
    const data = await res.json();
    if (data.status === "succeeded") {
      const output = data.output;
      const videoUrl =
        typeof output === "string"
          ? output
          : Array.isArray(output)
            ? (output[output.length - 1] as string)
            : (output?.video ?? undefined);
      return { status: "succeeded", videoUrl };
    }
    if (data.status === "failed") {
      return { status: "failed", error: data.error ?? "Generation failed" };
    }
    return { status: "processing" };
  } catch {
    return { status: "failed", error: "Poll error" };
  }
}
