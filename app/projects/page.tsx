import { ArrowUpRight, Code2, Layers3 } from "lucide-react";
import Link from "next/link";

import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProjectSummaries } from "@/lib/projects";

export default async function ProjectsPage() {
  const projects = await getProjectSummaries();

  return (
    <PageShell>
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading eyebrow="Projects" title="Useful things, built in public enough.">
          A living index for products, experiments, and technical case studies.
          The entries here are ready for deeper writeups as each project matures.
        </SectionHeading>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.title} className="rounded-lg">
              <CardHeader>
                <span className="flex size-11 items-center justify-center rounded-md border bg-accent text-accent-foreground">
                  <Layers3 className="size-5" />
                </span>
                <CardTitle className="text-2xl">{project.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-7 text-muted-foreground">{project.description}</p>
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
                <Button asChild variant="outline" size="sm" className="ml-auto mt-6 flex w-fit">
                  <Link href={`/blog?tag=${encodeURIComponent(project.blogTag)}`}>
                    Blog: {project.blogTag.replaceAll("-", " ")}
                    <ArrowUpRight />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button variant="outline">
            <Code2 />
            GitHub
          </Button>
          <Button>
            Case studies
            <ArrowUpRight />
          </Button>
        </div>
      </section>
    </PageShell>
  );
}
