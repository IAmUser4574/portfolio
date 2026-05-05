import { ArrowRight, CalendarDays } from "lucide-react";
import Link from "next/link";

import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBlogPosts } from "@/lib/blog";

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <PageShell>
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading eyebrow="Blog" title="Notes from the workbench.">
          Writing on software, product thinking, design details, and the useful
          friction that shows up while building real things.
        </SectionHeading>

        <div className="mt-12 grid gap-4">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <Card className="rounded-lg transition-all duration-300 hover:-translate-y-1 hover:border-foreground hover:shadow-lg">
                <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays className="size-4" />
                        {new Intl.DateTimeFormat("en", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }).format(new Date(`${post.publishedAt}T00:00:00`))}
                      </span>
                      <span>{post.readingTime}</span>
                    </div>
                    <CardTitle className="text-2xl">{post.title}</CardTitle>
                  </div>
                  <ArrowRight className="mt-1 size-5 transition-transform group-hover:translate-x-1" />
                </CardHeader>
                <CardContent>
                  <p className="max-w-3xl leading-7 text-muted-foreground">
                    {post.excerpt}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border bg-background px-2.5 py-1 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
