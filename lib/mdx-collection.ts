import { readdir } from "node:fs/promises";
import path from "node:path";
import type { ComponentType } from "react";

export type MdxCollectionItem<Metadata> = Metadata & {
  slug: string;
  Component: ComponentType;
};

type MdxModule<Metadata> = {
  default: ComponentType;
  metadata: Metadata;
};

async function getMdxSlugs(contentDirectory: string) {
  const files = await readdir(path.join(process.cwd(), "content", contentDirectory));

  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""))
    .sort((a, b) => a.localeCompare(b));
}

export async function getMdxCollection<Metadata>(
  contentDirectory: string,
): Promise<MdxCollectionItem<Metadata>[]> {
  const slugs = await getMdxSlugs(contentDirectory);
  const items = await Promise.all(
    slugs.map(async (slug) => {
      const item = (await import(
        `@/content/${contentDirectory}/${slug}.mdx`
      )) as MdxModule<Metadata>;

      return {
        slug,
        Component: item.default,
        ...item.metadata,
      };
    }),
  );

  return items;
}
