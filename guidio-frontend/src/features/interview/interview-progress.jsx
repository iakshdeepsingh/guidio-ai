import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_LABELS = {
  answered: "answered",
  current: "current question",
  upcoming: "not available yet",
};

/**
 * Shows the interview setup, how many questions are answered and a row of
 * numbered steps. Answered steps can be opened to review the feedback, and
 * the current step goes back to the open question. Upcoming steps stay
 * locked, because the server creates each question only after the previous
 * answer is scored.
 */
export function InterviewProgress({
  interview,
  steps,
  activeQuestionId,
  onSelect,
  disabled,
}) {
  const answered = steps.filter((step) => step.status === "answered").length;
  const percent = steps.length > 0 ? Math.round((answered / steps.length) * 100) : 0;

  return (
    <section className="rounded-[1.5rem] bg-muted p-3 sm:p-4">
      <div className="space-y-4 rounded-2xl bg-background p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
              {interview.interviewType}
            </span>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {interview.difficulty}
            </span>
            <span className="min-w-0 break-words text-base font-semibold tracking-[-0.02em]">
              {interview.targetRole}
            </span>
          </div>

          <p className="text-sm font-medium tabular-nums tracking-[-0.01em] text-muted-foreground">
            {answered} of {steps.length} answered
          </p>
        </div>

        <div
          role="progressbar"
          aria-label="Interview progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          className="h-1.5 overflow-hidden rounded-full bg-foreground/10"
        >
          <div
            className="h-full rounded-full bg-foreground transition-[width] duration-700 ease-out motion-reduce:transition-none"
            style={{ width: `${percent}%` }}
          />
        </div>

        <ol aria-label="Interview questions" className="flex flex-wrap gap-2">
          {steps.map((step) => {
            const isActive = Boolean(step.question) && step.question.id === activeQuestionId;
            const canOpen = step.status !== "upcoming" && Boolean(step.question);

            return (
              <li key={step.number}>
                <button
                  type="button"
                  onClick={() => onSelect(step)}
                  disabled={disabled || !canOpen}
                  aria-current={isActive ? "step" : undefined}
                  aria-label={`Question ${step.number}, ${STATUS_LABELS[step.status]}`}
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full text-sm font-semibold tabular-nums outline-none transition-all duration-200",
                    "focus-visible:ring-2 focus-visible:ring-ring/60",
                    "disabled:cursor-not-allowed",
                    // Open question you are on: solid black
                    isActive && "bg-foreground text-background",
                    // Answered: soft gray with a check
                    !isActive &&
                      step.status === "answered" &&
                      "bg-muted text-foreground hover:bg-foreground/[0.1]",
                    // Current question, not open right now: ringed
                    !isActive &&
                      step.status === "current" &&
                      "bg-background text-foreground ring-2 ring-foreground/40 hover:ring-foreground",
                    // Locked
                    step.status === "upcoming" &&
                      "border border-dashed border-foreground/20 text-muted-foreground opacity-60"
                  )}
                >
                  {step.status === "answered" ? (
                    <Check aria-hidden="true" className="size-4" />
                  ) : (
                    step.number
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}