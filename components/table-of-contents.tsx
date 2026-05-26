import { ChevronDown } from "lucide-react";
import type { Heading } from "@/lib/heading-utils";
import { TocActiveTracker } from "@/components/toc-active-tracker";

type TableOfContentsProps = {
  headings: Heading[];
};

// server component — renders immediately in SSR HTML
export function TableOfContents({ headings }: TableOfContentsProps) {
  if (!headings.length) return null;

  return (
    <details
      open
      className="group mb-10 w-fit rounded-lg border border-border bg-card"
    >
      <summary className="flex cursor-pointer list-none items-center gap-6 px-6 py-4 [&::-webkit-details-marker]:hidden">
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Contents
        </span>
        <ChevronDown className="size-3.5 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <nav aria-label="Table of contents" className="px-6 pb-4">
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
      </nav>
      <TocActiveTracker slugs={headings.map((h) => h.slug)} />
    </details>
  );
}
