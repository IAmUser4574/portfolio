import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/newsletter");

import { sendNewPostNotifications } from "@/lib/newsletter";
import { POST } from "@/app/api/newsletter/send-new-posts/route";

const mockSend = vi.mocked(sendNewPostNotifications);

function makeRequest(secret?: string) {
  return new NextRequest("http://localhost/api/newsletter/send-new-posts", {
    method: "POST",
    headers: secret ? { "X-Newsletter-Cron-Secret": secret } : {},
  });
}

describe("POST /api/newsletter/send-new-posts", () => {
  beforeEach(() => {
    vi.stubEnv("NEWSLETTER_CRON_SECRET", "correct-secret");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("rejects a missing secret", async () => {
    const res = await POST(makeRequest());
    expect(res.status).toBe(401);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("rejects a wrong secret", async () => {
    const res = await POST(makeRequest("wrong-secret"));
    expect(res.status).toBe(401);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("runs the send job with the correct secret", async () => {
    mockSend.mockResolvedValueOnce({ processedSlugs: ["a"], subscriberCount: 2 });
    const res = await POST(makeRequest("correct-secret"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ processedSlugs: ["a"], subscriberCount: 2 });
  });

  it("returns 500 if the send job throws", async () => {
    mockSend.mockRejectedValueOnce(new Error("boom"));
    const res = await POST(makeRequest("correct-secret"));
    expect(res.status).toBe(500);
  });
});
