import { describe, expect, it } from "vitest";

import { isPublishedMdxItem } from "@/lib/mdx-utils";

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
