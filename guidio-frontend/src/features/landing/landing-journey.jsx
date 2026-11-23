import { memo } from "react";
import { journey } from "@/features/landing/landing-data";
import { SectionHeading } from "@/features/landing/section-heading";
import { cn } from "@/lib/utils";

const pad = (n) => String(n).padStart(2, "0");

// Static values: compute once instead of on every render.
const tileTop = (index) => ({ top: `calc(5.5rem + ${index * 0.75}rem)` });
const progressWidth = (index) => ({
  width: `${((index + 1) / journey.length) * 100}%`,
});

export const LandingJourney = memo(function LandingJourney() {
  return (
    <section id="journey" className="scroll-mt-20 py-16 sm:py-24">
      <div className="container max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          {/* Intro: stays in view while the tiles scroll past */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              align="left"
              eyebrow="Student journey"
              title="From unsure to interview-ready."
              description="Move through four stages at your own pace. Each one has a tool built for it, and you can return whenever you want as your skills grow."
            />

            <ol
              role="list"
              aria-label="Journey stages"
              className="mt-8 hidden gap-2 lg:grid lg:grid-cols-4"
            >
              {journey.map((stage, index) => (
                <li key={stage.title}>
                  <span className="block h-1 rounded-full bg-foreground/15" />
                  <span className="mt-2 block font-mono text-xs tabular-nums text-muted-foreground">
                    {pad(index + 1)}
                  </span>
                  <span className="block text-sm font-medium tracking-tight">
                    {stage.title}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Stage tiles: each one sticks and the next slides over it */}
          <ol role="list" className="space-y-4 pb-2">
            {journey.map((stage, index) => {
              const Icon = stage.icon;
              const isLast = index === journey.length - 1;

              return (
                <li
                  key={stage.title}
                  className="sticky"
                  style={tileTop(index)}
                >
                  <article
                    className={cn(
                      "group relative flex min-h-[19rem] flex-col overflow-hidden rounded-[1.75rem] p-6 shadow-[0_-20px_40px_-30px] shadow-foreground/20 sm:min-h-[21rem] sm:rounded-[2rem] sm:p-8",
                      isLast
                        ? "bg-foreground text-background"
                        : "bg-muted text-foreground",
                    )}
                  >
                    {/* Big faded number */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "pointer-events-none absolute -right-3 -top-6 select-none text-[9rem] font-semibold leading-none tracking-[-0.06em] transition-transform duration-700 motion-reduce:transition-none group-hover:-translate-x-1 sm:text-[11rem]",
                        isLast ? "text-background/10" : "text-foreground/[0.05]",
                      )}
                    >
                      {pad(index + 1)}
                    </span>

                    <div className="relative flex items-center justify-between gap-3">
                      <span className="flex items-center gap-3">
                        <span
                          className={cn(
                            "flex size-11 items-center justify-center rounded-full transition-transform duration-300 motion-reduce:transition-none group-hover:scale-105",
                            isLast
                              ? "bg-background text-foreground"
                              : "bg-foreground text-background",
                          )}
                        >
                          <Icon aria-hidden="true" className="size-[18px]" />
                        </span>
                        <span
                          className={cn(
                            "text-sm font-semibold tracking-tight",
                            isLast ? "text-background/60" : "text-muted-foreground",
                          )}
                        >
                          Step {pad(index + 1)}
                        </span>
                      </span>
                    </div>

                    <div className="relative mt-auto pt-10">
                      <span
                        className={cn(
                          "inline-block rounded-full px-3 py-1 text-xs font-medium",
                          isLast
                            ? "bg-background/10 text-background/80"
                            : "bg-background text-muted-foreground",
                        )}
                      >
                        {stage.tool}
                      </span>

                      <h3 className="mt-4 text-[2rem] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl">
                        {stage.title}
                      </h3>

                      <p
                        className={cn(
                          "mt-3 max-w-md text-base leading-relaxed sm:text-lg",
                          isLast ? "text-background/70" : "text-muted-foreground",
                        )}
                      >
                        {stage.description}
                      </p>

                      <div className="mt-6 flex items-center gap-3">
                        <div
                          className={cn(
                            "h-1 flex-1 overflow-hidden rounded-full",
                            isLast ? "bg-background/20" : "bg-foreground/10",
                          )}
                        >
                          <div
                            className={cn(
                              "h-full rounded-full",
                              isLast ? "bg-background" : "bg-foreground",
                            )}
                            style={progressWidth(index)}
                          />
                        </div>
                        <span
                          className={cn(
                            "shrink-0 text-[10px] font-semibold uppercase tracking-wider",
                            isLast ? "text-background/60" : "text-muted-foreground",
                          )}
                        >
                          {isLast ? "Interview ready" : "Next stage"}
                        </span>
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
});