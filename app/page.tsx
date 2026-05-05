import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  FileText,
  Layers3,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const homeTiles = [
  {
    title: "About",
    href: "#about",
    description: "How I think, what I build, and where this homebase points.",
    icon: ArrowDown,
  },
  {
    title: "Projects",
    href: "/projects",
    description: "Product ideas, technical experiments, and shipped work.",
    icon: Layers3,
  },
  {
    title: "Blog",
    href: "/blog",
    description: "Notes on software, systems, product craft, and learning.",
    icon: BookOpen,
  },
  {
    title: "CV",
    href: "/cv",
    description: "Experience, skills, tooling, and practical background.",
    icon: FileText,
  },
];

export default function Home() {
  return (
    <PageShell>
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl content-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div className="flex flex-col justify-center">
          <p className="font-mono text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Hi, I&apos;m
          </p>
          <h1 className="mt-4 text-6xl font-semibold tracking-tight text-foreground sm:text-7xl lg:text-8xl">
            Briton
          </h1>
          <p className="mt-7 max-w-2xl text-xl leading-9 text-muted-foreground">
            I build modern web and mobile products with a bias toward useful
            tools, clean interfaces, and systems that can survive contact with
            real people.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/projects">
                View projects
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#about">About me</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {homeTiles.map((tile) => {
            const Icon = tile.icon;
            const TileWrapper = tile.href.startsWith("#") ? "a" : Link;

            return (
              <TileWrapper key={tile.title} href={tile.href} className="group">
                <Card className="h-full min-h-44 overflow-hidden rounded-lg border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-foreground hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/30">
                  <CardHeader className="flex-row items-start justify-between gap-4">
                    <CardTitle className="text-2xl">{tile.title}</CardTitle>
                    <span className="flex size-10 items-center justify-center rounded-md border bg-background transition-colors group-hover:bg-foreground group-hover:text-background">
                      <Icon className="size-5" />
                    </span>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {tile.description}
                    </p>
                  </CardContent>
                </Card>
              </TileWrapper>
            );
          })}
        </div>
      </section>

      <section id="about" className="border-t bg-card">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              About
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight">
              Practical engineering, human-shaped products.
            </h2>
            <div className="mt-8 overflow-hidden rounded-lg border bg-background">
              <Image
                src="/homebase-sketch.jpg"
                alt="Whiteboard sketch of Briton's portfolio homepage layout."
                width={900}
                height={540}
                className="aspect-[5/3] w-full object-cover"
                priority
              />
            </div>
          </div>
          <div className="space-y-6 text-lg leading-8 text-muted-foreground">
            <p>
              This site is meant to be a working homebase: a place where the
              projects, writing, and resume all live together instead of being
              scattered across tabs and old links.
            </p>
            <p>
              My favorite work sits where product judgment and engineering
              detail meet. I like turning ambiguous ideas into sturdy software,
              then polishing the experience until the useful path feels obvious.
            </p>
            <div className="grid gap-3 pt-4 sm:grid-cols-3">
              {["Next.js", "React", "Tailwind", "TypeScript", "MDX", "Design systems"].map(
                (skill) => (
                  <div
                    key={skill}
                    className="rounded-md border bg-background px-4 py-3 text-sm font-medium text-foreground"
                  >
                    {skill}
                  </div>
                ),
              )}
            </div>
            <Button asChild variant="outline" className="mt-2">
              <Link href="/blog">
                Read the blog
                <BriefcaseBusiness />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
