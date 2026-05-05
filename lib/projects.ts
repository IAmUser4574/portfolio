export type Project = {
  title: string;
  description: string;
  stack: string[];
  blogTag: string;
};

export const projects: Project[] = [
  {
    title: "Collectr",
    description:
      "A collection-management product surface for tracking items, signals, and ownership details across web and mobile.",
    stack: ["Next.js", "Expo", "TypeScript", "Postgres"],
    blogTag: "collectr",
  },
  {
    title: "Coin Vault",
    description:
      "A focused vault-style experience for cataloging coins, organizing inventory, and keeping collection context close.",
    stack: ["React", "API design", "Prisma", "Tailwind"],
    blogTag: "coin-vault",
  },
  {
    title: "Briton Homebase",
    description:
      "This portfolio system: four clear entry points, MDX writing, internal routes, and a maintainable design foundation.",
    stack: ["Next.js", "MDX", "shadcn/ui", "Tailwind"],
    blogTag: "homebase",
  },
];

export function getProjectBlogTags() {
  return projects.map((project) => project.blogTag);
}
