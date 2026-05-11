export function isPublishedMdxItem(item: unknown) {
  if (!item || typeof item !== "object" || !("publishedAt" in item)) {
    return false;
  }

  const publishedAt = item.publishedAt;

  return typeof publishedAt === "string" && publishedAt.trim().length > 0;
}
