import { BriefcaseBusiness, Download, GraduationCap, Mail } from "lucide-react";

import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const experience = [
  {
    company: "First Orion",
    dates: "March 2025 - Present",
    location: "Remote - St. Louis, MO",
    role: "Software Engineer - Backend & Cloud",
    bullets: [
      "Engineered high-performance, security-critical C++ software running on bare-metal infrastructure for a tier-1 telecommunications provider.",
      "Led the design and implementation of a greenfield cloud-native software project for a new international customer, scaling to millions of users with cutting-edge AWS tools.",
    ],
  },
  {
    company: "Intramotev Inc",
    dates: "May 2024 - March 2025",
    location: "St. Louis, MO",
    role: "Lead Software Engineer - Applications",
    bullets: [
      "Designed, implemented, and managed Intramotev's applications stack of server, client, and onboard vehicle controls software.",
      "Defined and prioritized features and user stories for the product roadmap, software releases, and sprint planning while collaborating with leadership, stakeholders, and team members.",
      "Fostered product quality and consistency by instating software measures including end-to-end hardware-in-the-loop testing, CI/CD, and robust runtime telemetry.",
    ],
  },
  {
    company: "Intramotev Inc",
    dates: "July 2022 - May 2024",
    location: "St. Louis, MO",
    role: "Senior Software Engineer",
    bullets: [
      "Architected, developed, and productionized Intramotev's first and current software architecture while working with product stakeholders to solve cross-cutting problems and build architectural buy-in.",
      "Designed and implemented engineering solutions ranging from electrical boards to embedded vehicle control software, backend servers, and web and mobile applications.",
      "Designed and implemented Intramotev's vehicle user control system, including its user dashboard, manual control interface, route plan creator, and dispatcher.",
      "Created vehicle and software demos instrumental in securing $6.5 million in seed funding, $14.5 million in Series A funding, customer contracts, and letters of intent.",
      "Created a wireless peripheral control and communications system in C++ with embedded microprocessors and 900 MHz radio transceivers for material dumping and signaling systems.",
      "Implemented Intramotev's early vehicle vision safety system, deploying custom-trained neural network object detection models to an embedded vision microprocessor and integrating it into the vehicle architecture.",
    ],
  },
  {
    company: "Intramotev Inc",
    dates: "December 2021 - July 2022",
    location: "St. Louis, MO",
    role: "Software Engineer",
    bullets: [
      "Created Intramotev's first object detection neural network using transfer learning, semantic segmentation, TensorFlow, and a custom rail image dataset.",
      "Integrated neural networks and sensor hardware in embedded Linux devices for live perception demos.",
      "Integrated autonomous electric vehicle components into a working self-propelled railcar prototype.",
    ],
  },
  {
    company: "Lectro Engineering",
    dates: "February 2021 - December 2021",
    location: "St. Louis, MO",
    role: "Product Design Engineer",
    bullets: [
      "Designed and released new mechanical products in Lectro's factory automation portfolio including pick-and-place machines, sorters, and conveyance systems.",
      "Programmed PLCs to control factory automation robots.",
    ],
  },
  {
    company: "True Manufacturing",
    dates: "December 2019 - March 2020",
    location: "St. Louis, MO",
    role: "Robotics and Automation Engineering Co-op",
    bullets: [
      "Developed new hardware and software solutions to inefficiencies in the robotic manufacturing line.",
      "Wrote improved software to control Kuka and UR robots with C++.",
      "Modeled mechanical improvements to robot cells and end effectors with SolidWorks after identifying bottlenecks in manufacturing processes and predicting future points of failure.",
    ],
  },
];

const skillGroups = [
  { label: "Languages", skills: ["C#", "C++", "C", "Python", "TypeScript", "Java"] },
  { label: "Frontend", skills: ["React", "React Native", ".NET MAUI", "Blazor", "WPF"] },
  { label: "Backend", skills: ["ASP.NET", "Spring", "Express", "Django", "Flask", "Nginx"] },
  { label: "Cloud", skills: ["AWS", "Azure", "GCP", "Databricks", "Terraform", "Cloudflare", "AWS VPC"] },
  { label: "Persistence", skills: ["PostgreSQL", "MongoDB", "DynamoDB", "InfluxDB"] },
  { label: "Virtualization", skills: ["Proxmox", "ESXi", "Docker", "Kubernetes"] },
  { label: "Networking", skills: ["WebRTC", "RTSP", "gRPC", "WebSockets", "mTLS", "WireGuard"] },
  { label: "Protocols", skills: ["LoRa", "I2C", "SPI", "UART", "RS232/485", "CAN"] },
  { label: "Embedded", skills: ["NXP i.MX8", "STM32", "ESP32", "RPi", "Arduino"] },
  { label: "Real-Time", skills: ["FreeRTOS", "ROS2", "linux-rt", "DDS"] },
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
      bullets: [
        "Researched, developed, and deployed AI/ML Python deep learning algorithms for autonomous cars, agricultural robotics, security applications, and medical research.",
        "Integrated sensor components into an autonomous Toyota Avalon with C++, ROS, and the NVIDIA Drive SDK.",
      ],
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
            title="Experience. Skills. Education. All the good bits"
          >
            I deliver software across embedded C++ vehicle
            controls, automation robotics, user-facing applications, and
            scalable backend systems.
          </SectionHeading>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <a href="mailto:bauerlybriton6@gmail.com">
                <Mail />
                Contact
              </a>
            </Button>
            <Button asChild>
              <a
                href="/Briton_Bauerly_Q1_2026_Resume.pdf"
                download="Briton-Bauerly-Resume.pdf"
              >
                <Download />
                Resume/CV
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Experience</CardTitle>
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
                  <ul className="mt-3 list-disc space-y-2 pl-14 leading-7 text-muted-foreground">
                    {item.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {skillGroups.map((group) => (
                <div key={group.label}>
                  <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {group.label}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md border bg-background px-3 py-2 text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-4 rounded-lg">
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
                    <ul className="mt-3 list-disc space-y-2 pl-5 leading-7 text-muted-foreground">
                      {item.research.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </PageShell>
  );
}
