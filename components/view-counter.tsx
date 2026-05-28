"use client";

import { useEffect, useState } from "react";
import { Eye, Users } from "lucide-react";

type Counts = { views: number; unique: number };

export function ViewCounter({ slug }: { slug: string }) {
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then(setCounts)
      .catch((err) => {
        if (err.name !== "AbortError") console.error("[view-counter]", err);
      });

    return () => controller.abort();
  }, [slug]);

  if (!counts) return null;

  return (
    <span className="flex items-center gap-4">
      <span className="flex items-center gap-1.5" title="total views">
        <Eye className="h-3.5 w-3.5" aria-hidden="true" />
        {counts.views.toLocaleString()}
      </span>
      <span className="flex items-center gap-1.5" title="unique visitors today">
        <Users className="h-3.5 w-3.5" aria-hidden="true" />
        {counts.unique.toLocaleString()}
      </span>
    </span>
  );
}
