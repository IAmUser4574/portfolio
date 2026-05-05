import { Download, Mail } from "lucide-react";

import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const experience = [
  {
    role: "Full-stack product engineer",
    detail:
      "Building TypeScript applications across web, API, and mobile surfaces with an eye for maintainability and product clarity.",
  },
  {
    role: "Frontend systems",
    detail:
      "Designing component-driven interfaces with React, Tailwind, shadcn/ui patterns, and accessible interaction states.",
  },
  {
    role: "Backend foundations",
    detail:
      "Working through data modeling, API contracts, auth flows, and deployment concerns so products have sturdy roots.",
  },
];

const skills = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "shadcn/ui",
  "Expo",
  "Node.js",
  "Prisma",
  "PostgreSQL",
  "MDX",
];

export default function CvPage() {
  return (
    <PageShell>
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading eyebrow="CV" title="Experience and working toolkit.">
            A concise resume page for the site, ready to expand with specific
            roles, dates, impact, and links as the portfolio fills out.
          </SectionHeading>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline">
              <Mail />
              Contact
            </Button>
            <Button>
              <Download />
              Resume
            </Button>
          </div>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-7">
              {experience.map((item) => (
                <div key={item.role} className="border-l pl-5">
                  <h2 className="font-semibold">{item.role}</h2>
                  <p className="mt-2 leading-7 text-muted-foreground">{item.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md border bg-background px-3 py-2 text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </PageShell>
  );
}
