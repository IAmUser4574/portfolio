import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { renderNewPostEmail, renderWelcomeEmail } from "@/lib/newsletter-email";

const unsubscribeUrl = "https://briton.dev/api/newsletter/unsubscribe?email=foo%40example.com&token=abc";

describe("renderWelcomeEmail", () => {
  it("includes the wordmark and the unsubscribe link", () => {
    const { subject, html } = renderWelcomeEmail(unsubscribeUrl);
    expect(subject).toMatch(/subscribed/i);
    expect(html).toContain("BRITON.DEV");
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

  it("includes the thumbnail image as an absolute URL when present", () => {
    const { html } = renderNewPostEmail(
      {
        title: "Hello World",
        excerpt: "An excerpt.",
        slug: "hello-world",
        thumbnail: { src: "/blog/hello-world/cover.jpg" },
      },
      unsubscribeUrl
    );
    expect(html).toContain("<img");
    expect(html).toContain("https://briton.dev/blog/hello-world/cover.jpg");
    expect(html).toContain('alt="Hello World"');
  });

  it("omits the image entirely when there is no thumbnail", () => {
    const { html } = renderNewPostEmail(
      { title: "Hello World", excerpt: "An excerpt.", slug: "hello-world" },
      unsubscribeUrl
    );
    expect(html).not.toContain("<img");
  });
});
