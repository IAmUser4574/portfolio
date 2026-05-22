import { readdirSync } from "fs";
import { join } from "path";
import type { ComponentType } from "react";

import { isPublishedMdxItem } from "@/lib/mdx-utils";

export type MdxCollectionItem<Metadata> = Metadata & {
  slug: string;
  Component: ComponentType;
};

type MdxCollectionKey = "blog" | "projects";

type ModuleLoader = (
  dir: MdxCollectionKey,
  slug: string,
) => Promise<{ default: ComponentType; metadata: unknown }>;

type Readdir = (path: string) => string[];

// split by dir so webpack can statically analyze each import pattern
const defaultLoader: ModuleLoader = async (dir, slug) => {
  if (dir === "blog") return import(`@/content/blog/${slug}.mdx`);
  return import(`@/content/projects/${slug}.mdx`);
};

const defaultReaddir: Readdir = (p) => readdirSync(p) as string[];

export async function getMdxCollection<Metadata>(
  contentDirectory: MdxCollectionKey,
  loader: ModuleLoader = defaultLoader,
  readdir: Readdir = defaultReaddir,
): Promise<MdxCollectionItem<Metadata>[]> {
  const contentPath = join(process.cwd(), "content", contentDirectory);
  const slugs = readdir(contentPath)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));

  const items = await Promise.all(
    slugs.map(async (slug) => {
      const mod = await loader(contentDirectory, slug);
      return {
        slug,
        Component: mod.default,
        ...(mod.metadata as Metadata),
      };
    }),
  );

  return items.filter(isPublishedMdxItem);
}
