import { LoaderCircle, Sparkles } from "lucide-react";
import { AiErrorNotice } from "@/components/common/ai-error-notice";
import { AiUsageNotice } from "@/components/common/ai-usage-notice";
import { ErrorState } from "@/components/common/error-state";
import { PageHeader } from "@/components/common/page-header";
import { CardSkeleton, PageSkeleton } from "@/components/common/skeletons";
import { Button } from "@/components/ui/button";
import { CareerPlan } from "@/features/career/career-plan";
import { GeneratingState, NoPlanState } from "@/features/career/career-states";
import { PlanHistory } from "@/features/career/plan-history";
import { ProfileReadinessCard } from "@/features/career/profile-readiness-card";
import { useCareerGuidance } from "@/features/career/use-career-guidance";

function CareerGuidancePage() {
  const career = useCareerGuidance();

  const {
    status,
    loadError,
    profile,
    canGenerate,
    plans,
    activePlan,
    isLoadingPlan,
    planError,
    isGenerating,
    generateError,
    cooldown,
  } = career;

  if (status === "loading") {
    return <PageSkeleton />;
  }

  if (status === "error") {
    return (
      <ErrorState
        title="Unable to load Career Guidance"
        error={loadError}
        onRetry={career.reload}
      />
    );
  }

  const isBusy = isGenerating || isLoadingPlan;

  let generateLabel = activePlan ? "Generate new plan" : "Generate career plan";
  if (isGenerating) generateLabel = "Generating…";
  else if (cooldown.isCoolingDown) generateLabel = `Try again in ${cooldown.remaining}s`;

  return (
    <div className="space-y-8 sm:space-y-10">
      <PageHeader
        title="Career Guidance"
        description="Get a practical roadmap based on your education, skills, interests and career goals."
        actions={
          <Button
            type="button"
            size="lg"
            onClick={career.generatePlan}
            disabled={!canGenerate || isBusy || cooldown.isCoolingDown}
            className="h-12 rounded-full px-6 text-[0.9375rem]"
          >
            {isGenerating ? (
              <LoaderCircle aria-hidden="true" className="animate-spin" />
            ) : (
              <Sparkles aria-hidden="true" />
            )}
            {generateLabel}
          </Button>
        }
      />

      {generateError || planError ? (
        <div className="space-y-3">
          {generateError ? (
            <AiErrorNotice
              error={generateError}
              onRetry={canGenerate ? career.generatePlan : undefined}
              cooldownSeconds={cooldown.remaining}
            />
          ) : null}

          {planError ? (
            <div
              role="alert"
              className="rounded-[1.5rem] bg-destructive/10 p-4 text-sm leading-6 text-destructive sm:p-5"
            >
              {planError}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="grid grid-cols-1 items-start gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-4">
          {isGenerating ? (
            <GeneratingState />
          ) : isLoadingPlan ? (
            <CardSkeleton lines={6} />
          ) : activePlan ? (
            <CareerPlan plan={activePlan} />
          ) : (
            <NoPlanState canGenerate={canGenerate} />
          )}

          <AiUsageNotice variant="inline" />
        </div>

        <div className="min-w-0 space-y-3 sm:space-y-4 xl:sticky xl:top-20">
          <ProfileReadinessCard profile={profile} canGenerate={canGenerate} />

          <PlanHistory
            plans={plans}
            activeId={activePlan?.id}
            disabled={isBusy}
            onSelect={career.selectPlan}
          />
        </div>
      </div>
    </div>
  );
}

export default CareerGuidancePage;