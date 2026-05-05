"use client";

import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

type GlitchTextProps = {
  children: string;
  speed?: number;
  enableShadows?: boolean;
  enableOnHover?: boolean;
  className?: string;
};

type GlitchTextStyles = CSSProperties & {
  "--after-duration": string;
  "--before-duration": string;
  "--after-shadow": string;
  "--before-shadow": string;
};

export default function GlitchText({
  children,
  speed = 1,
  enableShadows = true,
  enableOnHover = true,
  className = "",
}: GlitchTextProps): ReactNode {
  const inlineStyles: GlitchTextStyles = {
    "--after-duration": `${speed * 3}s`,
    "--before-duration": `${speed * 2}s`,
    "--after-shadow": enableShadows ? "-5px 0 red" : "none",
    "--before-shadow": enableShadows ? "5px 0 cyan" : "none",
  };

  return (
    <div
      className={cn("glitch", enableOnHover && "enable-on-hover", className)}
      style={inlineStyles}
      data-text={children}
    >
      {children}
    </div>
  );
}
