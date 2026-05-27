import { readFileSync } from "fs";
import { join } from "path";

import { slugify } from "@/lib/slugify";

export type Heading = {
  text: string;
  slug: string;
  level: 2 | 3;
};

function extractHeadings(rawMdx: string): Heading[] {
  const headings: Heading[] = [];
  let inCodeFence = false;

  for (const line of rawMdx.split(/\r?\n/)) {
    if (line.startsWith("```")) {
      inCodeFence = !inCodeFence;
      continue;
    }
    if (inCodeFence) continue;

    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const raw = match[2].trim();
      const text = raw.replace(/`([^`]*)`/g, "$1");
      headings.push({ level: match[1].length as 2 | 3, text, slug: slugify(raw) });
    }
  }

  return headings;
}

export function getHeadings(
  collection: "blog" | "projects",
  slug: string,
): Heading[] {
  const raw = readFileSync(
    join(process.cwd(), "content", collection, `${slug}.mdx`),
    "utf8",
  );
  return extractHeadings(raw);
}
