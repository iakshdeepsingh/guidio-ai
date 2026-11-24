import { Flag } from "lucide-react";
import { asArray } from "./career-utils";

export function CareerRoadmap({ roadmap }) {
  const phases = asArray(roadmap);

  if (phases.length === 0) {
    return (
      <p className="rounded-[1.5rem] bg-muted p-8 text-center text-sm font-medium text-muted-foreground">
        This plan has no roadmap.
      </p>
    );
  }

  return (
    <ol>
      {phases.map((phase, index) => {
        const isLast = index === phases.length - 1;

        return (
          <li
            key={`${phase.phase}-${index}`}
            className="flex gap-3 sm:gap-4"
          >
            {/* Number and connecting line */}
            <div className="flex flex-col items-center">
              <span
                aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-semibold tabular-nums text-background"
              >
                {index + 1}
              </span>
              {!isLast ? (
                <span
                  aria-hidden="true"
                  className="my-1 w-px flex-1 bg-foreground/15"
                />
              ) : null}
            </div>

            {/* Phase tile */}
            <div
              className={
                isLast
                  ? "min-w-0 flex-1"
                  : "min-w-0 flex-1 pb-3 sm:pb-4"
              }
            >
              <div className="space-y-4 rounded-[1.5rem] bg-muted p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="min-w-0 break-words text-xl font-semibold leading-tight tracking-[-0.02em]">
                    {phase.phase}
                  </h3>
                  <span className="shrink-0 rounded-full bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                    {phase.duration}
                  </span>
                </div>

                <p className="break-words text-sm leading-6 text-muted-foreground">
                  {phase.goal}
                </p>

                <div className="space-y-2">
                  <p className="text-xs font-semibold tracking-tight text-muted-foreground">
                    Topics to study
                  </p>
                  <ul className="flex flex-wrap gap-1.5">
                    {asArray(phase.topics).map((topic) => (
                      <li
                        key={topic}
                        className="rounded-full bg-background px-3 py-1 text-xs font-medium tracking-[-0.01em]"
                      >
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="flex gap-3 rounded-2xl bg-background p-4 text-sm leading-6">
                  <Flag
                    aria-hidden="true"
                    className="mt-1 size-4 shrink-0 text-foreground"
                  />
                  <span className="min-w-0 break-words">
                    <span className="font-semibold">Expected outcome: </span>
                    <span className="text-muted-foreground">
                      {phase.outcome}
                    </span>
                  </span>
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}