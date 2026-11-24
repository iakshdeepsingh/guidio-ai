import { LoaderCircle, Sparkles } from "lucide-react";
import { AiErrorNotice } from "@/components/common/ai-error-notice";
import { AiUsageNotice } from "@/components/common/ai-usage-notice";
import { ErrorState } from "@/components/common/error-state";
import { PageHeader } from "@/components/common/page-header";
import { CardSkeleton, PageSkeleton } from "@/components/common/skeletons";
import { Button } from "@/components/ui/button";
import { ProfileInputsCard } from "@/features/skill-gap/profile-inputs-card";
import { ReportHistory } from "@/features/skill-gap/report-history";
import { AnalyzingState, NoReportState } from "@/features/skill-gap/report-states";
import { SkillGapReport } from "@/features/skill-gap/skill-gap-report";
import { useSkillGap } from "@/features/skill-gap/use-skill-gap";

function SkillGapPage() {
  const skillGap = useSkillGap();

  const {
    status,
    loadError,
    profile,
    canAnalyze,
    reports,
    activeReport,
    isLoadingReport,
    reportError,
    isGenerating,
    generateError,
    cooldown,
  } = skillGap;

  if (status === "loading") {
    return <PageSkeleton />;
  }

  if (status === "error") {
    return (
      <ErrorState
        title="Unable to load Skill Gap Analysis"
        error={loadError}
        onRetry={skillGap.reload}
      />
    );
  }

  const isBusy = isGenerating || isLoadingReport;

  let analyzeLabel = activeReport ? "Analyze again" : "Analyze skill gap";
  if (isGenerating) analyzeLabel = "Analyzing…";
  else if (cooldown.isCoolingDown) analyzeLabel = `Try again in ${cooldown.remaining}s`;

  return (
    <div className="space-y-8 sm:space-y-10">
      <PageHeader
        title="Skill Gap Analysis"
        description="Compare the skills you have with your target role, then follow a clear plan to close the gap."
        actions={
          <Button
            type="button"
            size="lg"
            onClick={skillGap.generateReport}
            disabled={!canAnalyze || isBusy || cooldown.isCoolingDown}
            className="h-12 rounded-full px-6 text-[0.9375rem]"
          >
            {isGenerating ? (
              <LoaderCircle aria-hidden="true" className="animate-spin" />
            ) : (
              <Sparkles aria-hidden="true" />
            )}
            {analyzeLabel}
          </Button>
        }
      />

      {generateError || reportError ? (
        <div className="space-y-3">
          {generateError ? (
            <AiErrorNotice
              error={generateError}
              onRetry={canAnalyze ? skillGap.generateReport : undefined}
              cooldownSeconds={cooldown.remaining}
            />
          ) : null}

          {reportError ? (
            <div
              role="alert"
              className="rounded-[1.5rem] bg-destructive/10 p-4 text-sm leading-6 text-destructive sm:p-5"
            >
              {reportError}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="grid grid-cols-1 items-start gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-4">
          {isGenerating ? (
            <AnalyzingState />
          ) : isLoadingReport ? (
            <CardSkeleton lines={6} />
          ) : activeReport ? (
            <SkillGapReport report={activeReport} />
          ) : (
            <NoReportState canAnalyze={canAnalyze} />
          )}

          <AiUsageNotice variant="inline" />
        </div>

        <div className="min-w-0 space-y-3 sm:space-y-4 xl:sticky xl:top-20">
          <ProfileInputsCard profile={profile} canAnalyze={canAnalyze} />

          <ReportHistory
            reports={reports}
            activeId={activeReport?.id}
            disabled={isBusy}
            onSelect={skillGap.selectReport}
          />
        </div>
      </div>
    </div>
  );
}

export default SkillGapPage;