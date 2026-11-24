import { LoaderCircle, Sparkles } from "lucide-react";
import { AiErrorNotice } from "@/components/common/ai-error-notice";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ANSWER_MAX_LENGTH, ANSWER_MIN_LENGTH } from "./interview-utils";

export function AnswerComposer({
  value,
  onChange,
  onSubmit,
  isSubmitting,
  submitError,
  cooldown,
}) {
  const tooShort = value.trim().length < ANSWER_MIN_LENGTH;

  let buttonLabel = "Submit answer";
  if (isSubmitting) buttonLabel = "Evaluating…";
  else if (cooldown.isCoolingDown) buttonLabel = `Try again in ${cooldown.remaining}s`;

  return (
    <section className="rounded-[1.5rem] bg-muted p-3 sm:p-4">
      <div className="px-2 pb-4 pt-2 sm:px-3">
        <h2 className="text-xl font-semibold leading-tight tracking-[-0.02em]">
          Your answer
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Explain your thinking in your own words and add an example where it
          helps.
        </p>
      </div>

      <div className="space-y-2">
        <div className="space-y-2 rounded-2xl bg-background p-3 sm:p-4">
          <Label htmlFor="interview-answer" className="sr-only">
            Your answer
          </Label>

          <Textarea
            id="interview-answer"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Write your answer here…"
            maxLength={ANSWER_MAX_LENGTH}
            aria-describedby="interview-answer-count"
            disabled={isSubmitting}
            className="max-h-96 min-h-48 resize-y border-0 bg-transparent p-1 text-base leading-6 shadow-none focus-visible:ring-0 sm:text-[15px]"
          />

          <p
            id="interview-answer-count"
            className="border-t border-foreground/10 pt-2.5 text-xs tabular-nums text-muted-foreground"
          >
            {value.length}/{ANSWER_MAX_LENGTH} characters
            {tooShort ? ` · at least ${ANSWER_MIN_LENGTH} needed` : ""}
          </p>
        </div>

        {isSubmitting ? (
          <p
            role="status"
            aria-live="polite"
            className="rounded-2xl bg-background p-4 text-sm leading-6 text-muted-foreground"
          >
            Guidio AI is scoring your answer and getting the next step ready.
            This can take a little while, so please keep this page open.
          </p>
        ) : null}

        {submitError ? (
          <AiErrorNotice
            error={submitError}
            onRetry={onSubmit}
            cooldownSeconds={cooldown.remaining}
            className="bg-background"
          />
        ) : null}

        <Button
          type="button"
          size="lg"
          onClick={onSubmit}
          disabled={tooShort || isSubmitting || cooldown.isCoolingDown}
          className="h-12 w-full rounded-full px-7 text-[0.9375rem] sm:w-auto"
        >
          {isSubmitting ? (
            <LoaderCircle aria-hidden="true" className="animate-spin" />
          ) : (
            <Sparkles aria-hidden="true" />
          )}
          {buttonLabel}
        </Button>
      </div>
    </section>
  );
}