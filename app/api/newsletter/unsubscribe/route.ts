import { NextRequest, NextResponse } from "next/server";
import { verifyUnsubscribeToken } from "@/lib/newsletter-token";
import { unsubscribe } from "@/lib/newsletter";
import { siteUrl } from "@/lib/site-url";

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
      return NextResponse.redirect(`${siteUrl()}/newsletter/unsubscribed?ok=0`);
    }
  }

  // redirect via SITE_URL rather than request.url — behind the VPS's reverse
  // proxy, request.url can resolve to the container's own bind address
  // (e.g. http://0.0.0.0:3000) instead of the public hostname
  return NextResponse.redirect(`${siteUrl()}/newsletter/unsubscribed?ok=${valid ? 1 : 0}`);
}
