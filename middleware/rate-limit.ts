import { NextRequest, NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";

const RATE_LIMIT_MAX_REQUESTS = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;

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

const isRateLimited = createRateLimiter(RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_MS);

type RouteHandler = (req: NextRequest) => Promise<NextResponse>;

export function withRateLimit(handler: RouteHandler): RouteHandler {
  return async (req: NextRequest) => {
    const ip =
      req.headers.get("cf-connecting-ip") ??
      req.headers.get("x-forwarded-for") ??
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Not so fast - some things in life are worth waiting for." },
        { status: StatusCodes.TOO_MANY_REQUESTS }
      );
    }

    return handler(req);
  };
}
