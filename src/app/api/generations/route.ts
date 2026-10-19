import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { generations } from "@/db/schema";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = Math.min(50, Number(url.searchParams.get("limit") ?? 20));
  const offset = Math.max(0, Number(url.searchParams.get("offset") ?? 0));
  const publicOnly = url.searchParams.get("public") === "true";

  const where = publicOnly ? eq(generations.isPublic, true) : undefined;

  const rows = await db
    .select()
    .from(generations)
    .where(where as any)
    .orderBy(desc(generations.createdAt))
    .limit(limit)
    .offset(offset);

  return NextResponse.json({ generations: rows });
}
