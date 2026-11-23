import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { FeatureVisual } from "@/features/landing/feature-visuals";
import { features } from "@/features/landing/landing-data";
import { SectionHeading } from "@/features/landing/section-heading";
import { cn } from "@/lib/utils";

const reveal = (delay) => ({
  animationDelay: `${delay}ms`,
  animationFillMode: "both",
});

const pad = (n) => String(n).padStart(2, "0");

export function LandingFeatures() {
  const dialogRef = useRef(null);
  const trackRef = useRef(null);
  const rowRef = useRef(null);
  const rafRef = useRef(0);

  const [activeId, setActiveId] = useState(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [revealed, setRevealed] = useState(false);

  const active = features.find((feature) => feature.id === activeId) ?? null;

  // Throttled to one update per frame; React skips unchanged values.
  const updateArrows = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = 0;
      const track = trackRef.current;
      if (!track) return;
      setCanPrev(track.scrollLeft > 4);
      setCanNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 4);
    });
  }, []);

  // Keep arrows correct when the track or its cards change size
  // (window resize, fonts or images loading, etc).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    updateArrows();

    const observer = new ResizeObserver(updateArrows);
    observer.observe(track);
    Array.from(track.children).forEach((child) => observer.observe(child));

    return () => {
      observer.disconnect();
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, [updateArrows]);

  // Play the tile entrance when the row is actually about to be seen.
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(row);
    return () => observer.disconnect();
  }, []);

  function scrollByCard(direction) {
    const track = trackRef.current;
    const card = track?.querySelector("li");
    if (!track || !card) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    track.scrollBy({
      left: direction * (card.offsetWidth + 16),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }

  // Open the native dialog when a feature is picked.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (activeId && !dialog.open) dialog.showModal();
  }, [activeId]);

  // Lock page scroll while the sheet is open, without the layout jump
  // caused by the scrollbar disappearing.
  useEffect(() => {
    if (!activeId) return undefined;

    const { body, documentElement } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [activeId]);

  function close() {
    dialogRef.current?.close();
  }

  return (
    <section id="features" className="scroll-mt-20 py-16 sm:py-24">
      <div className="container max-w-6xl">
        <SectionHeading
          eyebrow="Features"
          title="Four tools. One career companion."
          description="From understanding a tricky concept to preparing for your final interview, everything works together around your profile."
        />
      </div>

      {/* Tile row: bleeds to the screen edge, starts aligned with the heading */}
      <div ref={rowRef} className="mt-10 sm:mt-14">
        <ul
          ref={trackRef}
          role="list"
          onScroll={updateArrows}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-[var(--edge)] pb-2 [--edge:calc((100%_-_min(100%,_72rem))_/_2_+_clamp(1rem,_4vw,_2rem))] [scrollbar-width:none] scroll-pl-[var(--edge)] [&::-webkit-scrollbar]:hidden"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <li
                key={feature.id}
                style={reveal(index * 90)}
                className={cn(
                  "w-[84vw] max-w-[26rem] shrink-0 snap-start duration-700 sm:w-[26rem]",
                  revealed
                    ? "animate-in fade-in slide-in-from-bottom-4 motion-reduce:animate-none"
                    : "opacity-0",
                )}
              >
                <article className="group relative flex h-[33rem] flex-col overflow-hidden rounded-[1.75rem] bg-muted p-6 transition-transform duration-500 hover:scale-[1.015] sm:h-[36rem] sm:rounded-[2rem] sm:p-8">
                  <div>
                    <p className="flex items-center gap-2 text-sm font-semibold tracking-tight text-muted-foreground">
                      <Icon aria-hidden="true" className="size-4" />
                      {feature.title}
                    </p>

                    <h3 className="mt-3 text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2rem]">
                      {feature.description}
                    </h3>
                  </div>

                  {/* Example, cropped by the card and faded out at the bottom */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none -mb-16 mt-auto pt-8 transition-transform duration-500 [mask-image:linear-gradient(to_bottom,black_65%,transparent)] group-hover:-translate-y-2"
                  >
                    <FeatureVisual id={feature.id} />
                  </div>

                  <span
                    aria-hidden="true"
                    className="absolute bottom-5 right-5 flex size-10 items-center justify-center rounded-full bg-foreground text-background transition-transform duration-300 group-hover:scale-110 group-hover:rotate-90 sm:bottom-6 sm:right-6"
                  >
                    <Plus className="size-5" />
                  </span>

                  {/* Makes the whole tile the button */}
                  <button
                    type="button"
                    onClick={() => setActiveId(feature.id)}
                    aria-haspopup="dialog"
                    aria-label={`Learn more about ${feature.title}`}
                    className="absolute inset-0 z-10 rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2"
                  />
                </article>
              </li>
            );
          })}
        </ul>

        <div className="container mt-6 flex max-w-6xl justify-end gap-3">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            aria-label="Previous feature"
            className="flex size-11 items-center justify-center rounded-full bg-muted text-foreground outline-none transition-all hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-35"
          >
            <ChevronLeft aria-hidden="true" className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            aria-label="Next feature"
            className="flex size-11 items-center justify-center rounded-full bg-muted text-foreground outline-none transition-all hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-35"
          >
            <ChevronRight aria-hidden="true" className="size-5" />
          </button>
        </div>
      </div>

      {/* Detail sheet */}
      <dialog
        ref={dialogRef}
        aria-labelledby="feature-dialog-title"
        onClose={() => setActiveId(null)}
        onClick={(event) => {
          // Click on the dark backdrop closes the sheet.
          if (event.target === dialogRef.current) close();
        }}
        className="animate-in fade-in zoom-in-95 slide-in-from-bottom-4 fixed inset-0 m-auto w-[calc(100%-1rem)] max-w-3xl overflow-hidden rounded-[1.75rem] bg-background p-0 text-foreground shadow-2xl duration-300 motion-reduce:animate-none backdrop:bg-black/60 sm:w-[calc(100%-3rem)] sm:rounded-[2rem]"
      >
        {active && (
          <>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground outline-none transition-colors hover:bg-foreground hover:text-background focus-visible:ring-2 focus-visible:ring-ring/60 sm:right-6 sm:top-6"
            >
              <X aria-hidden="true" className="size-4" />
            </button>

            <div className="max-h-[92dvh] overflow-y-auto overscroll-contain">
              <div className="px-6 pb-8 pt-8 sm:px-12 sm:pb-12 sm:pt-12">
                <p className="pr-12 text-sm font-semibold tracking-tight text-muted-foreground">
                  {active.title}
                </p>

                <h3
                  id="feature-dialog-title"
                  className="mt-3 text-[2rem] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-5xl"
                >
                  {active.description}
                </h3>

                <div className="mt-8 rounded-[1.5rem] bg-muted p-3 sm:mt-10 sm:p-6">
                  <div className="mx-auto max-w-lg">
                    <FeatureVisual id={active.id} />
                  </div>
                </div>

                <ul
                  role="list"
                  className="mt-8 grid gap-6 border-t pt-8 sm:mt-10 sm:grid-cols-3 sm:gap-8"
                >
                  {active.points.map((point, index) => (
                    <li key={point}>
                      <span className="font-mono text-xs tabular-nums text-muted-foreground">
                        {pad(index + 1)}
                      </span>
                      <p className="mt-2 text-base font-medium leading-snug tracking-[-0.01em]">
                        {point}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </dialog>
    </section>
  );
}