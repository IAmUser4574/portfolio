import { getMdxCollection } from "@/lib/mdx-collection";

export type ProjectMetadata = {
  title: string;
  description: string;
  publishedAt: string;
  stack: string[];
  blogTag: string;
};

export type Project = ProjectMetadata & {
  slug: string;
  Component: React.ComponentType;
};

export type ProjectSummary = Omit<Project, "Component">;

export async function getProjects() {
  const projects = await getMdxCollection<ProjectMetadata>("projects");

  return projects.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function getProject(slug: string) {
  return (await getProjects()).find((project) => project.slug === slug);
}

export async function getProjectSummaries(): Promise<ProjectSummary[]> {
  return (await getProjects()).map((project) => ({
    slug: project.slug,
    title: project.title,
    description: project.description,
    publishedAt: project.publishedAt,
    stack: project.stack,
    blogTag: project.blogTag,
  }));
}

export async function getProjectBlogTags() {
  return (await getProjects()).map((project) => project.blogTag);
}
