"use client";

import { CalendarDays, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BlogPostSummary } from "@/lib/blog";
import { cn } from "@/lib/utils";

type BlogIndexProps = {
  posts: BlogPostSummary[];
  tags: string[];
};

function formatTag(tag: string) {
  return tag.replaceAll("-", " ");
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export function BlogIndex({ posts, tags }: BlogIndexProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedTag = searchParams.get("tag") ?? "";
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true;
      const searchableText = [
        post.title,
        post.excerpt,
        post.readingTime,
        ...post.tags,
      ]
        .join(" ")
        .toLowerCase();
      const matchesSearch = normalizedQuery
        ? searchableText.includes(normalizedQuery)
        : true;

      return matchesTag && matchesSearch;
    });
  }, [posts, query, selectedTag]);

  function updateParams(next: { tag?: string; query?: string }) {
    const params = new URLSearchParams(searchParams.toString());
    const nextTag = next.tag ?? selectedTag;
    const nextQuery = next.query ?? query;

    if (nextTag) {
      params.set("tag", nextTag);
    } else {
      params.delete("tag");
    }

    if (nextQuery.trim()) {
      params.set("q", nextQuery.trim());
    } else {
      params.delete("q");
    }

    router.replace(params.toString() ? `/blog?${params.toString()}` : "/blog", {
      scroll: false,
    });
  }

  function handleSearchChange(value: string) {
    setQuery(value);
    updateParams({ query: value });
  }

  return (
    <div className="mt-12">
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <label className="relative block">
            <span className="sr-only">Search blog posts</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search notes"
              className="h-10 w-full rounded-md border bg-background pl-10 pr-3 text-sm outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/20"
            />
          </label>

          {(selectedTag || query) && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setQuery("");
                updateParams({ tag: "", query: "" });
              }}
            >
              <X />
              Clear
            </Button>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            variant={!selectedTag ? "default" : "outline"}
            size="sm"
            onClick={() => updateParams({ tag: "" })}
          >
            All
          </Button>
          {tags.map((tag) => (
            <Button
              key={tag}
              type="button"
              variant={selectedTag === tag ? "default" : "outline"}
              size="sm"
              className="capitalize"
              onClick={() => updateParams({ tag })}
            >
              {formatTag(tag)}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {filteredPosts.map((post) => (
          <Card
            key={post.slug}
            className="rounded-lg transition-all duration-300 hover:-translate-y-1 hover:border-foreground hover:shadow-lg"
          >
            <CardHeader className="gap-4">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="size-4" />
                    {formatDate(post.publishedAt)}
                  </span>
                  <span>{post.readingTime}</span>
                </div>
                <CardTitle className="text-2xl">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="transition-colors hover:text-muted-foreground"
                  >
                    {post.title}
                  </Link>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="max-w-3xl leading-7 text-muted-foreground">
                {post.excerpt}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => updateParams({ tag })}
                    className={cn(
                      "rounded-md border bg-background px-2.5 py-1 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-foreground hover:text-foreground",
                      selectedTag === tag && "border-foreground text-foreground",
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredPosts.length === 0 && (
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            No posts match those filters yet.
          </div>
        )}
      </div>
    </div>
  );
}
