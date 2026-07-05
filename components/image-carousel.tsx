"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type CarouselImage = {
  src: string;
  alt: string;
  caption?: string;
};

type ImageCarouselProps = {
  images: CarouselImage[];
  /** @default "video" */
  aspectRatio?: "video" | "square" | "portrait";
};

const aspectClasses = {
  video: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[3/4]",
};

// must stay in sync with the gap-2 class on the track (0.5rem)
const SLIDE_GAP = "0.5rem";

export function ImageCarousel({ images, aspectRatio = "video" }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);

  if (images.length === 0) return null;

  const prev = () => setCurrent((i) => (i - 1 + images.length) % images.length);
  const next = () => setCurrent((i) => (i + 1) % images.length);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) delta < 0 ? next() : prev();
    touchStartX.current = null;
  };

  return (
    <figure className="my-8">
      {/* overflow-hidden clips the peek zones to the rounded container */}
      <div
        className="relative overflow-hidden rounded-lg bg-card"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* horizontal padding carves out peek zones for adjacent slides */}
        <div className="px-10">
          <div className={cn("relative", aspectClasses[aspectRatio])}>
            {/* sliding track — translateX accounts for gap between slides */}
            <div
              className="absolute inset-0 flex gap-2 transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(calc(-${current} * (100% + ${SLIDE_GAP})))` }}
            >
              {images.map((img) => (
                <div key={img.src} className="relative w-full flex-shrink-0 overflow-hidden rounded">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 640px) calc(100vw - 80px), 640px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-1.5 backdrop-blur-sm transition-colors hover:bg-background"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={next}
              aria-label="next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-1.5 backdrop-blur-sm transition-colors hover:bg-background"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`image ${i + 1} of ${images.length}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === current ? "w-4 bg-white" : "w-1.5 bg-white/50 hover:bg-white/75"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {images[current].caption && (
        <figcaption className="mt-2 text-center text-sm italic text-muted-foreground">
          {images[current].caption}
        </figcaption>
      )}
    </figure>
  );
}
