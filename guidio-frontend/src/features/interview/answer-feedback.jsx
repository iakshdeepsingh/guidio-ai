import { ArrowRight, Check, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScoreBar } from "./score-bar";
import {
  SCORE_DIMENSIONS,
  asArray,
  clampScore,
  getScoreTone,
} from "./interview-utils";

function PointList({ title, icon: Icon, items, emptyText }) {
  return (
    <div className="space-y-3 rounded-2xl bg-background p-4 sm:p-5">
      <h3 className="flex items-center gap-2.5 text-sm font-semibold tracking-[-0.01em]">
        <span
          aria-hidden="true"
          className="flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground text-background"
        >
          <Icon className="size-3.5" />
        </span>
        {title}
      </h3>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyText}</p>
      ) : (
        <ul className="space-y-2.5">
          {items.map((item, index) => (
            <li
              key={`${index}-${item}`}
              className="flex gap-2.5 break-words text-sm leading-6 text-muted-foreground"
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
  );
}

export function AnswerFeedback({ answer, onContinue, continueLabel }) {
  if (!answer) return null;

  const tone = getScoreTone(answer.overallScore);

  return (
    <section className="rounded-[1.5rem] bg-muted p-3 sm:p-4">
      <div className="flex items-start justify-between gap-4 px-2 pb-4 pt-2 sm:px-3">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold leading-tight tracking-[-0.02em]">
            Answer feedback
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            How Guidio AI scored this answer.
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p
            className={cn(
              "text-5xl font-semibold leading-none tracking-[-0.04em] tabular-nums",
              tone.text
            )}
          >
            {clampScore(answer.overallScore)}
            <span className="ml-0.5 text-sm font-normal tracking-normal text-muted-foreground">
              /100
            </span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Overall</p>
        </div>
      </div>

      <div className="space-y-2">
        {/* Your answer */}
        <div className="rounded-2xl bg-background p-4 sm:p-5">
          <p className="text-xs font-semibold tracking-tight text-muted-foreground">
            Your answer
          </p>
          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6">
            {answer.answerText}
          </p>
        </div>

        {/* Scores */}
        <div className="grid gap-x-6 gap-y-4 rounded-2xl bg-background p-4 sm:grid-cols-2 sm:p-5">
          {SCORE_DIMENSIONS.map(({ key, label }) => (
            <ScoreBar key={key} label={label} value={answer[key]} />
          ))}
        </div>

        {/* Written feedback */}
        <div className="rounded-2xl bg-background p-4 sm:p-5">
          <h3 className="text-sm font-semibold tracking-[-0.01em]">Feedback</h3>
          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">
            {answer.feedback}
          </p>
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          <PointList
            title="What you did well"
            icon={Check}
            items={asArray(answer.strengths)}
            emptyText="No strengths were listed for this answer."
          />

          <PointList
            title="Improve next time"
            icon={Lightbulb}
            items={asArray(answer.improvements)}
            emptyText="No improvements were listed for this answer."
          />
        </div>

        {onContinue ? (
          <div className="flex justify-end pt-2">
            <Button
              type="button"
              size="lg"
              onClick={onContinue}
              className="h-12 w-full rounded-full px-7 text-[0.9375rem] sm:w-auto"
            >
              {continueLabel}
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}