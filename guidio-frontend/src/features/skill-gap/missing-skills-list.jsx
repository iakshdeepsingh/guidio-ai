import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  asArray,
  countByPriority,
  PRIORITY_ORDER,
  PRIORITY_STYLES,
  sortByPriority,
} from "./skill-gap-utils";

const FILTERS = ["All", ...PRIORITY_ORDER];

export function MissingSkillsList({ skills }) {
  const [filter, setFilter] = useState("All");

  const all = sortByPriority(asArray(skills));
  const counts = countByPriority(all);
  const visible = filter === "All" ? all : all.filter((skill) => skill.priority === filter);

  return (
    <div className="space-y-4">
      <div
        className="flex flex-wrap gap-1.5"
        role="group"
        aria-label="Filter by priority"
      >
        {FILTERS.map((name) => {
          const isActive = filter === name;
          const count = name === "All" ? all.length : counts[name];

          return (
            <button
              key={name}
              type="button"
              onClick={() => setFilter(name)}
              aria-pressed={isActive}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium tracking-[-0.01em] outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring/60",
                isActive
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-foreground/[0.08] hover:text-foreground"
              )}
            >
              {name}
              <span className="ml-1.5 tabular-nums opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="rounded-[1.5rem] bg-muted p-8 text-center text-sm font-medium text-muted-foreground">
          No skills in this priority.
        </p>
      ) : (
        <ul className="space-y-2">
          {visible.map((skill, index) => {
            const style = PRIORITY_STYLES[skill.priority] || PRIORITY_STYLES.Low;

            return (
              <li key={`${skill.skill}-${index}`}>
                <details className="group rounded-[1.5rem] bg-muted">
                  <summary className="flex cursor-pointer list-none items-center gap-3 rounded-[1.5rem] p-4 outline-none focus-visible:ring-2 focus-visible:ring-ring/60 sm:p-5 [&::-webkit-details-marker]:hidden">
                    <span className="min-w-0 flex-1 break-words text-base font-semibold leading-tight tracking-[-0.02em]">
                      {skill.skill}
                    </span>

                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium",
                        style.badge
                      )}
                    >
                      {skill.priority}
                    </span>

                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-background">
                      <ChevronDown
                        aria-hidden="true"
                        className="size-4 text-muted-foreground transition-transform duration-300 group-open:rotate-180"
                      />
                    </span>
                  </summary>

                  <div className="grid gap-2 px-3 pb-3 text-sm leading-6 sm:grid-cols-2 sm:px-4 sm:pb-4">
                    <div className="rounded-2xl bg-background p-4">
                      <p className="text-xs font-semibold tracking-tight text-muted-foreground">
                        Why it matters
                      </p>
                      <p className="mt-1 break-words">{skill.reason}</p>
                    </div>

                    <div className="rounded-2xl bg-background p-4">
                      <p className="text-xs font-semibold tracking-tight text-muted-foreground">
                        What to focus on
                      </p>
                      <p className="mt-1 break-words">{skill.learningFocus}</p>
                    </div>
                  </div>
                </details>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}