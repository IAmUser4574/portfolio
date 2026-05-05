"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

import GlitchText from "@/components/react-bits/glitch-text";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const splashPhrases = [
  { text: "Planes, Trains, and Automobiles", weight: 100 },
  { text: "The Social Network > The King's Speech", weight: 50 },
  { text: "It was his hat, Mr. Krabs. He was number one!", weight: 100 },
  { text: "Han shot first and Lucas covered it up", weight: 100 },
  { text: "AAAHHHH LET ME OUT OF HERE!!!!", weight: 5 },
  { text: "Played too much minecraft, now I have to make portfolios", weight: 5 },
];

type FunMode = "normal" | "minecraft" | "nerd";

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

export function Name() {
  const [mode, setMode] = useState<FunMode>("normal");
  const [phrase, setPhrase] = useState(splashPhrases[0].text);

  const isMinecraftMode = mode === "minecraft";
  const isNerdMode = mode === "nerd";

  function setMinecraftMode(checked: boolean) {
    if (checked) {
      setPhrase((currentPhrase) => getNextSplashPhrase(currentPhrase));
      setMode("minecraft");
      return;
    }

    if (mode === "minecraft") {
      setMode("normal");
    }
  }

  function setNerdMode(checked: boolean) {
    if (checked) {
      setMode("nerd");
      return;
    }

    if (mode === "nerd") {
      setMode("normal");
    }
  }

  return (
    <div
      className="mt-4 inline-flex flex-col items-center gap-4"
    >
      <div
        tabIndex={0}
        className="group/name relative h-[8.5rem] w-[min(92vw,34rem)] outline-none sm:h-[10.5rem] sm:w-[min(84vw,42rem)] lg:h-[11rem] lg:w-[40rem]"
      >
        <h1 aria-label="Briton" className="absolute inset-0">
          <span
            aria-hidden="true"
            className={cn(
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl font-semibold tracking-tight text-foreground transition-all duration-500 ease-out sm:text-8xl lg:text-9xl",
              mode !== "normal" && "-translate-y-[45%] scale-95 opacity-0",
            )}
          >
            Briton
          </span>
          <span
            aria-hidden="true"
            className={cn(
              "absolute left-1/2 top-1/2 block w-full -translate-x-1/2 -translate-y-1/2 scale-95 opacity-0 transition-all duration-500 ease-out",
              isMinecraftMode && "scale-100 opacity-100",
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
          <div
            aria-hidden="true"
            className={cn(
              "absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-500 ease-out",
              isNerdMode && "opacity-100",
            )}
          >
            <GlitchText
              speed={0.85}
              enableShadows
              enableOnHover={false}
              className="text-7xl sm:text-8xl lg:text-9xl"
            >
              Briton
            </GlitchText>
          </div>
        </h1>
        <span
          aria-hidden={!isMinecraftMode}
          style={{ "--minecraft-splash-rotation": "-10deg" } as CSSProperties}
          className={cn(
            "pointer-events-none absolute right-0 bottom-8 origin-center rotate-[var(--minecraft-splash-rotation)] whitespace-nowrap font-mono text-xs font-black uppercase tracking-wide text-[#f7e64b] opacity-0 drop-shadow-[2px_2px_0_rgba(0,0,0,0.65)] transition-all duration-500 ease-out sm:-right-2 sm:bottom-10 sm:text-sm",
            isMinecraftMode && "animate-minecraft-splash opacity-100",
          )}
        >
          {phrase}
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-4 right-0 rounded-md border bg-card/90 px-3 py-1.5 text-right font-mono text-xs text-muted-foreground opacity-0 shadow-sm backdrop-blur transition-all duration-300 group-hover/name:opacity-100 group-focus/name:opacity-100 sm:bottom-6"
        >
          pronounced braɪtən (BRY-tuhn)
        </span>
      </div>

      <details className="group ml-auto w-44 rounded-lg border bg-card/70 text-left opacity-0 shadow-sm transition-opacity duration-300 hover:opacity-100 focus-within:opacity-100 [&[open]]:opacity-100">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted/60 [&::-webkit-details-marker]:hidden">
          Fun Zone
          <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
        </summary>
        <div className="grid gap-3 border-t px-4 py-3">
          <label className="flex items-center justify-between gap-3 text-sm">
            <span>Minecraft</span>
            <Switch
              checked={isMinecraftMode}
              onCheckedChange={setMinecraftMode}
              aria-label="Toggle Minecraft Mode"
            />
          </label>
          <label className="flex items-center justify-between gap-3 text-sm">
            <span>Nerd</span>
            <Switch
              checked={isNerdMode}
              onCheckedChange={setNerdMode}
              aria-label="Toggle Nerd Mode"
            />
          </label>
          <p className="text-right text-xs text-muted-foreground">
            Current: {mode === "normal" ? "Normal" : mode}
          </p>
        </div>
      </details>
    </div>
  );
}
