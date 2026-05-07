"use client";

import type { CSSProperties } from "react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

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

type PopupPosition = {
  left: number;
  top: number;
  visibility: "hidden" | "visible";
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

function getPopupPosition(
  element: HTMLElement,
  direction: JourneyEvent["direction"],
  popupSize = { height: 0, width: 240 },
): PopupPosition {
  const rect = element.getBoundingClientRect();
  const margin = 16;
  const gap = 10;
  const centerX = rect.left + rect.width / 2;
  const popupHeight = popupSize.height || 180;
  const popupWidth = popupSize.width || 240;

  return {
    left: Math.min(
      window.innerWidth - popupWidth - margin,
      Math.max(margin, centerX - popupWidth / 2),
    ),
    top:
      direction === "up"
        ? Math.max(margin, rect.top - popupHeight - gap)
        : Math.min(
            window.innerHeight - popupHeight - margin,
            rect.bottom + gap,
          ),
    visibility: popupSize.height ? "visible" : "hidden",
  };
}

export function JourneyTimeline({ events }: JourneyTimelineProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [popupPosition, setPopupPosition] = useState<PopupPosition | null>(null);
  const eventButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const popupRef = useRef<HTMLDivElement | null>(null);

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

  const activeEvent = activeIndex === null ? null : placedEvents[activeIndex];

  function activateEvent(index: number, element: HTMLElement) {
    setActiveIndex(index);
    setPopupPosition(getPopupPosition(element, placedEvents[index].direction));
  }

  function deactivateEvent() {
    setActiveIndex(null);
    setPopupPosition(null);
  }

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const currentIndex = activeIndex;

    function updatePopupPosition() {
      const activeButton = eventButtonRefs.current[currentIndex];

      if (!activeButton) {
        return;
      }

      setPopupPosition(
        getPopupPosition(activeButton, placedEvents[currentIndex].direction),
      );
    }

    window.addEventListener("resize", updatePopupPosition);
    window.addEventListener("scroll", updatePopupPosition, true);

    return () => {
      window.removeEventListener("resize", updatePopupPosition);
      window.removeEventListener("scroll", updatePopupPosition, true);
    };
  }, [activeIndex, placedEvents]);

  useLayoutEffect(() => {
    if (activeIndex === null || !popupRef.current) {
      return;
    }

    const activeButton = eventButtonRefs.current[activeIndex];

    if (!activeButton) {
      return;
    }

    const popupRect = popupRef.current.getBoundingClientRect();
    setPopupPosition(
      getPopupPosition(activeButton, placedEvents[activeIndex].direction, {
        height: popupRect.height,
        width: popupRect.width,
      }),
    );
  }, [activeIndex, activeEvent, placedEvents]);

  return (
    <div className="mt-10 overflow-x-auto overflow-y-visible pb-6">
      <div className="relative h-[24rem] min-w-[72rem] px-36">
        <div className="absolute left-18 right-18 top-1/2 h-px -translate-y-1/2 bg-border" />

        <div className="absolute left-18 right-28 top-1/2">
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
                  ref={(element) => {
                    eventButtonRefs.current[index] = element;
                  }}
                  type="button"
                  aria-expanded={active}
                  onBlur={deactivateEvent}
                  onClick={(clickEvent) => {
                    if (active) {
                      deactivateEvent();
                      return;
                    }

                    activateEvent(index, clickEvent.currentTarget);
                  }}
                  onFocus={(focusEvent) =>
                    activateEvent(index, focusEvent.currentTarget)
                  }
                  onMouseEnter={(mouseEvent) =>
                    activateEvent(index, mouseEvent.currentTarget)
                  }
                  onMouseLeave={deactivateEvent}
                  className={cn(
                    "absolute left-1/2 w-36 -translate-x-1/2 text-center text-sm font-semibold text-foreground underline-offset-4 transition hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/30",
                    labelClassName,
                    active && "text-primary",
                  )}
                >
                  {event.title}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      {activeEvent &&
        popupPosition &&
        createPortal(
          <div
            ref={popupRef}
            className="fixed z-[100] w-60 rounded-lg border bg-background p-4 text-left shadow-lg"
            style={{
              left: popupPosition.left,
              top: popupPosition.top,
              visibility: popupPosition.visibility,
            }}
          >
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {activeEvent.kind} / {activeEvent.dateLabel}
            </p>
            <h4 className="mt-2 text-base font-semibold text-foreground">
              {activeEvent.title}
            </h4>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {activeEvent.description}
            </p>
          </div>,
          document.body,
        )}
    </div>
  );
}
