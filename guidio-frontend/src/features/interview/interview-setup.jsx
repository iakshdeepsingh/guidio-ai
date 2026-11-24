import { LoaderCircle, Play } from "lucide-react";
import { AiErrorNotice } from "@/components/common/ai-error-notice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChoiceGroup } from "@/features/onboarding/choice-group";
import {
  DIFFICULTIES,
  INTERVIEW_TYPES,
  QUESTION_COUNT,
  ROLE_MAX_LENGTH,
} from "./interview-utils";

const labelClass = "text-sm font-semibold leading-none tracking-[-0.01em]";

export function InterviewSetup({
  setup,
  onChange,
  canStart,
  profileRole,
  onStart,
  isStarting,
  startError,
  cooldown,
}) {
  const showProfileRole =
    Boolean(profileRole) && profileRole.trim() !== setup.targetRole.trim();

  let buttonLabel = "Start interview";
  if (isStarting) buttonLabel = "Preparing your first question…";
  else if (cooldown.isCoolingDown) buttonLabel = `Try again in ${cooldown.remaining}s`;

  function handleSubmit(event) {
    event.preventDefault();
    onStart();
  }

  return (
    <section className="rounded-[1.5rem] bg-muted p-3 sm:rounded-[2rem] sm:p-4">
      <div className="px-2 pb-5 pt-3 sm:px-4 sm:pt-4">
        <h2 className="text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.035em] sm:text-4xl">
          Set up your interview
        </h2>
        <p className="mt-2 text-[0.9375rem] font-medium leading-snug tracking-[-0.01em] text-muted-foreground sm:text-lg">
          Choose the type, role and difficulty. Guidio AI will ask you{" "}
          {QUESTION_COUNT} questions and score each answer.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="space-y-7 rounded-2xl bg-background p-4 sm:rounded-[1.5rem] sm:p-8">
          <div className="space-y-2.5">
            <p id="interview-type-label" className={labelClass}>
              Interview type
            </p>

            <ChoiceGroup
              name="interviewType"
              aria-labelledby="interview-type-label"
              value={setup.interviewType}
              onChange={(value) => onChange("interviewType", value)}
              options={INTERVIEW_TYPES}
              disabled={isStarting}
              className="sm:grid-cols-3"
            />
          </div>

          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label htmlFor="interview-role" className={labelClass}>
                Target role
              </Label>

              {showProfileRole ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onChange("targetRole", profileRole)}
                  disabled={isStarting}
                  className="h-8 rounded-full bg-muted px-3.5 text-xs"
                >
                  Use my profile role
                </Button>
              ) : null}
            </div>

            <Input
              id="interview-role"
              value={setup.targetRole}
              onChange={(event) => onChange("targetRole", event.target.value)}
              placeholder="e.g. Staff Nurse, Accountant or Software Engineer"
              maxLength={ROLE_MAX_LENGTH}
              autoComplete="off"
              disabled={isStarting}
              className="h-11"
            />

            <p className="text-xs leading-5 text-muted-foreground">
              A specific role gives you more relevant questions.
            </p>
          </div>

          <div className="space-y-2.5">
            <p id="interview-difficulty-label" className={labelClass}>
              Difficulty
            </p>

            <ChoiceGroup
              name="difficulty"
              aria-labelledby="interview-difficulty-label"
              value={setup.difficulty}
              onChange={(value) => onChange("difficulty", value)}
              options={DIFFICULTIES}
              disabled={isStarting}
              className="sm:grid-cols-3"
            />
          </div>
        </div>

        {/* What to expect */}
        <ul className="space-y-2 rounded-2xl bg-background p-4 text-sm leading-6 text-muted-foreground sm:p-5">
          {[
            `${QUESTION_COUNT} questions, one at a time.`,
            "Scores and feedback after every answer.",
            "A final score, strengths and an improvement plan at the end.",
          ].map((item) => (
            <li key={item} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-2.5 size-1 shrink-0 rounded-full bg-foreground/30"
              />
              <span className="min-w-0">{item}</span>
            </li>
          ))}
        </ul>

        {startError ? (
          <AiErrorNotice
            error={startError}
            onRetry={canStart ? onStart : undefined}
            cooldownSeconds={cooldown.remaining}
            className="bg-background"
          />
        ) : null}

        <div className="pt-2">
          <Button
            type="submit"
            size="lg"
            disabled={!canStart || isStarting || cooldown.isCoolingDown}
            className="h-auto min-h-12 w-full whitespace-normal rounded-full px-7 py-2.5 text-[0.9375rem] sm:w-auto"
          >
            {isStarting ? (
              <LoaderCircle aria-hidden="true" className="animate-spin" />
            ) : (
              <Play aria-hidden="true" />
            )}
            {buttonLabel}
          </Button>
        </div>
      </form>
    </section>
  );
}