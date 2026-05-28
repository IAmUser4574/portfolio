import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { TableOfContents } from "@/components/table-of-contents";
import { ViewCounter } from "@/components/view-counter";
import { getProject, getProjects } from "@/lib/projects";
import { getHeadings } from "@/lib/heading-utils";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export async function generateStaticParams() {
  return (await getProjects()).map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {};
  }

  return {
    title: `${project.title} | Briton`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const Project = project.Component;

  return (
    <PageShell>
      <article className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
        <Button asChild variant="ghost" className="-ml-3 mb-4">
          <Link href="/projects" aria-label="Back to projects">
            <ArrowLeft />
          </Link>
        </Button>
        <div className="border-b pb-10">
          <p className="flex items-center gap-8 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            <span>{formatDate(project.publishedAt)}</span>
            <ViewCounter slug={`projects/${slug}`} />
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            {project.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <span
                key={item}
                className="rounded-md border bg-background px-2.5 py-1 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground"
              >
                {item}
              </span>
            ))}
          </div>
          {project.blogTag && (
            <Button asChild variant="outline" size="sm" className="mt-6">
              <Link href={`/blog?tag=${encodeURIComponent(project.blogTag)}`}>
                Blog: {project.blogTag.replaceAll("-", " ")}
                <ArrowUpRight />
              </Link>
            </Button>
          )}
        </div>
        <div className="space-y-6 pt-10 text-lg leading-8 text-muted-foreground">
          {project.toc && <TableOfContents headings={getHeadings("projects", slug)} />}
          <Project />
        </div>
      </article>
    </PageShell>
  );
}
