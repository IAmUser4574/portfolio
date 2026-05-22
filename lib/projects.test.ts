import { describe, expect, it, vi } from "vitest";

import type { MdxCollectionItem } from "@/lib/mdx-collection";
import type { ProjectMetadata } from "@/lib/projects";

vi.mock("@/lib/mdx-collection");

import { getMdxCollection } from "@/lib/mdx-collection";
import { getProject, getProjectBlogTags, getProjectSummaries, getProjects } from "@/lib/projects";

const mockGetMdxCollection = vi.mocked(getMdxCollection);

const makeProject = (
  overrides: Partial<ProjectMetadata & { slug: string }> = {},
): MdxCollectionItem<ProjectMetadata> => ({
  slug: "my-project",
  Component: () => null,
  title: "My Project",
  description: "A project",
  publishedAt: "2024-06-01",
  stack: [],
  ...overrides,
});

describe("getProjects", () => {
  it("sorts projects newest first", async () => {
    mockGetMdxCollection.mockResolvedValue([
      makeProject({ slug: "older", publishedAt: "2023-01-01" }),
      makeProject({ slug: "newer", publishedAt: "2024-06-01" }),
    ]);
    const projects = await getProjects();
    expect(projects[0].slug).toBe("newer");
    expect(projects[1].slug).toBe("older");
  });

  it("returns slugs suitable for generateStaticParams", async () => {
    mockGetMdxCollection.mockResolvedValue([
      makeProject({ slug: "proj-a" }),
      makeProject({ slug: "proj-b" }),
    ]);
    const params = (await getProjects()).map((p) => ({ slug: p.slug }));
    expect(params).toEqual([{ slug: "proj-a" }, { slug: "proj-b" }]);
  });
});

describe("getProject", () => {
  it("finds a project by slug", async () => {
    mockGetMdxCollection.mockResolvedValue([
      makeProject({ slug: "target", title: "Target Project" }),
      makeProject({ slug: "other" }),
    ]);
    const project = await getProject("target");
    expect(project?.title).toBe("Target Project");
  });

  it("returns undefined for an unknown slug", async () => {
    mockGetMdxCollection.mockResolvedValue([makeProject({ slug: "existing" })]);
    expect(await getProject("missing")).toBeUndefined();
  });
});

describe("getProjectSummaries", () => {
  it("omits Component from summaries", async () => {
    mockGetMdxCollection.mockResolvedValue([makeProject()]);
    const [summary] = await getProjectSummaries();
    expect(summary).not.toHaveProperty("Component");
  });

  it("includes expected fields", async () => {
    mockGetMdxCollection.mockResolvedValue([
      makeProject({ slug: "s", title: "T", description: "D", stack: ["next"] }),
    ]);
    const [summary] = await getProjectSummaries();
    expect(summary).toMatchObject({ slug: "s", title: "T", description: "D", stack: ["next"] });
  });
});

describe("getProjectBlogTags", () => {
  it("returns only projects that have a blogTag", async () => {
    mockGetMdxCollection.mockResolvedValue([
      makeProject({ blogTag: "rust" }),
      makeProject({ blogTag: undefined }),
      makeProject({ blogTag: "next" }),
    ]);
    const tags = await getProjectBlogTags();
    expect(tags).toEqual(["rust", "next"]);
  });
});
