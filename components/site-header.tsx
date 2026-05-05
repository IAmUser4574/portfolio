import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/#about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/cv", label: "CV" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-mono text-sm font-semibold tracking-[0.18em]">
          BRITON
        </Link>
        <div className="flex items-center gap-1">
          <nav className="flex items-center gap-1">
            {links.map((link) => (
              <Button key={link.href} asChild variant="ghost" size="sm">
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
