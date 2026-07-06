import { NextRequest, NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import { withRateLimit } from "@/middleware/rate-limit";
import { isValidEmail } from "@/lib/newsletter-token";
import { subscribe } from "@/lib/newsletter";

// POST /api/newsletter/subscribe  { email }
async function handler(request: NextRequest): Promise<NextResponse> {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { error: "valid email required" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  try {
    await subscribe(email);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[newsletter] subscribe failed:", err);
    return NextResponse.json(
      { error: "internal error" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}

export const POST = withRateLimit(handler);
