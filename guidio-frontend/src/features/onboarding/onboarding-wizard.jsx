import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, Check, Clock, LoaderCircle, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STEPS } from "@/features/onboarding/onboarding-data";
import { OnboardingProgress } from "@/features/onboarding/onboarding-progress";
import {
  AcademicsStep,
  BasicsStep,
  DirectionStep,
  SkillsStep,
} from "@/features/onboarding/onboarding-steps";
import { cn } from "@/lib/utils";

const STEP_COMPONENTS = {
  basics: BasicsStep,
  academics: AcademicsStep,
  skills: SkillsStep,
  direction: DirectionStep,
};

/**
 * The multi-step form. It owns no data: the page passes the answers,
 * the validation errors and the handlers.
 */
export function OnboardingWizard({
  stepIndex,
  form,
  errors,
  onChange,
  onNext,
  onBack,
  isSaving,
  saveError,
  cooldownSeconds,
}) {
  const headingRef = useRef(null);
  const step = STEPS[stepIndex];
  const StepComponent = STEP_COMPONENTS[step.id];
  const isLast = stepIndex === STEPS.length - 1;
  const isWaiting = cooldownSeconds > 0;
  const isRateLimited = saveError?.code === "rate_limited";

  // Move keyboard and screen-reader focus to the new step title.
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [stepIndex]);

  let nextLabel = isLast ? "Finish" : "Save and continue";

  if (isWaiting) {
    nextLabel = `Try again in ${cooldownSeconds}s`;
  }

  return (
    <div className="space-y-6">
      <OnboardingProgress steps={STEPS} currentIndex={stepIndex} />

      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          onNext();
        }}
        className="rounded-[1.5rem] bg-muted p-3 sm:rounded-[2rem] sm:p-4"
      >
        <div className="px-2 pb-5 pt-3 sm:px-4 sm:pt-4">
          {/* key replays the fade each time the step changes */}
          <div
            key={step.id}
            className="animate-in fade-in slide-in-from-bottom-2 space-y-2 duration-500 motion-reduce:animate-none"
          >
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.035em] outline-none sm:text-4xl"
            >
              {step.title}
            </h1>
            <p className="text-[0.9375rem] font-medium leading-snug tracking-[-0.01em] text-muted-foreground sm:text-lg">
              {step.description}
            </p>
          </div>
        </div>

        {/* The fields sit on a white block */}
        <div
          key={`fields-${step.id}`}
          className="animate-in fade-in slide-in-from-bottom-2 rounded-2xl bg-background p-4 duration-500 motion-reduce:animate-none sm:rounded-[1.5rem] sm:p-8"
        >
          <StepComponent
            form={form}
            errors={errors}
            onChange={onChange}
            disabled={isSaving}
          />
        </div>

        {saveError ? (
          <div
            role="alert"
            className={cn(
              "mt-2 flex items-start gap-3.5 rounded-2xl p-4 sm:p-5",
              isRateLimited ? "bg-background" : "bg-destructive/10"
            )}
          >
            <span
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-full",
                isRateLimited
                  ? "bg-foreground text-background"
                  : "bg-destructive text-white"
              )}
            >
              {isRateLimited ? (
                <Clock aria-hidden="true" className="size-[18px]" />
              ) : (
                <TriangleAlert aria-hidden="true" className="size-[18px]" />
              )}
            </span>

            <div className="min-w-0 space-y-1">
              <p className="text-base font-semibold leading-tight tracking-[-0.02em]">
                {isRateLimited ? "Please wait a moment" : "We could not save this step"}
              </p>
              <p className="text-sm leading-6 text-muted-foreground">
                {saveError.message}
              </p>
              <p className="text-sm leading-6 text-muted-foreground">
                Your answers are still here. Nothing was lost.
              </p>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col-reverse gap-2 px-0 pb-1 pt-3 sm:flex-row sm:items-center sm:justify-between sm:px-1 sm:pt-4">
          {stepIndex > 0 ? (
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={isSaving}
              className="h-12 rounded-full border-foreground/10 bg-background px-6 text-[0.9375rem]"
            >
              <ArrowLeft aria-hidden="true" />
              Previous
            </Button>
          ) : null}

          <Button
            type="submit"
            disabled={isSaving || isWaiting}
            className="h-12 rounded-full px-7 text-[0.9375rem] sm:ml-auto"
          >
            {isSaving ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : null}
            {isSaving ? "Saving..." : nextLabel}
            {!isSaving && !isWaiting ? (
              isLast ? <Check aria-hidden="true" /> : <ArrowRight aria-hidden="true" />
            ) : null}
          </Button>
        </div>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        Your progress is saved to your account each time you continue.
      </p>
    </div>
  );
}