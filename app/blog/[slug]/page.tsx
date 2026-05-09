import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { getBlogPost, getBlogPosts } from "@/lib/blog";
import { ArrowLeft } from "lucide-react";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return (await getBlogPosts()).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {};
  }

  return {
    title: `${post.title} | Briton`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const Post = post.Component;

  return (
    <PageShell>
      <article className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
        <Button asChild variant="ghost" className="-ml-3 mb-4">
          <Link href="/blog" aria-label={`Read ${post.title}`}>
            <ArrowLeft className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
        <div className="border-b pb-10">
          <p className="flex items-center gap-8 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            <span>{post.publishedAt}</span>
            {/* <span aria-hidden="true">|</span> */}
            <span>{post.readingTime}</span>
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            {post.excerpt}
          </p>
        </div>
        <div className="pt-10 text-lg">
          <Post />
        </div>
      </article>
    </PageShell>
  );
}
