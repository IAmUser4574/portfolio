import { describe, expect, it, vi } from "vitest";

import type { MdxCollectionItem } from "@/lib/mdx-collection";
import type { BlogPostMetadata } from "@/lib/blog";

vi.mock("@/lib/mdx-collection");

import { getMdxCollection } from "@/lib/mdx-collection";
import { getBlogPost, getBlogPostSummaries, getBlogPosts, getBlogTags } from "@/lib/blog";

const mockGetMdxCollection = vi.mocked(getMdxCollection);

const makePost = (
  overrides: Partial<BlogPostMetadata & { slug: string }> = {},
): MdxCollectionItem<BlogPostMetadata> => ({
  slug: "my-post",
  Component: () => null,
  title: "My Post",
  excerpt: "An excerpt",
  publishedAt: "2024-06-01",
  readingTime: "3 min",
  tags: [],
  ...overrides,
});

describe("getBlogPosts", () => {
  it("sorts posts newest first", async () => {
    mockGetMdxCollection.mockResolvedValue([
      makePost({ slug: "older", publishedAt: "2023-01-01" }),
      makePost({ slug: "newer", publishedAt: "2024-06-01" }),
    ]);
    const posts = await getBlogPosts();
    expect(posts[0].slug).toBe("newer");
    expect(posts[1].slug).toBe("older");
  });

  it("returns slugs suitable for generateStaticParams", async () => {
    mockGetMdxCollection.mockResolvedValue([
      makePost({ slug: "post-a" }),
      makePost({ slug: "post-b" }),
    ]);
    const params = (await getBlogPosts()).map((p) => ({ slug: p.slug }));
    expect(params).toEqual([{ slug: "post-a" }, { slug: "post-b" }]);
  });
});

describe("getBlogPost", () => {
  it("finds a post by slug", async () => {
    mockGetMdxCollection.mockResolvedValue([
      makePost({ slug: "target", title: "Target Post" }),
      makePost({ slug: "other" }),
    ]);
    const post = await getBlogPost("target");
    expect(post?.title).toBe("Target Post");
  });

  it("returns undefined for an unknown slug", async () => {
    mockGetMdxCollection.mockResolvedValue([makePost({ slug: "existing" })]);
    expect(await getBlogPost("missing")).toBeUndefined();
  });
});

describe("getBlogPostSummaries", () => {
  it("omits Component from summaries", async () => {
    mockGetMdxCollection.mockResolvedValue([makePost()]);
    const [summary] = await getBlogPostSummaries();
    expect(summary).not.toHaveProperty("Component");
  });

  it("includes expected fields", async () => {
    mockGetMdxCollection.mockResolvedValue([
      makePost({ slug: "s", title: "T", excerpt: "E", publishedAt: "2024-01-01", readingTime: "1 min", tags: ["x"] }),
    ]);
    const [summary] = await getBlogPostSummaries();
    expect(summary).toMatchObject({ slug: "s", title: "T", excerpt: "E", tags: ["x"] });
  });
});

describe("getBlogTags", () => {
  it("returns a sorted, deduplicated list of tags", async () => {
    mockGetMdxCollection.mockResolvedValue([
      makePost({ tags: ["rust", "c++"] }),
      makePost({ tags: ["rust", "next"] }),
    ]);
    const tags = await getBlogTags();
    expect(tags).toEqual(["c++", "next", "rust"]);
  });
});
