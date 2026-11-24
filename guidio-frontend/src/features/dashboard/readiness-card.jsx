import { clampPercent, getReadinessLabel } from "@/features/dashboard/dashboard-utils";

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Circular score. `score` is a number from 0 to 100, or null when there
 * is not enough real data to calculate one.
 */
export function ReadinessCard({ score }) {
  const hasScore = typeof score === "number";
  const value = hasScore ? clampPercent(score) : 0;
  const offset = CIRCUMFERENCE * (1 - value / 100);

  return (
    <section className="min-w-0 rounded-[1.5rem] bg-muted p-3 sm:p-4">
      <div className="px-2 pb-4 pt-2 sm:px-3">
        <h2 className="text-xl font-semibold leading-tight tracking-[-0.02em]">
          Career readiness
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Calculated from your profile, latest skill match and interview scores.
        </p>
      </div>

      <div className="flex flex-col items-center gap-5 rounded-2xl bg-background p-5 text-center sm:p-6">
        <div
          role="img"
          aria-label={
            hasScore
              ? `Career readiness score: ${value} out of 100`
              : "Career readiness score not available yet"
          }
          className="relative size-36 shrink-0"
        >
          <svg viewBox="0 0 120 120" className="size-full -rotate-90">
            <circle
              cx="60"
              cy="60"
              r={RADIUS}
              fill="none"
              strokeWidth="9"
              className="stroke-foreground/10"
            />

            {hasScore ? (
              <circle
                cx="60"
                cy="60"
                r={RADIUS}
                fill="none"
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={offset}
                className="stroke-foreground transition-[stroke-dashoffset] duration-1000 ease-out"
              />
            ) : null}
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className={
                hasScore
                  ? "text-5xl font-semibold leading-none tracking-[-0.04em] tabular-nums"
                  : "text-5xl font-semibold leading-none text-muted-foreground"
              }
            >
              {hasScore ? value : "—"}
            </span>

            {hasScore ? (
              <span className="mt-1 text-xs text-muted-foreground">
                out of 100
              </span>
            ) : null}
          </div>
        </div>

        {hasScore ? (
          <div className="space-y-1.5">
            <p className="text-base font-semibold tracking-tight">
              {getReadinessLabel(value)}
            </p>
            <p className="text-xs leading-5 text-muted-foreground">
              Only the parts you have completed are counted. Run a skill gap
              analysis and finish a mock interview to make it more complete.
            </p>
          </div>
        ) : (
          <p className="max-w-xs text-sm leading-6 text-muted-foreground">
            Complete your profile, run a skill gap analysis or finish a mock
            interview to get your first readiness score.
          </p>
        )}
      </div>
    </section>
  );
}