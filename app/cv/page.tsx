import { Download, Mail } from "lucide-react";

import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const experience = [
  {
    role: "Lorem ipsum role",
    detail:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    role: "Dolor sit amet",
    detail:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    role: "Consectetur adipiscing",
    detail:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
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
          <SectionHeading eyebrow="CV" title="Experience. Skills. Education. All the good bits">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
            posuere erat a ante venenatis dapibus.
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
