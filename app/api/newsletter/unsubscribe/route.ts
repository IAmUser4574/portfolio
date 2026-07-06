import { NextRequest, NextResponse } from "next/server";
import { verifyUnsubscribeToken } from "@/lib/newsletter-token";
import { unsubscribe } from "@/lib/newsletter";

// GET /api/newsletter/unsubscribe?email=...&token=...
// one-click link from an email — not rate limited, the HMAC token is the auth
export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email") ?? "";
  const token = request.nextUrl.searchParams.get("token") ?? "";

  const valid = email && token && (await verifyUnsubscribeToken(email, token));

  if (valid) {
    try {
      await unsubscribe(email);
    } catch (err) {
      console.error("[newsletter] unsubscribe failed:", err);
      return NextResponse.redirect(new URL("/newsletter/unsubscribed?ok=0", request.url));
    }
  }

  return NextResponse.redirect(
    new URL(`/newsletter/unsubscribed?ok=${valid ? 1 : 0}`, request.url)
  );
}
