import { Mail } from "lucide-react";
import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";

import { NewsletterSignupForm } from "@/components/newsletter-signup-form";
import { Button } from "@/components/ui/button";

const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/briton-bauerly/", icon: FaLinkedin },
  { label: "GitHub", href: "https://github.com/IAmUser4574/", icon: FaGithub },
  { label: "Email", href: "mailto:bauerlybriton6@gmail.com", icon: Mail },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <Link href="/" className="font-mono text-sm font-semibold tracking-[0.18em]">
            BRITON
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Briton Bauerly.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Button key={link.label} asChild variant="ghost" size="sm">
                <a href={link.href} target="_blank" rel="noreferrer" aria-label={link.label}>
                  <Icon className="size-5" />
                </a>
              </Button>
            );
          })}
        </div>

        <NewsletterSignupForm variant="compact" className="w-full sm:w-auto sm:max-w-sm" />
      </div>
      <div className="border-t px-4 py-2 text-right font-mono text-[10px] text-muted-foreground/40 sm:px-6">
        built {process.env.NEXT_PUBLIC_BUILD_TIME}
      </div>
    </footer>
  );
}
