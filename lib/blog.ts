import type { ComponentType } from "react";

import BuildingHomebase, {
  metadata as buildingHomebaseMetadata,
} from "@/content/blog/building-a-homebase.mdx";
import ProductEngineering, {
  metadata as productEngineeringMetadata,
} from "@/content/blog/notes-on-product-engineering.mdx";

export type BlogPostMetadata = {
  title: string;
  excerpt: string;
  publishedAt: string;
  readingTime: string;
  tags: string[];
};

export type BlogPost = BlogPostMetadata & {
  slug: string;
  Component: ComponentType;
};

const posts: BlogPost[] = [
  {
    slug: "building-a-homebase",
    Component: BuildingHomebase,
    ...(buildingHomebaseMetadata as BlogPostMetadata),
  },
  {
    slug: "notes-on-product-engineering",
    Component: ProductEngineering,
    ...(productEngineeringMetadata as BlogPostMetadata),
  },
];

export function getBlogPosts() {
  return [...posts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getBlogPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}
