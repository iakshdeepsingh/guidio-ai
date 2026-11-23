import { useEffect, useRef, useState } from "react";
import { benefits } from "@/features/landing/landing-data";
import { SectionHeading } from "@/features/landing/section-heading";
import { cn } from "@/lib/utils";

const reveal = (delay) => ({
  animationDelay: `${delay}ms`,
  animationFillMode: "both",
});

const pad = (n) => String(n).padStart(2, "0");

// Static data: compute once instead of on every render.
const regular = benefits.slice(0, -1);
const last = benefits[benefits.length - 1];
const LastIcon = last.icon;

/**
 * Bento layout for the six benefits (lg: 6-column grid).
 * Order matches landing-data: 0 wide, 1-4 normal, 5 full-width dark.
 */
const layout = [
  "sm:col-span-2 lg:col-span-4 lg:min-h-[20rem]",
  "lg:col-span-2 lg:min-h-[20rem]",
  "lg:col-span-2",
  "lg:col-span-2",
  "sm:col-span-2 lg:col-span-2",
];

export function LandingBenefits() {
  const gridRef = useRef(null);
  const [revealed, setRevealed] = useState(false);

  // Play the tile entrance once, when the grid is about to be seen.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  const entrance = revealed
    ? "animate-in fade-in slide-in-from-bottom-4 motion-reduce:animate-none"
    : "opacity-0";

  return (
    <section id="benefits" className="scroll-mt-20 py-16 sm:py-24">
      <div className="container max-w-6xl">
        <SectionHeading
          eyebrow="Why Guidio AI"
          title="Stop guessing what to do next."
          description="Students often have the motivation but not a clear path. Guidio AI connects learning, skills, career goals and interview practice in one place."
        />

        <div
          ref={gridRef}
          className="mt-10 grid gap-3 sm:mt-14 sm:grid-cols-2 sm:gap-4 lg:grid-cols-6"
        >
          {regular.map((benefit, index) => {
            const Icon = benefit.icon;
            const isWide = index === 0;

            return (
              <article
                key={benefit.title}
                style={reveal(index * 80)}
                className={cn(
                  "group relative flex min-h-[16rem] flex-col overflow-hidden rounded-[1.75rem] bg-muted p-6 duration-700 sm:min-h-[18rem] sm:rounded-[2rem] sm:p-8",
                  entrance,
                  layout[index],
                )}
              >
                {/* Big faded icon, Apple-style corner artwork */}
                <Icon
                  aria-hidden="true"
                  strokeWidth={1}
                  className="pointer-events-none absolute -bottom-8 -right-8 size-52 text-foreground/[0.06] transition-transform duration-700 motion-reduce:transition-none group-hover:-rotate-6 group-hover:scale-110 sm:size-64"
                />

                <p className="relative flex items-center gap-2 text-sm font-semibold tracking-tight text-muted-foreground">
                  <Icon aria-hidden="true" className="size-4" />
                  <span className="font-mono text-xs tabular-nums">
                    {pad(index + 1)}
                  </span>
                </p>

                <div className="relative mt-auto pt-10">
                  <h3
                    className={cn(
                      "font-semibold leading-[1.08] tracking-[-0.03em]",
                      isWide
                        ? "text-[2rem] sm:text-5xl"
                        : "text-[1.625rem] sm:text-[1.875rem]",
                    )}
                  >
                    {benefit.title}
                  </h3>

                  <p
                    className={cn(
                      "mt-3 leading-relaxed text-muted-foreground",
                      isWide
                        ? "max-w-md text-base sm:text-lg"
                        : "max-w-xs text-[0.9375rem]",
                    )}
                  >
                    {benefit.description}
                  </p>
                </div>
              </article>
            );
          })}

          {/* Closing tile: inverted, full width */}
          <article
            style={reveal(regular.length * 80)}
            className={cn(
              "group relative flex min-h-[15rem] flex-col justify-end overflow-hidden rounded-[1.75rem] bg-foreground p-6 text-background duration-700 sm:col-span-2 sm:min-h-[16rem] sm:rounded-[2rem] sm:p-8 lg:col-span-6 lg:min-h-[18rem] lg:p-12",
              entrance,
            )}
          >
            <LastIcon
              aria-hidden="true"
              strokeWidth={1}
              className="pointer-events-none absolute -right-6 -top-6 size-56 text-background/10 transition-transform duration-700 motion-reduce:transition-none group-hover:rotate-6 group-hover:scale-110 sm:size-72 lg:right-10 lg:size-80"
            />

            <p className="relative flex items-center gap-2 text-sm font-semibold tracking-tight text-background/60">
              <LastIcon aria-hidden="true" className="size-4" />
              <span className="font-mono text-xs tabular-nums">
                {pad(benefits.length)}
              </span>
            </p>

            <div className="relative mt-10 max-w-xl">
              <h3 className="text-[2rem] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl lg:text-[3.5rem]">
                {last.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-background/70 sm:text-lg">
                {last.description}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}