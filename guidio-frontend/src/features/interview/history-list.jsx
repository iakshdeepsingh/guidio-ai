import { useState } from "react";
import { ArrowUpRight, Mic } from "lucide-react";
import { Link } from "react-router";
import { EmptyState } from "@/components/common/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { STATUS_FILTERS, filterInterviews } from "./history-utils";
import { formatDate } from "./interview-utils";
import { ScoreBadge } from "./score-bar";

export function HistoryList({ interviews }) {
  const [filter, setFilter] = useState("ALL");

  if (interviews.length === 0) {
    return (
      <EmptyState
        icon={Mic}
        title="No interviews yet"
        description="Take your first mock interview. Every finished interview is saved here with its score and feedback."
        action={
          <Link
            to="/mock-interview"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-12 rounded-full px-7 text-[0.9375rem]"
            )}
          >
            Start a mock interview
          </Link>
        }
      />
    );
  }

  const visible = filterInterviews(interviews, filter);

  return (
    <section className="rounded-[1.5rem] bg-muted p-3 sm:p-4">
      <div className="flex flex-col gap-3 px-2 pb-4 pt-2 sm:flex-row sm:items-center sm:justify-between sm:px-3">
        <h2 className="text-xl font-semibold leading-tight tracking-[-0.02em]">
          All interviews
        </h2>

        <div
          role="group"
          aria-label="Filter by status"
          className="flex flex-wrap gap-1.5"
        >
          {STATUS_FILTERS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilter(option.value)}
              aria-pressed={filter === option.value}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium tracking-[-0.01em] outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring/60",
                filter === option.value
                  ? "bg-foreground text-background"
                  : "bg-background text-muted-foreground hover:text-foreground"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="rounded-2xl bg-background p-6 text-center text-sm font-medium text-muted-foreground">
          No interviews match this filter.
        </p>
      ) : (
        <ul className="space-y-2">
          {visible.map((item) => {
            const isCompleted = item.status === "COMPLETED";
            const date = formatDate(item.createdAt);

            return (
              <li key={item.id}>
                <Link
                  to={`/interview-history/${encodeURIComponent(item.id)}`}
                  className="group flex items-center gap-3 rounded-2xl bg-background p-4 outline-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-24px] hover:shadow-foreground/40 focus-visible:ring-2 focus-visible:ring-ring/60"
                >
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <p className="min-w-0 break-words text-base font-semibold leading-tight tracking-[-0.02em]">
                        {item.targetRole}
                      </p>

                      {isCompleted && item.overallScore != null ? (
                        <ScoreBadge score={item.overallScore} />
                      ) : null}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-xs font-medium",
                          isCompleted
                            ? "bg-foreground text-background"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {isCompleted ? "Completed" : "In progress"}
                      </span>

                      <span className="text-xs text-muted-foreground">
                        {item.interviewType} · {item.difficulty}
                        {date ? ` · ${date}` : ""}
                      </span>
                    </div>

                    {!isCompleted ? (
                      <p className="text-xs tabular-nums text-muted-foreground">
                        Question {item.currentQuestion} of {item.totalQuestions}
                      </p>
                    ) : null}
                  </div>

                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}