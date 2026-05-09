"use client";

import type { CSSProperties, FocusEvent } from "react";
import { useState } from "react";
import Image from "next/image";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const splashPhrases = [
  { text: "Planes, Trains, and Automobiles", weight: 100 },
  { text: "It was his hat, Mr. Krabs. He was number one!", weight: 100 },
  { text: "Han shot first and Lucas covered it up", weight: 100 },
  { text: "The Social Network > The King's Speech", weight: 50 },
  { text: "While my keyboard gently weeps", weight: 50 },
  { text: "Remember KONY 2012? Whatever happened to that...", weight: 50 },
  { text: "AAAHHHH LET ME OUT OF HERE!!!!", weight: 5 },
  { text: "Played too much minecraft, now I have to make portfolios", weight: 5 },
];

type FunMode = "normal" | "minecraft";

type NameProps = {
  introStarted?: boolean;
};

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

export function Name({ introStarted = true }: NameProps) {
  const [mode, setMode] = useState<FunMode>("normal");
  const [phrase, setPhrase] = useState(splashPhrases[0].text);
  const [isFunZoneVisible, setIsFunZoneVisible] = useState(false);

  const isMinecraftMode = mode === "minecraft";

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

  function handleFunZoneBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsFunZoneVisible(false);
    }
  }

  const funZoneWrapperClassName = cn(
    "ml-auto w-48 rounded-2xl opacity-0 transition-opacity duration-300 hover:opacity-100 focus:opacity-100 focus-within:opacity-100",
    isFunZoneVisible && "opacity-100",
  );

  const funZoneInteractionProps = {
    onBlurCapture: handleFunZoneBlur,
    onFocusCapture: () => setIsFunZoneVisible(true),
    onPointerDown: () => setIsFunZoneVisible(true),
    tabIndex: 0,
  };

  const funZoneControls = (
    <fieldset className="rounded-[inherit] border bg-card/80 px-4 pb-3 pt-2 text-left shadow-sm backdrop-blur">
      <legend className="px-1 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Fun Zone
      </legend>
      <div className="grid gap-3">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span>Minecraft</span>
          <Switch
            checked={isMinecraftMode}
            onCheckedChange={setMinecraftMode}
            aria-label="Toggle Minecraft Mode"
          />
        </label>
        <p className="text-right text-xs text-muted-foreground">
          Current: {mode === "normal" ? "Normal" : mode}
        </p>
      </div>
    </fieldset>
  );

  return (
    <div
      className="mt-4 inline-flex flex-col items-center gap-4"
    >
      <div
        tabIndex={0}
        className="group/name relative h-[8.5rem] w-[min(92vw,34rem)] outline-none sm:h-[10.5rem] sm:w-[min(84vw,42rem)] lg:h-[11rem] lg:w-[40rem]"
      >
        <h1
          aria-label="Briton"
          className={cn(
            "absolute inset-0 transition-all delay-500 duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:blur-none motion-reduce:transition-none",
            introStarted
              ? "translate-y-0 scale-100 opacity-100 blur-none"
              : "translate-y-5 scale-[0.96] opacity-0 blur-md",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "absolute left-1/2 top-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 items-center text-7xl font-semibold tracking-tight text-foreground transition-all duration-500 ease-out sm:text-8xl lg:text-9xl",
              mode !== "normal" && "-translate-y-[45%] scale-95 opacity-0",
            )}
          >
            <span>BRIT</span>
            <span
              className="relative mx-[0.00em] inline-block h-[0.9em] w-[0.82em] align-middle"
            >
              <span className="hero-text-o absolute inset-0 flex items-center justify-center">
                O
              </span>
              <span className="hero-favicon-o absolute inset-0 block bg-[url('/briton-icon.png')] bg-contain bg-center bg-no-repeat" />
            </span>
            <span>N</span>
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
          className={cn(
            "pointer-events-none absolute bottom-4 right-0 rounded-md border bg-card/90 px-3 py-1.5 text-right font-mono text-xs text-muted-foreground opacity-0 shadow-sm backdrop-blur transition-all duration-300 sm:bottom-6",
            introStarted &&
              "group-hover/name:opacity-100 group-focus/name:opacity-100",
          )}
        >
          pronounced braɪtən (BRY-tuhn)
        </span>
      </div>

      <div className={funZoneWrapperClassName} {...funZoneInteractionProps}>
        {funZoneControls}
      </div>
    </div>
  );
}
