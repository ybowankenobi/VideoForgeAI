import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { generations } from "@/db/schema";
import { pickSampleVideo } from "@/lib/utils";
import { pollReplicatePrediction, REPLICATE_ENABLED } from "@/lib/replicate";

export const runtime = "nodejs";

function stages(durationSec: number) {
  // Stages for simulation, each takes a bit of wall time
  return [
    { label: "Tokenizing prompt", pct: 8, sec: 2 },
    { label: "Encoding text embeddings", pct: 16, sec: 2 },
    {
      label: `Generating keyframes for ${durationSec}s video`,
      pct: 40,
      sec: Math.min(10, 4 + Math.floor(durationSec / 30)),
    },
    { label: "Synthesizing frames with temporal VAE", pct: 68, sec: Math.min(12, 4 + Math.floor(durationSec / 20)) },
    { label: "Applying motion consistency", pct: 82, sec: 3 },
    { label: "Upscaling & detail refinement", pct: 94, sec: 3 },
    { label: "Encoding final video", pct: 100, sec: 2 },
  ];
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const genId = Number(id);
  if (!Number.isFinite(genId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const [record] = await db
    .select()
    .from(generations)
    .where(eq(generations.id, genId))
    .limit(1);

  if (!record) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // If real replicate job exists, poll it
  if (record.replicateId && REPLICATE_ENABLED && record.status === "processing") {
    const poll = await pollReplicatePrediction(record.replicateId);
    if (poll.status === "succeeded" && poll.videoUrl) {
      await db
        .update(generations)
        .set({
          status: "completed",
          videoUrl: poll.videoUrl,
          updatedAt: new Date(),
        })
        .where(eq(generations.id, genId));
      return NextResponse.json({
        ...record,
        status: "completed",
        videoUrl: poll.videoUrl,
        progress: 100,
        stage: "Complete",
      });
    }
    if (poll.status === "failed") {
      await db
        .update(generations)
        .set({ status: "failed", error: poll.error, updatedAt: new Date() })
        .where(eq(generations.id, genId));
      return NextResponse.json({ ...record, status: "failed", error: poll.error });
    }
    return NextResponse.json({
      ...record,
      status: "processing",
      progress: 50,
      stage: "Running on Replicate...",
    });
  }

  // Simulated progress based on elapsed time
  const created = new Date(record.createdAt).getTime();
  const elapsed = (Date.now() - created) / 1000;
  const stg = stages(record.duration);
  const totalSimSec = stg.reduce((a, s) => a + s.sec, 0);

  if (record.status === "completed" && record.videoUrl) {
    return NextResponse.json({
      ...record,
      progress: 100,
      stage: "Complete",
    });
  }

  if (record.status === "failed") {
    return NextResponse.json(record);
  }

  let accumulated = 0;
  let currentPct = 0;
  let currentLabel = stg[0].label;
  for (const s of stg) {
    if (elapsed < accumulated + s.sec) {
      const local = (elapsed - accumulated) / s.sec;
      currentPct = Math.round(
        s.pct - (stg[stg.indexOf(s)].pct - (stg[stg.indexOf(s) - 1]?.pct ?? 0)) * (1 - local)
      );
      currentLabel = s.label;
      break;
    }
    accumulated += s.sec;
    currentPct = s.pct;
    currentLabel = s.label;
  }

  if (elapsed >= totalSimSec && record.status !== "completed") {
    // Mark completed and assign sample video
    const sample = pickSampleVideo(record.prompt);
    await db
      .update(generations)
      .set({
        status: "completed",
        videoUrl: sample.url,
        thumbnailUrl: sample.thumb,
        updatedAt: new Date(),
      })
      .where(eq(generations.id, genId));
    return NextResponse.json({
      ...record,
      status: "completed",
      videoUrl: sample.url,
      thumbnailUrl: sample.thumb,
      progress: 100,
      stage: "Complete",
      simulated: true,
    });
  }

  // Update status to processing if was pending
  if (record.status === "pending") {
    await db
      .update(generations)
      .set({ status: "processing", updatedAt: new Date() })
      .where(eq(generations.id, genId));
  }

  return NextResponse.json({
    ...record,
    status: "processing",
    progress: Math.max(2, Math.min(99, currentPct)),
    stage: currentLabel,
    simulated: true,
  });
}
