"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SkillGroup = {
  label: string;
  skills: string[];
};

type CvSkillsProps = {
  groups: SkillGroup[];
};

export function CvSkills({ groups }: CvSkillsProps) {
  const [openGroup, setOpenGroup] = useState<string | null>("Languages");

  return (
    <div className="space-y-2">
      {groups.map((group) => {
        const isOpen = openGroup === group.label;
        const panelId = `skill-group-${group.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

        return (
          <div key={group.label} className="rounded-md border bg-background">
            <Button
              type="button"
              variant="ghost"
              className="h-auto w-full justify-between px-3 py-3 text-left"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenGroup(isOpen ? null : group.label)}
            >
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {group.label}
              </span>
              <ChevronDown
                className={cn(
                  "size-4 text-muted-foreground transition-transform",
                  isOpen && "rotate-180",
                )}
              />
            </Button>
            <div
              id={panelId}
              hidden={!isOpen}
              className="border-t px-3 pb-3 pt-2"
            >
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md border bg-card px-3 py-2 text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
