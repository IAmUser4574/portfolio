import { Suspense } from "react";

import { BlogIndex } from "@/components/blog-index";
import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";
import { getBlogPostSummaries, getBlogTags } from "@/lib/blog";

export default async function BlogPage() {
  const posts = await getBlogPostSummaries();
  const tags = await getBlogTags();

  return (
    <PageShell>
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading eyebrow="Blog" title="Letters from the workbench.">
          Writing on software, product thinking, design details, and the useful
          friction that shows up while building real things.
        </SectionHeading>

        <Suspense
          fallback={
            <div className="mt-12 rounded-lg border bg-card p-8 text-muted-foreground">
              Loading posts...
            </div>
          }
        >
          <BlogIndex posts={posts} tags={tags} />
        </Suspense>
      </section>
    </PageShell>
  );
}
