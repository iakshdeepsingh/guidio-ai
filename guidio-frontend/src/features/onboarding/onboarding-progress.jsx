import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Shows "Step X of N", a progress bar and (from tablet width up)
 * the list of steps. On phones only the current step title is shown.
 */
export function OnboardingProgress({ steps, currentIndex }) {
  const total = steps.length;
  const percent = Math.round(((currentIndex + 1) / total) * 100);

  return (
    <nav aria-label="Onboarding progress" className="space-y-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-semibold tracking-[-0.01em]">
          Step {currentIndex + 1} of {total}
          <span className="ml-2 font-normal text-muted-foreground sm:hidden">
            · {steps[currentIndex].title}
          </span>
        </p>
        <p className="text-sm font-semibold tabular-nums tracking-[-0.01em] text-muted-foreground">
          {percent}%
        </p>
      </div>

      <div
        role="progressbar"
        aria-label={`Onboarding progress: step ${currentIndex + 1} of ${total}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="h-1.5 overflow-hidden rounded-full bg-foreground/10"
      >
        <div
          className="h-full rounded-full bg-foreground transition-all duration-700 ease-out motion-reduce:transition-none"
          style={{ width: `${percent}%` }}
        />
      </div>

      <ol className="hidden grid-cols-4 gap-2 sm:grid">
        {steps.map((step, index) => {
          const isDone = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <li
              key={step.id}
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                "flex min-w-0 items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-3 transition-colors duration-300",
                isCurrent ? "bg-muted" : "bg-transparent"
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums transition-colors duration-300",
                  isDone || isCurrent
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {isDone ? <Check className="size-3.5" /> : index + 1}
              </span>
              <span
                className={cn(
                  "truncate text-sm tracking-[-0.01em]",
                  isCurrent
                    ? "font-semibold"
                    : "font-medium text-muted-foreground"
                )}
              >
                {step.title}
                {isDone ? <span className="sr-only"> (completed)</span> : null}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}