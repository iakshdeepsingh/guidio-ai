import {
  Check,
  ChevronDown,
  Lightbulb,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Trophy,
} from "lucide-react";
import { Link } from "react-router";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScoreBadge, ScoreBar } from "./score-bar";
import {
  asArray,
  clampScore,
  formatDate,
  getAverageScores,
  getScoreTone,
} from "./interview-utils";

const tile = "rounded-[1.5rem] bg-muted p-3 sm:p-4";

function TileHeader({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-3 px-2 pb-4 pt-2 sm:px-3">
      {Icon ? (
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
          <Icon aria-hidden="true" className="size-[18px]" />
        </span>
      ) : null}

      <div className="min-w-0">
        <h2 className="text-xl font-semibold leading-tight tracking-[-0.02em]">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function PointCard({ title, description, icon, items, emptyText }) {
  return (
    <section className={tile}>
      <TileHeader icon={icon} title={title} description={description} />

      <div className="rounded-2xl bg-background p-4 sm:p-5">
        {items.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            {emptyText}
          </p>
        ) : (
          <ul className="space-y-3">
            {items.map((item, index) => (
              <li
                key={`${index}-${item}`}
                className="flex gap-3 break-words text-sm leading-6 text-muted-foreground"
              >
                <span
                  aria-hidden="true"
                  className="mt-2.5 size-1 shrink-0 rounded-full bg-foreground/30"
                />
                <span className="min-w-0">{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function ImprovementPlan({ plan, onRefresh, isRefreshing, refreshError }) {
  if (plan) {
    const actionItems = asArray(plan.actionItems);

    return (
      <section className={tile}>
        <TileHeader
          icon={Sparkles}
          title="Your improvement plan"
          description={plan.title}
        />

        <div className="space-y-4 rounded-2xl bg-background p-4 sm:p-5">
          <p className="whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">
            {plan.summary}
          </p>

          {actionItems.length > 0 ? (
            <ol className="space-y-3 border-t border-foreground/10 pt-4">
              {actionItems.map((item, index) => (
                <li key={`${index}-${item}`} className="flex gap-3 text-sm leading-6">
                  <span
                    aria-hidden="true"
                    className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold tabular-nums"
                  >
                    {index + 1}
                  </span>
                  <span className="min-w-0 break-words pt-0.5 font-medium tracking-[-0.01em]">
                    {item}
                  </span>
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section className={tile}>
      <TileHeader
        icon={Sparkles}
        title="Your improvement plan"
        description="Prepared in the background after your interview."
      />

      <div className="space-y-3 rounded-2xl bg-background p-4 sm:p-5">
        <p className="text-sm leading-6 text-muted-foreground">
          Your plan is not ready yet. It can take a minute. If it does not
          appear, the AI may have reached its free limit, so you can check again
          later.
        </p>

        {refreshError ? (
          <p role="alert" className="text-sm font-medium text-destructive">
            {refreshError.message}
          </p>
        ) : null}

        <Button
          type="button"
          variant="outline"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="h-11 rounded-full border-foreground/10 bg-muted px-5"
        >
          <RefreshCw aria-hidden="true" className={cn(isRefreshing && "animate-spin")} />
          {isRefreshing ? "Checking…" : "Check for my plan"}
        </Button>
      </div>
    </section>
  );
}

export function InterviewResult({
  interview,
  onNew,
  onRefresh,
  isRefreshing,
  refreshError,
}) {
  const overall = clampScore(interview.overallScore);
  const tone = getScoreTone(overall);
  const averages = getAverageScores(interview);
  const answered = asArray(interview.questions).filter((question) => question.answer);
  const dateLabel = formatDate(interview.completedAt || interview.createdAt);

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Result */}
      <section className={tile}>
        <div className="space-y-5 rounded-2xl bg-background p-5 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 space-y-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background">
                <Trophy aria-hidden="true" className="size-3.5" />
                Interview complete
              </span>

              <h2 className="break-words text-2xl font-semibold leading-[1.1] tracking-[-0.03em] sm:text-4xl">
                {interview.targetRole} interview
              </h2>

              <p className="text-sm text-muted-foreground">
                {interview.interviewType} · {interview.difficulty}
                {dateLabel ? ` · ${dateLabel}` : ""}
              </p>
            </div>

            <div className="shrink-0 sm:text-right">
              <p
                className={cn(
                  "text-6xl font-semibold leading-none tracking-[-0.05em] tabular-nums sm:text-7xl",
                  tone.text
                )}
              >
                {overall}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                overall score out of 100
              </p>
            </div>
          </div>

          {interview.summary ? (
            <p className="max-w-3xl whitespace-pre-wrap break-words text-[0.9375rem] font-medium leading-snug tracking-[-0.01em] text-muted-foreground">
              {interview.summary}
            </p>
          ) : null}

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              onClick={onNew}
              className="h-12 rounded-full px-7 text-[0.9375rem]"
            >
              <RotateCcw aria-hidden="true" />
              Practice again
            </Button>

            <Link
              to="/dashboard"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-12 rounded-full border-foreground/10 bg-muted px-7 text-[0.9375rem]"
              )}
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Score breakdown */}
      {averages.length > 0 ? (
        <section className={tile}>
          <TileHeader
            title="Score breakdown"
            description="The average of each score across your answers."
          />

          <div className="grid gap-x-6 gap-y-4 rounded-2xl bg-background p-4 sm:grid-cols-2 sm:p-5">
            {averages.map(({ key, label, value }) => (
              <ScoreBar key={key} label={label} value={value} />
            ))}
          </div>
        </section>
      ) : null}

      <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        <PointCard
          title="Strengths"
          description="What worked well across the interview."
          icon={Check}
          items={asArray(interview.strengths)}
          emptyText="Open the question review below to see the strengths of each answer."
        />

        <PointCard
          title="Priority improvements"
          description="Focus on these before your next practice."
          icon={Lightbulb}
          items={asArray(interview.improvements)}
          emptyText="Open the question review below to see what to improve in each answer."
        />
      </div>

      <ImprovementPlan
        plan={interview.improvementSummary}
        onRefresh={onRefresh}
        isRefreshing={isRefreshing}
        refreshError={refreshError}
      />

      {/* Question review */}
      <section className={tile}>
        <TileHeader
          title="Question review"
          description="Open a question to see your answer and the feedback."
        />

        <div className="space-y-2">
          {answered.length === 0 ? (
            <p className="rounded-2xl bg-background p-5 text-center text-sm font-medium text-muted-foreground">
              No answered questions were saved for this interview.
            </p>
          ) : (
            answered.map((question, index) => (
              <details key={question.id} className="group rounded-2xl bg-background">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-3 rounded-2xl p-4 outline-none focus-visible:ring-2 focus-visible:ring-ring/60 sm:p-5 [&::-webkit-details-marker]:hidden">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold tracking-tight text-muted-foreground">
                      Question {question.order ?? index + 1}
                    </p>
                    <p className="mt-1 break-words text-sm font-semibold leading-6 tracking-[-0.01em]">
                      {question.question}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <ScoreBadge score={question.answer.overallScore} />
                    <span className="flex size-7 items-center justify-center rounded-full bg-muted">
                      <ChevronDown
                        aria-hidden="true"
                        className="size-4 text-muted-foreground transition-transform duration-300 group-open:rotate-180"
                      />
                    </span>
                  </div>
                </summary>

                <div className="grid gap-2 px-3 pb-3 sm:px-4 sm:pb-4">
                  <div className="rounded-xl bg-muted p-4">
                    <p className="text-xs font-semibold tracking-tight text-muted-foreground">
                      Your answer
                    </p>
                    <p className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-6">
                      {question.answer.answerText}
                    </p>
                  </div>

                  <div className="rounded-xl bg-muted p-4">
                    <p className="text-xs font-semibold tracking-tight text-muted-foreground">
                      Feedback
                    </p>
                    <p className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">
                      {question.answer.feedback}
                    </p>
                  </div>
                </div>
              </details>
            ))
          )}
        </div>
      </section>
    </div>
  );
}