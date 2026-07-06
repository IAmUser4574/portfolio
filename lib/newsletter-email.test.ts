import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { renderNewPostEmail, renderWelcomeEmail } from "@/lib/newsletter-email";

const unsubscribeUrl = "https://briton.dev/api/newsletter/unsubscribe?email=foo%40example.com&token=abc";

describe("renderWelcomeEmail", () => {
  it("includes the wordmark and the unsubscribe link", () => {
    const { subject, html } = renderWelcomeEmail(unsubscribeUrl);
    expect(subject).toMatch(/subscribed/i);
    expect(html).toContain("Briton");
    expect(html).toContain(unsubscribeUrl);
  });
});

describe("renderNewPostEmail", () => {
  beforeEach(() => {
    vi.stubEnv("SITE_URL", "https://briton.dev");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("includes the post title, excerpt, link, and unsubscribe link", () => {
    const { subject, html } = renderNewPostEmail(
      { title: "Hello World", excerpt: "An excerpt.", slug: "hello-world" },
      unsubscribeUrl
    );
    expect(subject).toContain("Hello World");
    expect(html).toContain("Hello World");
    expect(html).toContain("An excerpt.");
    expect(html).toContain("https://briton.dev/blog/hello-world");
    expect(html).toContain(unsubscribeUrl);
  });
});
