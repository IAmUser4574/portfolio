import type { NextRequest } from "next/server";
import { StatusCodes } from "http-status-codes";
import { recordView, getViewCounts } from "@/lib/views";

// POST /api/views  { slug }  — records a view and returns current counts
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const slug = typeof body?.slug === "string" ? body.slug.trim() : "";

  if (!slug) {
    return Response.json({ error: "slug required" }, { status: StatusCodes.BAD_REQUEST });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("cf-connecting-ip") ??
    "unknown";
  const userAgent = request.headers.get("user-agent") ?? "";

  try {
    const counts = await recordView(slug, ip, userAgent);
    return Response.json(counts);
  } catch (err) {
    console.error("[views] recordView failed:", err);
    return Response.json({ error: "internal error" }, { status: 500 });
  }
}

// GET /api/views?slugs=blog/a,blog/b  — batch read without recording a view
export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("slugs") ?? "";
  const slugs = raw.split(",").map((s) => s.trim()).filter(Boolean);
  return Response.json(await getViewCounts(slugs));
}
