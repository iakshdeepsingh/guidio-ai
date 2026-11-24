import { useMemo } from "react";
import { useUser } from "@clerk/react";
import { ArrowRight, BarChart3, BrainCircuit, Mic, Target } from "lucide-react";
import { Link } from "react-router";
import { AiUsageNotice } from "@/components/common/ai-usage-notice";
import { ErrorState } from "@/components/common/error-state";
import { PageHeader } from "@/components/common/page-header";
import { PageSkeleton } from "@/components/common/skeletons";
import { StatCard } from "@/components/common/stat-card";
import { buttonVariants } from "@/components/ui/button";
import {
  getReadinessScore,
  normalizeDashboard,
} from "@/features/dashboard/dashboard-utils";
import { LatestResultsCard } from "@/features/dashboard/latest-results-card";
import { NextStepsCard } from "@/features/dashboard/next-steps-card";
import { ProfileCompletionCard } from "@/features/dashboard/profile-completion-card";
import { QuickActionsCard } from "@/features/dashboard/quick-actions-card";
import { ReadinessCard } from "@/features/dashboard/readiness-card";
import { RecentActivityCard } from "@/features/dashboard/recent-activity-card";
import { useDashboard } from "@/features/dashboard/use-dashboard";
import { cn } from "@/lib/utils";

const pillButton = "h-12 rounded-full px-6 text-[0.9375rem]";

function DashboardPage() {
  const { user } = useUser();
  const { status, data, error, reload } = useDashboard();

  const dashboard = useMemo(() => normalizeDashboard(data), [data]);

  if (status === "loading") {
    return <PageSkeleton />;
  }

  if (status === "error") {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Dashboard"
          description="Your progress and recent activity."
        />
        <ErrorState
          title="Could not load your dashboard"
          error={error}
          onRetry={reload}
        />
      </div>
    );
  }

  const { profile, metrics, latest, activities } = dashboard;

  const firstName = user?.firstName || "there";
  const isNewStudent =
    profile.completion === 0 &&
    metrics.interviewsTaken === 0 &&
    activities.length === 0;
  const needsProfile = profile.completion < 100;

  const interviewHint =
    metrics.interviewsTaken === 0
      ? "Start your first mock interview"
      : `${metrics.completedInterviews} completed`;

  return (
    <div className="space-y-8 sm:space-y-10">
      <PageHeader
        title={isNewStudent ? `Welcome, ${firstName}` : `Welcome back, ${firstName}`}
        description={
          isNewStudent
            ? "Let's set up your profile so Guidio AI can guide you."
            : "Here is your progress and what to do next."
        }
        actions={
          <Link
            to={needsProfile ? "/onboarding" : "/assistant"}
            className={cn(buttonVariants({ size: "lg" }), pillButton)}
          >
            {needsProfile ? "Complete profile" : "Ask AI Assistant"}
            <ArrowRight aria-hidden="true" />
          </Link>
        }
      />

      {/* Key numbers. An em dash means there is no real data yet. */}
      <section
        aria-label="Key numbers"
        className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4"
      >
        <StatCard
          label="Skill match"
          icon={BarChart3}
          value={metrics.skillMatch === null ? null : `${metrics.skillMatch}%`}
          hint={
            latest.skillGapReport?.targetRole
              ? `For ${latest.skillGapReport.targetRole}`
              : "Run a skill gap analysis"
          }
        />

        <StatCard
          label="Mock interviews"
          icon={Mic}
          value={metrics.interviewsTaken}
          hint={interviewHint}
        />

        <StatCard
          label="Average interview score"
          icon={Target}
          value={
            metrics.averageInterviewScore === null
              ? null
              : `${metrics.averageInterviewScore}/100`
          }
          hint={
            metrics.completedInterviews > 0
              ? `From ${metrics.completedInterviews} completed`
              : "Complete an interview to see this"
          }
        />

        <StatCard
          label="Questions asked"
          icon={BrainCircuit}
          value={metrics.doubtsAsked}
          hint="Messages sent to the AI Assistant"
        />
      </section>

      <section className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ReadinessCard score={getReadinessScore(dashboard)} />
        <ProfileCompletionCard profile={profile} />
        <div className="min-w-0 md:col-span-2 xl:col-span-1 [&>*]:h-full">
          <NextStepsCard dashboard={dashboard} />
        </div>
      </section>

      <section className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        <LatestResultsCard latest={latest} />
        <RecentActivityCard activities={activities} />
      </section>

      <QuickActionsCard />

      <AiUsageNotice variant="card" />
    </div>
  );
}

export default DashboardPage;