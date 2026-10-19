import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { generations } from "@/db/schema";
import { startReplicateGeneration, REPLICATE_ENABLED } from "@/lib/replicate";

export const runtime = "nodejs";
export const maxDuration = 60;

type Body = {
  prompt: string;
  negativePrompt?: string;
  model?: string;
  duration?: number;
  resolution?: string;
  aspectRatio?: string;
  motionStrength?: number;
  seed?: number;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const prompt = body.prompt?.trim();
  if (!prompt || prompt.length < 3) {
    return NextResponse.json(
      { error: "Prompt must be at least 3 characters." },
      { status: 400 }
    );
  }

  const duration = Math.max(4, Math.min(480, Number(body.duration) ?? 8));
  const model = body.model ?? "cogvideox-5b";
  const resolution = body.resolution ?? "1080p";
  const aspectRatio = body.aspectRatio ?? "16:9";
  const motionStrength = Math.max(
    0,
    Math.min(100, Number(body.motionStrength) ?? 50)
  );
  const seed = body.seed ?? Math.floor(Math.random() * 2_000_000_000);
  const negativePrompt = body.negativePrompt?.trim() ?? "";

  const inserted = await db
    .insert(generations)
    .values({
      prompt,
      negativePrompt: negativePrompt || null,
      model,
      duration,
      resolution,
      aspectRatio,
      motionStrength,
      seed,
      status: "pending",
    })
    .returning();

  const genId = inserted[0].id;
  let replicateId: string | null = null;

  if (REPLICATE_ENABLED) {
    const rep = await startReplicateGeneration({
      prompt,
      negativePrompt,
      model,
      duration,
      resolution,
      aspectRatio,
      motionStrength,
      seed,
    });
    if (rep?.id) {
      replicateId = rep.id;
      await db
        .update(generations)
        .set({ replicateId: rep.id, status: "processing" })
        .where(eq(generations.id, genId));
    }
  }

  return NextResponse.json({
    id: genId,
    replicateId,
    simulated: !REPLICATE_ENABLED || !replicateId,
  });
}
