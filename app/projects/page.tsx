import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

const thumbnailPositionClass = {
  center: "object-center",
  top: "object-top",
  bottom: "object-bottom",
  left: "object-left",
  right: "object-right",
} as const;

import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProjectSummaries } from "@/lib/projects";
import { HiWrenchScrewdriver } from "react-icons/hi2";

export default async function ProjectsPage() {
  const projects = await getProjectSummaries();

  return (
    <PageShell>
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading eyebrow="Projects" title="Tools, apps, and gadgets.">
          A selection of the projects I&apos;m currently working on or have recently completed.
        </SectionHeading>

        <div className="mt-12 grid items-stretch gap-4 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.title} className="h-full gap-0 overflow-hidden rounded-lg p-0">
              {project.thumbnail && (
                <div className="relative aspect-video w-full">
                  <Image
                    src={project.thumbnail.src}
                    alt={project.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 370px"
                    className={cn("object-cover", thumbnailPositionClass[project.thumbnail.position ?? "center"])}

                  />
                </div>
              )}
              <div className="flex flex-1 flex-col gap-6 py-6">
                <CardHeader>
                  {!project.thumbnail && (
                    <span className="flex size-11 items-center justify-center rounded-md border bg-accent text-accent-foreground">
                      <HiWrenchScrewdriver className="size-5" />
                    </span>
                  )}
                  <CardTitle className="text-2xl">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="transition-colors hover:text-muted-foreground"
                    >
                      {project.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <p className="leading-7 text-muted-foreground">{project.description}</p>
                  <div className="mt-auto pt-6">
                    <div className="flex min-h-16 flex-wrap content-start gap-2">
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
                      <Button asChild variant="outline" size="sm" className="ml-auto mt-6 flex w-fit">
                        <Link href={`/blog?tag=${encodeURIComponent(project.blogTag)}`}>
                          Blog: {project.blogTag.replaceAll("-", " ")}
                          <ArrowUpRight />
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {/* <Button variant="outline">
            <Code2 />
            GitHub
          </Button>
          <Button>
            Case studies
            <ArrowUpRight />
          </Button> */}
        </div>
      </section>
    </PageShell>
  );
}
