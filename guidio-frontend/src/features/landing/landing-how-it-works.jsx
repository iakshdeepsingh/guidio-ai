import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { steps } from "@/features/landing/landing-data";
import { SectionHeading } from "@/features/landing/section-heading";
import { cn } from "@/lib/utils";

const reveal = (delay) => ({
  animationDelay: `${delay}ms`,
  animationFillMode: "both",
});

const pad = (n) => String(n).padStart(2, "0");

export function LandingHowItWorks() {
  const listRef = useRef(null);
  const [revealed, setRevealed] = useState(false);

  // Play the tile entrance once, when the list is about to be seen.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="scroll-mt-20 py-16 sm:py-24">
      <div className="container max-w-6xl">
        <SectionHeading
          eyebrow="How it works"
          title="From sign-up to a clear plan in three steps."
          description="Guidio AI turns your skills and goals into actions you can start on today."
        />

        <ol
          ref={listRef}
          role="list"
          className="mt-10 grid gap-3 sm:mt-14 md:grid-cols-3 md:gap-4"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;

            return (
              <li
                key={step.title}
                style={reveal(index * 100)}
                className={cn(
                  "relative duration-700",
                  revealed
                    ? "animate-in fade-in slide-in-from-bottom-4 motion-reduce:animate-none"
                    : "opacity-0",
                )}
              >
                <article className="group relative flex h-full min-h-[18rem] flex-col overflow-hidden rounded-[1.75rem] bg-muted p-6 sm:min-h-[22rem] sm:rounded-[2rem] sm:p-8">
                  {/* Big faded number */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-3 -top-6 select-none text-[9rem] font-semibold leading-none tracking-[-0.06em] text-foreground/[0.05] transition-transform duration-700 motion-reduce:transition-none group-hover:-translate-x-1 sm:text-[11rem]"
                  >
                    {pad(index + 1)}
                  </span>

                  <div className="relative flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-full bg-foreground text-background transition-transform duration-300 motion-reduce:transition-none group-hover:scale-105">
                      <Icon aria-hidden="true" className="size-[18px]" />
                    </span>
                    <span className="text-sm font-semibold tracking-tight text-muted-foreground">
                      Step {pad(index + 1)}
                    </span>
                  </div>

                  <div className="relative mt-auto pt-10">
                    <h3 className="text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2rem]">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>

                    <div className="mt-6 h-1 overflow-hidden rounded-full bg-foreground/10">
                      <div
                        className="h-full rounded-full bg-foreground"
                        style={{
                          width: `${((index + 1) / steps.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </article>

                {/* Connector between tiles (desktop only) */}
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className="absolute -right-[1.35rem] top-1/2 z-10 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full border bg-background text-foreground shadow-sm md:flex"
                  >
                    <ArrowRight className="size-4" />
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}