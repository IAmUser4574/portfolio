"use client";

import { useEffect, useRef, useState } from "react";

import type { ReactNode } from "react";

import { Name } from "@/components/name";
import { cn } from "@/lib/utils";

type HomeIntroProps = {
  children?: ReactNode;
};

type IntroPhase = "idle" | "hi" | "greeting" | "name" | "done";

let hasPlayedHomeIntro = false;

function didDocumentLoadHome() {
  const navigation = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  const documentUrl = new URL(navigation?.name ?? window.location.href);

  return (
    documentUrl.origin === window.location.origin && documentUrl.pathname === "/"
  );
}

export function HomeIntro({ children }: HomeIntroProps) {
  const [introPhase, setIntroPhase] = useState<IntroPhase>(() =>
    hasPlayedHomeIntro ||
    (typeof window !== "undefined" && !didDocumentLoadHome())
      ? "done"
      : "idle",
  );

  const hasHi = introPhase !== "idle";
  const hasGreeting = introPhase === "greeting" || introPhase === "name" || introPhase === "done";
  const hasName = introPhase === "name" || introPhase === "done";
  const hasContent = introPhase === "done";
  const shouldRunIntro = useRef(introPhase === "idle");

  useEffect(() => {
    if (!shouldRunIntro.current) {
      return;
    }

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      hasPlayedHomeIntro ||
      !didDocumentLoadHome()
    ) {
      const frame = requestAnimationFrame(() => setIntroPhase("done"));

      return () => cancelAnimationFrame(frame);
    }

    const frame = requestAnimationFrame(() => {
      hasPlayedHomeIntro = true;
      setIntroPhase("hi");
    });
    const greetingTimer = window.setTimeout(() => setIntroPhase("greeting"), 650);
    const nameTimer = window.setTimeout(() => setIntroPhase("name"), 650);
    const contentTimer = window.setTimeout(() => setIntroPhase("done"), 1550);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(greetingTimer);
      window.clearTimeout(nameTimer);
      window.clearTimeout(contentTimer);
    };
  }, []);

  return (
    <>
      <p
        className={cn(
          "inline-flex justify-center overflow-hidden font-mono text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none",
          hasHi ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
        )}
      >
        <span>Hi</span>
        <span
          className={cn(
            "inline-block whitespace-nowrap transition-[max-width,opacity] duration-500 ease-out motion-reduce:max-w-none motion-reduce:opacity-100 motion-reduce:transition-none",
            hasGreeting ? "max-w-24 opacity-100" : "max-w-0 opacity-0",
          )}
        >
          , I'm
        </span>
      </p>
      <Name introStarted={hasName} />
      <div
        className={cn(
          "flex w-full flex-col items-center transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none",
          hasContent ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
        )}
      >
        {children}
      </div>
    </>
  );
}
