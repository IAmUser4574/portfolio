"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const splashPhrases = [
  { text: "Planes, Trains, and Automobiles", weight: 100 },
  { text: "The Social Network > The King's Speech", weight: 50 },
  { text: "It was his hat, Mr. Krabs. He was number one!", weight: 100 },
  { text: "Han shot first and Lucas covered it up", weight: 100 },
  { text: "AAAHHHH LET ME OUT OF HERE!!!!", weight: 5 },
  { text: "Played too much minecraft, now I have to make portfolios", weight: 5 },
];

function getNextSplashPhrase(currentPhrase: string) {
  const options = splashPhrases.filter((item) => item.text !== currentPhrase);

  if (options.length === 0) {
    return currentPhrase;
  }

  const totalWeight = options.reduce((total, item) => total + item.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const item of options) {
    roll -= item.weight;

    if (roll <= 0) {
      return item.text;
    }
  }

  return options[options.length - 1].text;
}

export function MinecraftName() {
  const [enabled, setEnabled] = useState(false);
  const [phrase, setPhrase] = useState(splashPhrases[0].text);

  useEffect(() => {
    function handleMinecraftChange(event: Event) {
      const nextEnabled = (event as CustomEvent<{ enabled: boolean }>).detail
        .enabled;

      if (nextEnabled) {
        setPhrase((currentPhrase) => getNextSplashPhrase(currentPhrase));
      }

      setEnabled(nextEnabled);
    }

    window.addEventListener("briton-minecraft-change", handleMinecraftChange);

    return () => {
      window.removeEventListener(
        "briton-minecraft-change",
        handleMinecraftChange,
      );
    };
  }, []);

  return (
    <div
      data-minecraft-root
      data-minecraft-mode={enabled ? "true" : "false"}
      className="mt-4 inline-flex flex-col items-center gap-4"
    >
      <div className="relative h-[8.5rem] w-[min(92vw,34rem)] sm:h-[10.5rem] sm:w-[min(84vw,42rem)] lg:h-[11rem] lg:w-[40rem]">
        <h1 aria-label="Briton" className="absolute inset-0">
          <span
            aria-hidden="true"
            className={cn(
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl font-semibold tracking-tight text-foreground transition-all duration-500 ease-out sm:text-8xl lg:text-9xl",
              enabled && "-translate-y-[45%] scale-95 opacity-0",
            )}
          >
            Briton
          </span>
          <span
            aria-hidden="true"
            className={cn(
              "absolute left-1/2 top-1/2 block w-full -translate-x-1/2 -translate-y-1/2 scale-95 opacity-0 transition-all duration-500 ease-out",
              enabled && "scale-100 opacity-100",
            )}
          >
            <Image
              src="/briton-minecraft-logo.png"
              alt=""
              aria-hidden="true"
              width={2073}
              height={758}
              priority
              className="h-auto w-full select-none"
            />
          </span>
        </h1>
        <span
          aria-hidden={!enabled}
          style={{ "--minecraft-splash-rotation": "-10deg" } as CSSProperties}
          className={cn(
            "pointer-events-none absolute right-0 bottom-8 origin-center rotate-[var(--minecraft-splash-rotation)] whitespace-nowrap font-mono text-xs font-black uppercase tracking-wide text-[#f7e64b] opacity-0 drop-shadow-[2px_2px_0_rgba(0,0,0,0.65)] transition-all duration-500 ease-out sm:-right-2 sm:bottom-10 sm:text-sm",
            enabled && "animate-minecraft-splash opacity-100",
          )}
        >
          {phrase}
        </span>
      </div>

      <details className="group ml-auto w-44 rounded-lg border bg-card/70 text-left opacity-0 shadow-sm transition-opacity duration-300 hover:opacity-100 focus-within:opacity-100 [&[open]]:opacity-100">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted/60 [&::-webkit-details-marker]:hidden">
          Fun Zone
          <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
        </summary>
        <div className="flex justify-end border-t px-4 py-3">
          <button
            type="button"
            data-minecraft-toggle
            aria-pressed={enabled}
            className={cn(
              buttonVariants({
                variant: enabled ? "default" : "outline",
                size: "sm",
              }),
              "touch-manipulation",
            )}
          >
            {enabled ? "Boring Mode" : "Minecraft Mode"}
          </button>
        </div>
      </details>
    </div>
  );
}
