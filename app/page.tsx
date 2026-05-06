import {
  ArrowDown,
  BookOpen,
  BriefcaseBusiness,
  FileText,
  Layers3,
  Mail,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";

import { Name } from "@/components/name";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";

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

const footerLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/",
    icon: FaLinkedin,
  },
  {
    label: "GitHub",
    href: "https://github.com/",
    icon: FaGithub,
  },
  {
    label: "Email",
    href: "mailto:hello@example.com",
    icon: Mail,
  },
];

export default function Home() {
  return (
    <PageShell>
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:py-20">
        <div className="flex w-full flex-col items-center">
          <p className="font-mono text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Hi, I&apos;m
          </p>
          <Name />

          <div className="mt-8 flex w-full flex-wrap justify-center gap-3">
            {homeTiles.map((tile) => {
              const Icon = tile.icon;

              return (
                <Button
                  key={tile.title}
                  asChild
                  variant="outline"
                  size="lg"
                  className="min-w-36 transition-all hover:-translate-y-0.5 hover:border-foreground hover:shadow-md"
                >
                  {tile.href.startsWith("#") ? (
                    <a href={tile.href}>
                      <Icon />
                      {tile.title}
                    </a>
                  ) : (
                    <Link href={tile.href}>
                      <Icon />
                      {tile.title}
                    </Link>
                  )}
                </Button>
              );
            })}
          </div>

          <p className="mt-8 max-w-2xl text-xl leading-9 text-muted-foreground">
            I build modern web and mobile products with a bias toward useful
            tools, clean interfaces, and systems that can survive contact with
            real people.
          </p>
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

      <footer className="border-t bg-background">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>&copy; {new Date().getFullYear()} Briton. All rights reserved.</p>
          <div className="flex flex-wrap gap-2">
            {footerLinks.map((link) => {
              const Icon = link.icon;

              return (
                <Button key={link.label} asChild variant="ghost" size="sm">
                  <a href={link.href} target="_blank" rel="noreferrer">
                    <Icon className="size-5" />
                    {/* {link.label} */}
                  </a>
                </Button>
              );
            })}
          </div>
        </div>
      </footer>
    </PageShell>
  );
}
