import type { ComponentType } from "react";

import BamlProject, {
  metadata as bamlProjectMetadata,
} from "@/content/projects/baml.mdx";
import BritonHomebaseProject, {
  metadata as britonHomebaseProjectMetadata,
} from "@/content/projects/briton-homebase.mdx";
import CoinVaultProject, {
  metadata as coinVaultProjectMetadata,
} from "@/content/projects/coin-vault.mdx";
import CouncilProject, {
  metadata as councilProjectMetadata,
} from "@/content/projects/council.mdx";
import HostageNegotiatorProject, {
  metadata as hostageNegotiatorProjectMetadata,
} from "@/content/projects/hostage-negotiator.mdx";
import SystemUnderDesignProject, {
  metadata as systemUnderDesignProjectMetadata,
} from "@/content/projects/system-under-design.mdx";
import BuildingAHomebasePost, {
  metadata as buildingAHomebasePostMetadata,
} from "@/content/blog/building-a-homebase.mdx";
import { isPublishedMdxItem } from "@/lib/mdx-utils";

export type MdxCollectionItem<Metadata> = Metadata & {
  slug: string;
  Component: ComponentType;
};

type MdxCollectionKey = "blog" | "projects";

type MdxRegistryItem = {
  slug: string;
  Component: ComponentType;
  metadata: unknown;
};

const mdxRegistry = {
  blog: [
    {
      slug: "building-a-homebase",
      Component: BuildingAHomebasePost,
      metadata: buildingAHomebasePostMetadata,
    },
  ],
  projects: [
    {
      slug: "baml",
      Component: BamlProject,
      metadata: bamlProjectMetadata,
    },
    {
      slug: "briton-homebase",
      Component: BritonHomebaseProject,
      metadata: britonHomebaseProjectMetadata,
    },
    {
      slug: "coin-vault",
      Component: CoinVaultProject,
      metadata: coinVaultProjectMetadata,
    },
    {
      slug: "council",
      Component: CouncilProject,
      metadata: councilProjectMetadata,
    },
    {
      slug: "hostage-negotiator",
      Component: HostageNegotiatorProject,
      metadata: hostageNegotiatorProjectMetadata,
    },
    {
      slug: "system-under-design",
      Component: SystemUnderDesignProject,
      metadata: systemUnderDesignProjectMetadata,
    },
  ],
} satisfies Record<MdxCollectionKey, MdxRegistryItem[]>;

export async function getMdxCollection<Metadata>(
  contentDirectory: MdxCollectionKey,
): Promise<MdxCollectionItem<Metadata>[]> {
  const items = mdxRegistry[contentDirectory].map((item) => ({
    slug: item.slug,
    Component: item.Component,
    ...(item.metadata as Metadata),
  }));

  return items.filter(isPublishedMdxItem);
}
