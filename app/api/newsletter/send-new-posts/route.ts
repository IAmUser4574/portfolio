import { NextRequest, NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import { sendNewPostNotifications } from "@/lib/newsletter";

// POST /api/newsletter/send-new-posts
// called once per production deploy (see .github/workflows/deploy-prod.yml) —
// not rate limited, auth is the shared secret rather than IP
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-newsletter-cron-secret");

  if (!secret || secret !== process.env.NEWSLETTER_CRON_SECRET) {
    return NextResponse.json(
      { error: "unauthorized" },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  try {
    const result = await sendNewPostNotifications();
    return NextResponse.json(result);
  } catch (err) {
    console.error("[newsletter] send-new-posts failed:", err);
    return NextResponse.json(
      { error: "internal error" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
