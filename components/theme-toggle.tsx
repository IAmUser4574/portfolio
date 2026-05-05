"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Theme = "dark" | "light";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    function handleThemeChange(event: Event) {
      const nextTheme = (event as CustomEvent<{ theme: Theme }>).detail.theme;
      setTheme(nextTheme);
    }

    window.addEventListener("briton-theme-change", handleThemeChange);

    return () => {
      window.removeEventListener("briton-theme-change", handleThemeChange);
    };
  }, []);

  return (
    <button
      type="button"
      data-theme-toggle
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "touch-manipulation")}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </button>
  );
}
