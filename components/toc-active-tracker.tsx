"use client";

import { useEffect } from "react";

type TocActiveTrackerProps = {
  slugs: string[];
};

// adds/removes "text-foreground" on toc links as headings enter the viewport
export function TocActiveTracker({ slugs }: TocActiveTrackerProps) {
  useEffect(() => {
    const links = new Map<string, HTMLElement>();
    for (const slug of slugs) {
      const el = document.querySelector<HTMLElement>(`[data-toc-slug="${slug}"]`);
      if (el) links.set(slug, el);
    }

    const targets = slugs
      .map((slug) => document.getElementById(slug))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const link = links.get(entry.target.id);
          if (!link) continue;
          if (entry.isIntersecting) {
            link.classList.remove("text-muted-foreground");
            link.classList.add("text-foreground");
          } else {
            link.classList.remove("text-foreground");
            link.classList.add("text-muted-foreground");
          }
        }
      },
      { rootMargin: "0px 0px -60% 0px", threshold: 0 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [slugs]);

  return null;
}
