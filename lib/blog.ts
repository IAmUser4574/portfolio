import type { ComponentType } from "react";

import { getMdxCollection } from "@/lib/mdx-collection";
import { getProjectBlogTags } from "@/lib/projects";

export type BlogPostMetadata = {
  title: string;
  excerpt: string;
  publishedAt: string;
  readingTime: string;
  tags: string[];
  toc?: boolean;
};

export type BlogPost = BlogPostMetadata & {
  slug: string;
  Component: ComponentType;
};

export type BlogPostSummary = Omit<BlogPost, "Component">;

export async function getBlogPosts() {
  const posts = await getMdxCollection<BlogPostMetadata>("blog");

  return posts.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function getBlogPost(slug: string) {
  return (await getBlogPosts()).find((post) => post.slug === slug);
}

export async function getBlogPostSummaries(): Promise<BlogPostSummary[]> {
  return (await getBlogPosts()).map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    publishedAt: post.publishedAt,
    readingTime: post.readingTime,
    tags: post.tags,
  }));
}

export async function getBlogTags() {
  return Array.from(
    new Set([
      ...(await getProjectBlogTags()),
      ...(await getBlogPosts()).flatMap((post) => post.tags),
    ]),
  ).sort((a, b) => a.localeCompare(b));
}
