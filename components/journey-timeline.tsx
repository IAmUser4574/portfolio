"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";

export type JourneyEvent = {
  dateLabel: string;
  dateValue: number;
  description: string;
  direction: "down" | "up";
  kind: "Career" | "Personal";
  title: string;
};

type JourneyTimelineProps = {
  events: JourneyEvent[];
};

type PlacedJourneyEvent = JourneyEvent & {
  laneOffset: number;
  position: number;
};

type TimelineDateLabel = {
  laneOffset: number;
  label: string;
  position: number;
  side: "above" | "below";
};

function getPosition(dateValue: number, minDate: number, maxDate: number) {
  if (minDate === maxDate) {
    return 50;
  }

  return ((dateValue - minDate) / (maxDate - minDate)) * 100;
}

function getLaneOffset(
  event: JourneyEvent,
  events: JourneyEvent[],
  index: number,
  minDate: number,
  maxDate: number,
) {
  const position = getPosition(event.dateValue, minDate, maxDate);
  const nearbyPreviousCount = events
    .slice(0, index)
    .filter(
      (previousEvent) =>
        previousEvent.direction === event.direction &&
        Math.abs(getPosition(previousEvent.dateValue, minDate, maxDate) - position) < 8,
    ).length;

  return nearbyPreviousCount % 2;
}

export function JourneyTimeline({ events }: JourneyTimelineProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const placedEvents = useMemo<PlacedJourneyEvent[]>(() => {
    const dateValues = events.map((event) => event.dateValue);
    const minDate = Math.min(...dateValues);
    const maxDate = Math.max(...dateValues);

    return events.map((event, index) => ({
      ...event,
      laneOffset: getLaneOffset(event, events, index, minDate, maxDate),
      position: getPosition(event.dateValue, minDate, maxDate),
    }));
  }, [events]);

  const dateLabels = useMemo<TimelineDateLabel[]>(() => {
    const labels = new Map<string, PlacedJourneyEvent[]>();

    placedEvents.forEach((event) => {
      labels.set(event.dateLabel, [
        ...(labels.get(event.dateLabel) ?? []),
        event,
      ]);
    });

    return Array.from(labels.entries()).map(([label, labelEvents], index, groupedLabels) => {
      const positions = labelEvents.map((event) => event.position);
      const position =
        positions.reduce((total, eventPosition) => total + eventPosition, 0) /
        positions.length;
      const nearbyEvents = placedEvents.filter(
        (event) => Math.abs(event.position - position) < 7,
      );
      const nearbyUpCount = nearbyEvents.filter(
        (event) => event.direction === "up",
      ).length;
      const nearbyDownCount = nearbyEvents.length - nearbyUpCount;
      const side = nearbyDownCount >= nearbyUpCount ? "above" : "below";
      const nearbyPreviousCount = groupedLabels
        .slice(0, index)
        .filter(([, previousEvents]) => {
          const previousUpCount = previousEvents.filter(
            (event) => event.direction === "up",
          ).length;
          const previousSide =
            previousUpCount >= previousEvents.length - previousUpCount
              ? "below"
              : "above";
          const previousPositions = previousEvents.map((event) => event.position);
          const previousPosition =
            previousPositions.reduce(
              (total, eventPosition) => total + eventPosition,
              0,
            ) / previousPositions.length;

          return previousSide === side && Math.abs(previousPosition - position) < 7;
        }).length;

      return {
        laneOffset: nearbyPreviousCount % 2,
        label,
        position,
        side,
      };
    });
  }, [placedEvents]);

  return (
    <div className="mt-10 overflow-x-auto overflow-y-visible pb-16">
      <div className="relative h-[42rem] min-w-[72rem] px-36">
        <div className="absolute left-36 right-36 top-1/2 h-px -translate-y-1/2 bg-border" />

        <div className="absolute left-36 right-36 top-1/2">
          {dateLabels.map((dateLabel) => (
            <span
              key={dateLabel.label}
              className={cn(
                "absolute left-0 z-10 w-24 -translate-x-1/2 bg-card py-1 text-center font-mono text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground",
                dateLabel.side === "below"
                  ? dateLabel.laneOffset === 1
                    ? "top-10"
                    : "top-3"
                  : dateLabel.laneOffset === 1
                    ? "-top-16"
                    : "-top-9",
              )}
              style={{ left: `${dateLabel.position}%` } as CSSProperties}
            >
              {dateLabel.label}
            </span>
          ))}

          {placedEvents.map((event, index) => {
            const active = activeIndex === index;
            const goesUp = event.direction === "up";
            const spurClassName = event.laneOffset === 1 ? "h-28" : "h-16";
            const labelClassName = goesUp
              ? event.laneOffset === 1
                ? "bottom-32"
                : "bottom-20"
              : event.laneOffset === 1
                ? "top-32"
                : "top-20";
            const panelClassName = goesUp
              ? event.laneOffset === 1
                ? "bottom-40"
                : "bottom-28"
              : event.laneOffset === 1
                ? "top-40"
                : "top-28";

            return (
              <div
                key={`${event.dateLabel}-${event.title}`}
                className="absolute top-0"
                style={{ left: `${event.position}%` } as CSSProperties}
              >
                <span className="absolute left-1/2 top-0 z-10 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-card" />
                <span
                  className={cn(
                    "absolute left-1/2 w-px -translate-x-1/2 bg-border",
                    spurClassName,
                    goesUp ? "bottom-0" : "top-0",
                  )}
                />
                <button
                  type="button"
                  aria-expanded={active}
                  onBlur={() => setActiveIndex(null)}
                  onClick={() => setActiveIndex(active ? null : index)}
                  onFocus={() => setActiveIndex(index)}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  className={cn(
                    "absolute left-1/2 w-36 -translate-x-1/2 text-center text-sm font-semibold text-foreground underline-offset-4 transition hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/30",
                    labelClassName,
                    active && "text-primary",
                  )}
                >
                  {event.title}
                </button>
                <div
                  className={cn(
                    "absolute left-1/2 z-20 w-60 -translate-x-1/2 rounded-lg border bg-background p-4 text-left shadow-lg transition-all duration-200",
                    panelClassName,
                    active
                      ? "translate-y-0 opacity-100"
                      : cn(
                          "pointer-events-none opacity-0",
                          goesUp ? "translate-y-2" : "-translate-y-2",
                        ),
                  )}
                >
                  <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {event.kind} / {event.dateLabel}
                  </p>
                  <h4 className="mt-2 text-base font-semibold text-foreground">
                    {event.title}
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {event.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
