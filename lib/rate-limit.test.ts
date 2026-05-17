import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createRateLimiter } from "./rate-limit";

describe("createRateLimiter", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("allows requests up to the limit", () => {
    const isLimited = createRateLimiter(3, 60_000);
    expect(isLimited("1.2.3.4")).toBe(false);
    expect(isLimited("1.2.3.4")).toBe(false);
    expect(isLimited("1.2.3.4")).toBe(false);
  });

  it("blocks the request that exceeds the limit", () => {
    const isLimited = createRateLimiter(3, 60_000);
    isLimited("1.2.3.4");
    isLimited("1.2.3.4");
    isLimited("1.2.3.4");
    expect(isLimited("1.2.3.4")).toBe(true);
  });

  it("tracks IPs independently", () => {
    const isLimited = createRateLimiter(1, 60_000);
    isLimited("1.2.3.4");
    expect(isLimited("5.6.7.8")).toBe(false);
  });

  it("allows requests again after the window expires", () => {
    const isLimited = createRateLimiter(1, 1_000);
    isLimited("1.2.3.4");
    expect(isLimited("1.2.3.4")).toBe(true);
    vi.advanceTimersByTime(1_001);
    expect(isLimited("1.2.3.4")).toBe(false);
  });
});
