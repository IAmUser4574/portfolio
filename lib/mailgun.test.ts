import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { sendEmail } from "@/lib/mailgun";

describe("sendEmail", () => {
  beforeEach(() => {
    vi.stubEnv("MAILGUN_API_KEY", "test-key");
    vi.stubEnv("MAILGUN_DOMAIN", "mg.example.com");
    vi.stubEnv("MAILGUN_FROM", "Briton <newsletter@mg.example.com>");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("posts to the mailgun messages endpoint with basic auth and form-encoded body", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, text: async () => "" });
    vi.stubGlobal("fetch", fetchMock);

    await sendEmail({ to: "foo@example.com", subject: "Hi", html: "<p>hi</p>" });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.mailgun.net/v3/mg.example.com/messages");
    expect(init.method).toBe("POST");
    expect(init.headers.Authorization).toBe(
      `Basic ${Buffer.from("api:test-key").toString("base64")}`
    );

    const body = new URLSearchParams(init.body);
    expect(body.get("to")).toBe("foo@example.com");
    expect(body.get("subject")).toBe("Hi");
    expect(body.get("html")).toBe("<p>hi</p>");
    expect(body.get("from")).toBe("Briton <newsletter@mg.example.com>");
  });

  it("throws with status and body text on a non-ok response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 401, text: async () => "bad key" })
    );

    await expect(
      sendEmail({ to: "foo@example.com", subject: "Hi", html: "<p>hi</p>" })
    ).rejects.toThrow(/401/);
  });

  it("throws if mailgun env vars are missing", async () => {
    vi.unstubAllEnvs();
    await expect(
      sendEmail({ to: "foo@example.com", subject: "Hi", html: "<p>hi</p>" })
    ).rejects.toThrow(/not configured/);
  });
});
