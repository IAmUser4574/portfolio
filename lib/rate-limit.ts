import { NextRequest, NextResponse } from "next/server";

export function createRateLimiter(limit: number, windowMs: number) {
  const store = new Map<string, number[]>();
  return function isLimited(ip: string): boolean {
    const now = Date.now();
    const timestamps = (store.get(ip) ?? []).filter(t => now - t < windowMs);
    if (timestamps.length >= limit) return true;
    timestamps.push(now);
    store.set(ip, timestamps);
    return false;
  };
}

const isRateLimited = createRateLimiter(10, 60_000);

type RouteHandler = (req: NextRequest) => Promise<NextResponse>;

export function withRateLimit(handler: RouteHandler): RouteHandler {
  return async (req: NextRequest) => {
    const ip =
      req.headers.get("cf-connecting-ip") ??
      req.headers.get("x-forwarded-for") ??
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded — try again in a minute" },
        { status: 429 }
      );
    }

    return handler(req);
  };
}
