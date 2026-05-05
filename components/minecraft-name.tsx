"use client";

import type { CSSProperties } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const splashPhrases = [
  { text: "Planes, Trains, and Automobiles", weight: 100 },
  { text: "Batteries not included!", weight: 100 },
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

  function toggleMinecraftMode() {
    if (!enabled) {
      setPhrase((currentPhrase) => getNextSplashPhrase(currentPhrase));
    }

    setEnabled((current) => !current);
  }

  return (
    <div className="mt-4 inline-flex flex-col items-start gap-4">
      <div className="relative inline-block pr-8">
        <h1
          className={cn(
            "text-6xl font-semibold tracking-tight text-foreground transition-all duration-300 sm:text-7xl lg:text-8xl",
            enabled &&
              "font-black uppercase tracking-wider text-[#d9d9d9] [text-shadow:0_4px_0_#6b6b6b,0_8px_0_#2f2f2f,4px_4px_0_#ffffff,-4px_4px_0_#8b8b8b]",
          )}
        >
          Briton
        </h1>
        <span
          aria-hidden={!enabled}
          style={{ "--minecraft-splash-rotation": "-10deg" } as CSSProperties}
          className={cn(
            "pointer-events-none absolute -right-4 bottom-2 origin-center rotate-[var(--minecraft-splash-rotation)] whitespace-nowrap font-mono text-xs font-black uppercase tracking-wide text-[#f7e64b] opacity-0 drop-shadow-[2px_2px_0_rgba(0,0,0,0.65)] transition-opacity sm:-right-10 sm:bottom-4 sm:text-sm",
            enabled && "animate-minecraft-splash opacity-100",
          )}
        >
          {phrase}
        </span>
      </div>

      <Button
        type="button"
        variant={enabled ? "default" : "outline"}
        size="sm"
        aria-pressed={enabled}
        onClick={toggleMinecraftMode}
      >
        Minecraft Mode
      </Button>
    </div>
  );
}
