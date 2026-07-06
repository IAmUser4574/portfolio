import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  isValidEmail,
  normalizeEmail,
  signUnsubscribeToken,
  verifyUnsubscribeToken,
} from "@/lib/newsletter-token";

describe("normalizeEmail", () => {
  it("trims and lowercases", () => {
    expect(normalizeEmail("  Foo@Example.COM  ")).toBe("foo@example.com");
  });
});

describe("isValidEmail", () => {
  it("accepts a plausible email", () => {
    expect(isValidEmail("foo@example.com")).toBe(true);
  });

  it("rejects strings without an @ or domain", () => {
    expect(isValidEmail("not-an-email")).toBe(false);
    expect(isValidEmail("foo@")).toBe(false);
    expect(isValidEmail("")).toBe(false);
  });
});

describe("unsubscribe tokens", () => {
  beforeEach(() => {
    vi.stubEnv("NEWSLETTER_UNSUBSCRIBE_SECRET", "test-secret");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("round-trips: a signed token verifies for the same email", async () => {
    const token = await signUnsubscribeToken("foo@example.com");
    expect(await verifyUnsubscribeToken("foo@example.com", token)).toBe(true);
  });

  it("verifies regardless of email casing (normalizes first)", async () => {
    const token = await signUnsubscribeToken("Foo@Example.com");
    expect(await verifyUnsubscribeToken("  foo@example.com  ", token)).toBe(true);
  });

  it("rejects a token for a different email", async () => {
    const token = await signUnsubscribeToken("foo@example.com");
    expect(await verifyUnsubscribeToken("bar@example.com", token)).toBe(false);
  });

  it("rejects a tampered token", async () => {
    const token = await signUnsubscribeToken("foo@example.com");
    const tampered = token.slice(0, -2) + (token.slice(-2) === "00" ? "11" : "00");
    expect(await verifyUnsubscribeToken("foo@example.com", tampered)).toBe(false);
  });

  it("rejects a token signed under a different secret", async () => {
    const token = await signUnsubscribeToken("foo@example.com");
    vi.stubEnv("NEWSLETTER_UNSUBSCRIBE_SECRET", "different-secret");
    expect(await verifyUnsubscribeToken("foo@example.com", token)).toBe(false);
  });

  it("rejects garbage tokens without throwing", async () => {
    expect(await verifyUnsubscribeToken("foo@example.com", "not-hex")).toBe(false);
    expect(await verifyUnsubscribeToken("foo@example.com", "")).toBe(false);
  });
});
