import {
  ArrowDown,
  BookOpen,
  BriefcaseBusiness,
  Cog,
  FileText,
  Film,
  Mail,
  Trophy,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";

import { HomeIntro } from "@/components/home-intro";
import { JourneyTimeline } from "@/components/journey-timeline";
import type { JourneyEvent } from "@/components/journey-timeline";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";

const homeTiles = [
  {
    title: "About",
    href: "#about",
    description: "A little bit about my story, what I do, and why I do it.",
    icon: ArrowDown,
  },
  {
    title: "Projects",
    href: "/projects",
    description: "Projects I've planned, completed, or am working on.",
    icon: Cog,
  },
  {
    title: "Blog",
    href: "/blog",
    description: "Letters from the workbench.",
    icon: BookOpen,
  },
  {
    title: "CV",
    href: "/cv",
    description: "Recruiters and snoopers, go nuts.",
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

const interests = [
  {
    title: "Tennis",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae sem at ipsum facilisis dictum.",
    icon: Trophy,
  },
  {
    title: "Movies",
    description:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Film notes live on Letterboxd.",
    icon: Film,
  },
];

const journeyEvents: JourneyEvent[] = [
  {
    dateLabel: "1997",
    dateValue: 1997,
    direction: "up",
    kind: "Personal",
    title: "Born",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing.",
  },
  {
    dateLabel: "2000s",
    dateValue: 2004,
    direction: "down",
    kind: "Personal",
    title: "Robot stories",
    description:
      "Robot Jox, The Iron Giant, Short Circuit, Transformers, LEGOs, and Bionicles.",
  },
  {
    dateLabel: "2000s",
    dateValue: 2006,
    direction: "down",
    kind: "Personal",
    title: "Taking things apart at home",
    description:
      "I started annoying my parents by tinkering with home electronics.",
  },
  {
    dateLabel: "2011",
    dateValue: 2011,
    direction: "down",
    kind: "Personal",
    title: "Learned C++",
    description:
      "Picked up two C++03 textbooks at Half-Price Books and began my journey programming with Code::Blocks.",
  },
  {
    dateLabel: "2013",
    dateValue: 2013,
    direction: "down",
    kind: "Personal",
    title: "First 3d printer",
    description:
      "Convinced my parents to buy me a PrintrBot.",
  },
  {
    dateLabel: "2016",
    dateValue: 2016,
    direction: "up",
    kind: "Career",
    title: "Iowa State University",
    description:
      "Received a degree in Mechanical Engineering and pursued research leveraging artificial intelligence in automotive and robotics.",
  },
    {
    dateLabel: "2020",
    dateValue: 2020,
    direction: "down",
    kind: "Career",
    title: "Factory Robotics",
    description:
      "Worked on factory automomation robotics systems in the St. Louis area.",
  },
  {
    dateLabel: "2021",
    dateValue: 2021,
    direction: "up",
    kind: "Career",
    title: "Autonomous rail",
    description:
      "Joined the budding St Louis startup as employee no. 2 to help build autonomous electric trains.",
  },
  {
    dateLabel: "2022",
    dateValue: 2022,
    direction: "down",
    kind: "Personal",
    title: "Got married",
    description:
      "Fooled someone into thinking I was marriage material.",
  },
  
  {
    dateLabel: "Now",
    dateValue: 2026,
    direction: "down",
    kind: "Career",
    title: "Startup era",
    description:
      "Personal bootstrapped startups, stealth startups with friends.",
  },
  {
    dateLabel: "Now",
    dateValue: 2026.2,
    direction: "up",
    kind: "Career",
    title: "Autonomous air",
    description:
      "Embedded Vehicle Management Software Engineer for an autonomous air vehicle project.",
  },
];

export default function Home() {
  return (
    <PageShell>
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:py-20">
        <div className="flex w-full flex-col items-center">
          <HomeIntro>
            <div className="mt-8 grid w-full max-w-5xl auto-rows-fr grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {homeTiles.map((tile) => {
                const Icon = tile.icon;
                const tileClassName =
                  "group flex h-full min-h-36 flex-col items-center justify-center gap-8 rounded-lg border bg-card p-4 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-foreground hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/30 sm:aspect-square sm:min-h-40 sm:p-5";
                const tileContent = (
                  <>
                    <span className="flex size-14 items-center justify-center text-foreground transition-transform group-hover:scale-110">
                      <Icon className="size-14" />
                    </span>
                    <span>
                      <span className="block text-lg font-semibold text-foreground">
                        {tile.title}
                      </span>
                      <span className="mt-2 block text-sm leading-6 text-muted-foreground">
                        {tile.description}
                      </span>
                    </span>
                  </>
                );

                return (
                  <div key={tile.title} className="h-full">
                    {tile.href.startsWith("#") ? (
                      <a href={tile.href} className={tileClassName}>
                        {tileContent}
                      </a>
                    ) : (
                      <Link href={tile.href} className={tileClassName}>
                        {tileContent}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="mt-8 max-w-2xl text-xl leading-9 text-muted-foreground">
              I build autonomous planes, trains, and automobiles. And robots. And 3d printers. 
              And websites, apps, automations, and whatever else.
            </p>
          </HomeIntro>
        </div>
      </section>

      <section id="about" className="border-t bg-card">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                About
              </p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight">
                Who I am and what gets me out of bed.
              </h2>
              <div className="mt-8 overflow-hidden rounded-lg border bg-background">
                <Image
                  src="/homebase-sketch.jpg"
                  alt="Whiteboard sketch of my portfolio homepage layout."
                  width={900}
                  height={540}
                  className="aspect-[5/3] w-full object-cover"
                  priority
                />
              </div>
            </div>
            <div className="space-y-6 text-lg leading-8 text-muted-foreground">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
                vitae sem at ipsum facilisis dictum sed sed lorem.
              </p>
              <p>
                Sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                ullamco.
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

          <div className="mt-20 border-t pt-12">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Journey
              </p>
              <h3 className="mt-3 text-3xl font-semibold tracking-tight">
                Frome cradle to desk: a timeline.
              </h3>
            </div>

            <JourneyTimeline events={journeyEvents} />
          </div>

          <div className="mt-20 border-t pt-12">
            <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Off-World
                </p>
                <h3 className="mt-3 text-3xl font-semibold tracking-tight">
                  My other interests.
                </h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {interests.map((interest) => {
                  const Icon = interest.icon;

                  return (
                    <div
                      key={interest.title}
                      className="rounded-lg border bg-background p-5"
                    >
                      <Icon className="size-6 text-foreground" />
                      <h4 className="mt-4 text-xl font-semibold text-foreground">
                        {interest.title}
                      </h4>
                      <p className="mt-3 leading-7 text-muted-foreground">
                        {interest.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button asChild variant="outline">
                <a
                  href="https://letterboxd.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Letterboxd
                  <Film />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t bg-background">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>&copy; {new Date().getFullYear()} Briton Bauerly. All rights reserved.</p>
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
