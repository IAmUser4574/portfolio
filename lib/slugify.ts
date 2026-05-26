// converts heading text to a URL-safe id
export function slugify(text: string): string {
  return text
    .replace(/`([^`]*)`/g, "$1") // strip backtick syntax, keep content
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
