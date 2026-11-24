import { ArrowUpRight, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScoreBadge } from "./score-bar";
import { formatDate } from "./interview-utils";

export function InterviewHistory({ interviews, onOpen, disabled }) {
  return (
    <section className="rounded-[1.5rem] bg-muted p-3 sm:p-4">
      <div className="flex items-start gap-3 px-2 pb-4 pt-2 sm:px-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
          <History aria-hidden="true" className="size-[18px]" />
        </span>

        <div className="min-w-0">
          <h2 className="text-xl font-semibold leading-tight tracking-[-0.02em]">
            Interview history
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Review finished interviews or reopen one in progress.
          </p>
        </div>
      </div>

      {interviews.length === 0 ? (
        <p className="rounded-2xl bg-background p-5 text-center text-sm font-medium text-muted-foreground">
          No interviews yet. Your finished interviews will appear here.
        </p>
      ) : (
        <ul className="max-h-[32rem] space-y-2 overflow-y-auto pr-1">
          {interviews.map((item) => {
            const isCompleted = item.status === "COMPLETED";
            const date = formatDate(item.createdAt);

            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onOpen(item.id)}
                  disabled={disabled}
                  className="group flex w-full items-center gap-3 rounded-2xl bg-background p-4 text-left outline-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-24px] hover:shadow-foreground/40 focus-visible:ring-2 focus-visible:ring-ring/60 disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <p className="min-w-0 break-words text-sm font-semibold leading-tight tracking-tight">
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
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}