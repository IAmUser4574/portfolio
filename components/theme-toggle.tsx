"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Theme = "dark" | "light";
const themeStorageKey = "briton-theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
      setMounted(true);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  function applyTheme(nextTheme: Theme) {
    const isDark = nextTheme === "dark";

    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    window.localStorage.setItem(themeStorageKey, nextTheme);
    setTheme(nextTheme);
  }

  function toggleTheme() {
    applyTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <button
      type="button"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "touch-manipulation")}
      onClick={toggleTheme}
    >
      {mounted && theme === "light" ? <Moon /> : <Sun />}
    </button>
  );
}
