import { BriefcaseBusiness, Download, GraduationCap } from "lucide-react";

import { CvSkills } from "@/components/cv-skills";
import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const experience = [
  {
    company: "Boeing",
    dates: "April 2026 - Present",
    location: "St. Louis, MO",
    role: "Embedded Software Engineer - Vehicle Management Systems",
  },
  {
    company: "First Orion",
    dates: "March 2025 - April 2026",
    location: "Remote - St. Louis, MO",
    role: "Software Engineer - Backend & Cloud",
  },
  {
    company: "Intramotev Inc",
    dates: "May 2024 - March 2025",
    location: "St. Louis, MO",
    role: "Lead Software Engineer - Applications",
  },
  {
    company: "Intramotev Inc",
    dates: "July 2022 - May 2024",
    location: "St. Louis, MO",
    role: "Senior Software Engineer",
  },
  {
    company: "Intramotev Inc",
    dates: "December 2021 - May 2024",
    location: "St. Louis, MO",
    role: "Software Engineer",
  },
  {
    company: "Lectro Engineering",
    dates: "February 2021 - December 2021",
    location: "St. Louis, MO",
    role: "Product Design Engineer",
  },
  {
    company: "True Manufacturing",
    dates: "December 2019 - March 2020",
    location: "St. Louis, MO",
    role: "Robotics and Automation Engineering Co-op",
  },
];

const skillGroups = [
  { label: "Languages", skills: ["C#", "C++", "C", "Python", "TypeScript", "Java"] },
  { label: "Frontend", skills: ["React", "React Native", ".NET MAUI", "Blazor", "WPF"] },
  { label: "Backend", skills: ["ASP.NET", "Spring", "Express", "Django", "Flask", "Nginx"] },
  { label: "Cloud", skills: ["AWS", "Azure", "GCP", "Databricks", "Terraform", "Cloudflare"] },
  { label: "Persistence", skills: ["PostgreSQL", "MongoDB", "DynamoDB", "InfluxDB"] },
  { label: "Virtualization", skills: ["Proxmox", "ESXi", "Docker", "Kubernetes"] },
  { label: "Networking", skills: ["WebRTC", "RTSP", "gRPC", "WebSockets", "mTLS", "WireGuard"] },
  { label: "Protocols", skills: ["LoRa", "I2C", "SPI", "UART", "RS232/485", "CAN"] },
  { label: "Embedded", skills: ["NXP i.MX8", "STM32", "ESP32", "RPi", "Arduino"] },
  { label: "Real-Time", skills: ["FreeRTOS", "ROS2", "linux-rt"] },
  { label: "AI/ML", skills: ["PyTorch", "TensorFlow", "TensorRT", "ONNX", "scikit-learn"] },
  { label: "Data/Learning", skills: ["OpenCV", "NumPy", "SciPy", "Pillow", "Pandas"] },
  { label: "Robotics", skills: ["ROS", "Gazebo", "OpenCV", "NVIDIA Drive"] },
  { label: "Game Engines", skills: ["Unity", "Unreal Engine", "Godot"] },
  { label: "AR/VR", skills: ["Windows Mixed Reality", "HoloLens", "Unity"] },
  { label: "OS", skills: ["Debian", "Ubuntu", "Yocto", "Windows"] },
  { label: "3D Printing", skills: ["FDM", "SLA", "Voron", "RatRig", "PrusaSlicer"] },
  { label: "CAD", skills: ["SolidWorks", "Inventor", "Onshape"] },
  { label: "Collaboration", skills: ["Agile", "Jira", "MS Project", "GitHub"] },
];

const education = [
  {
    school: "Iowa State University",
    credential: "Bachelor of Science in Mechanical Engineering",
    dates: "September 2016 - December 2020",
    research: {
      title: "Undergraduate AI Researcher",
      lab: "Iowa State Self-Aware Complex Systems Lab",
      dates: "May 2019 - December 2020",
      location: "St. Louis, MO",
    },
  },
];

export default function CvPage() {
  return (
    <PageShell>
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="CV"
            title="Experience. Skills. Education."
          >
            All the good bits.
          </SectionHeading>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-4">
            <Card className="rounded-lg">
              <CardHeader className="grid-cols-[1fr_auto] items-center gap-4">
                <CardTitle className="text-2xl">Experience</CardTitle>
                <Button asChild variant="outline" size="sm" className="w-fit">
                  <a
                    href="/resume.pdf"
                    download="Briton-Bauerly-Resume.pdf"
                  >
                    <Download />
                    More details in resume
                  </a>
                </Button>
              </CardHeader>
              <CardContent className="space-y-8">
                {experience.map((item) => (
                  <div key={`${item.company}-${item.role}`} className="border-l pl-5">
                    <div className="flex items-start gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-background text-muted-foreground">
                        <BriefcaseBusiness className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                          <h2 className="font-semibold">{item.company}</h2>
                          <p className="text-sm text-muted-foreground sm:text-right">
                            {item.dates}
                          </p>
                        </div>
                        <div className="mt-1 flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                          <p>{item.role}</p>
                          <p>{item.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Education</CardTitle>
              </CardHeader>
              <CardContent className="space-y-7">
                {education.map((item) => (
                  <div key={item.school} className="border-l pl-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-background text-muted-foreground">
                          <GraduationCap className="size-4" />
                        </span>
                        <div>
                          <h2 className="font-semibold">{item.school}</h2>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {item.credential}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground sm:text-right">
                        {item.dates}
                      </p>
                    </div>
                    {item.research && (
                      <div className="mt-5 rounded-md border bg-background p-4">
                        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          Research
                        </p>
                        <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                          <h3 className="font-semibold">{item.research.title}</h3>
                          <p className="text-sm text-muted-foreground sm:text-right">
                            {item.research.dates}
                          </p>
                        </div>
                        <div className="mt-1 flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                          <p>{item.research.lab}</p>
                          <p>{item.research.location}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <CvSkills groups={skillGroups} />
            </CardContent>
          </Card>
        </div>
      </section>
    </PageShell>
  );
}
