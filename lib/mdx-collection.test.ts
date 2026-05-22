import { describe, expect, it, vi } from "vitest";

import { isPublishedMdxItem } from "@/lib/mdx-utils";
import { getMdxCollection } from "@/lib/mdx-collection";

describe("isPublishedMdxItem", () => {
  it("accepts MDX items with a non-empty publishedAt string", () => {
    expect(isPublishedMdxItem({ publishedAt: "2026-05-05" })).toBe(true);
  });

  it("rejects unpublished or invalid MDX items", () => {
    expect(isPublishedMdxItem({ publishedAt: "" })).toBe(false);
    expect(isPublishedMdxItem({ publishedAt: "   " })).toBe(false);
    expect(isPublishedMdxItem({ publishedAt: undefined })).toBe(false);
    expect(isPublishedMdxItem({ publishedAt: null })).toBe(false);
  });
});

// --- getMdxCollection ---

const makeLoader =
  (fixtures: Record<string, Record<string, unknown>>) =>
  async (_dir: string, slug: string) => ({
    default: (() => null) as React.ComponentType,
    metadata: fixtures[slug] ?? { publishedAt: "" },
  });

describe("getMdxCollection", () => {
  it("returns only published items", async () => {
    const readdir = vi.fn().mockReturnValue(["published.mdx", "draft.mdx"]);
    const loader = makeLoader({
      published: { publishedAt: "2024-06-01" },
      draft: { publishedAt: "" },
    });
    const result = await getMdxCollection("blog", loader, readdir);
    expect(result).toHaveLength(1);
  });

  it("derives slug from filename without extension", async () => {
    const readdir = vi.fn().mockReturnValue(["my-post.mdx"]);
    const loader = makeLoader({ "my-post": { publishedAt: "2024-06-01" } });
    const [item] = await getMdxCollection("blog", loader, readdir);
    expect(item.slug).toBe("my-post");
  });

  it("ignores non-mdx files", async () => {
    const readdir = vi.fn().mockReturnValue(["my-post.mdx", "notes.txt", ".DS_Store"]);
    const loader = makeLoader({ "my-post": { publishedAt: "2024-06-01" } });
    const result = await getMdxCollection("blog", loader, readdir);
    expect(result).toHaveLength(1);
  });

  it("spreads metadata onto each item", async () => {
    const readdir = vi.fn().mockReturnValue(["my-post.mdx"]);
    const loader = makeLoader({ "my-post": { publishedAt: "2024-06-01", title: "Hello" } });
    const [item] = await getMdxCollection<{ title: string; publishedAt: string }>(
      "blog",
      loader,
      readdir,
    );
    expect(item.title).toBe("Hello");
    expect(item.publishedAt).toBe("2024-06-01");
  });

  it("attaches a Component to each item", async () => {
    const readdir = vi.fn().mockReturnValue(["my-post.mdx"]);
    const loader = makeLoader({ "my-post": { publishedAt: "2024-06-01" } });
    const [item] = await getMdxCollection("blog", loader, readdir);
    expect(item.Component).toBeTypeOf("function");
  });

  it("works for the projects collection", async () => {
    const readdir = vi.fn().mockReturnValue(["my-project.mdx"]);
    const loader = makeLoader({ "my-project": { publishedAt: "2024-01-01" } });
    const [item] = await getMdxCollection("projects", loader, readdir);
    expect(item.slug).toBe("my-project");
  });

  it("returns empty array when directory is empty", async () => {
    const readdir = vi.fn().mockReturnValue([]);
    const result = await getMdxCollection("blog", makeLoader({}), readdir);
    expect(result).toHaveLength(0);
  });
});
