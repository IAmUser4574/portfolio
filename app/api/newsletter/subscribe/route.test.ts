import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/newsletter");

import { subscribe } from "@/lib/newsletter";
import { POST } from "@/app/api/newsletter/subscribe/route";

const mockSubscribe = vi.mocked(subscribe);

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/newsletter/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/newsletter/subscribe", () => {
  it("rejects a missing email", async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
    expect(mockSubscribe).not.toHaveBeenCalled();
  });

  it("rejects an invalid email", async () => {
    const res = await POST(makeRequest({ email: "not-an-email" }));
    expect(res.status).toBe(400);
    expect(mockSubscribe).not.toHaveBeenCalled();
  });

  it("subscribes a valid email", async () => {
    mockSubscribe.mockResolvedValueOnce(undefined);
    const res = await POST(makeRequest({ email: "foo@example.com" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(mockSubscribe).toHaveBeenCalledWith("foo@example.com");
  });

  it("returns 500 if subscribe throws", async () => {
    mockSubscribe.mockRejectedValueOnce(new Error("db down"));
    const res = await POST(makeRequest({ email: "foo@example.com" }));
    expect(res.status).toBe(500);
  });
});
