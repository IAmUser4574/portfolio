import { Home } from "lucide-react";
import Link from "next/link";

import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <PageShell>
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-3xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
        <p className="font-mono text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          404
        </p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">
          Page not found
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
          This route does not exist, or it moved while nobody was looking.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/">
            <Home />
            Back home
          </Link>
        </Button>
      </section>
    </PageShell>
  );
}
