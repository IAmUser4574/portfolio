import type { Heading } from "@/lib/heading-utils";

import { TocActiveTracker } from "@/components/toc-active-tracker";

type TableOfContentsProps = {
  headings: Heading[];
};

// server component — renders immediately in SSR HTML
export function TableOfContents({ headings }: TableOfContentsProps) {
  if (!headings.length) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="mb-10 w-fit rounded-lg border border-border bg-card px-6 py-4"
    >
      <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        Contents
      </p>
      <ul className="space-y-2">
        {headings.map(({ text, slug, level }) => (
          <li key={slug} className={level === 3 ? "pl-4" : undefined}>
            <a
              href={`#${slug}`}
              data-toc-slug={slug}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
      <TocActiveTracker slugs={headings.map((h) => h.slug)} />
    </nav>
  );
}
