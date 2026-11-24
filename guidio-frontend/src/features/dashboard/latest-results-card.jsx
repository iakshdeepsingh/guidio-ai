import { ArrowUpRight, BarChart3, BriefcaseBusiness, Mic } from "lucide-react";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import {
  formatDate,
  getInterviewStatusLabel,
} from "@/features/dashboard/dashboard-utils";

function ResultItem({ icon: Icon, label, emptyText, href, linkLabel, children }) {
  return (
    <li className="flex items-start gap-3 rounded-2xl bg-background p-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
        <Icon aria-hidden="true" className="size-[18px]" />
      </span>

      <div className="min-w-0 flex-1 space-y-1.5">
        <p className="text-xs font-semibold tracking-tight text-muted-foreground">
          {label}
        </p>

        {children ?? (
          <p className="text-sm leading-6 text-muted-foreground">{emptyText}</p>
        )}

        <Link
          to={href}
          className="group inline-flex items-center gap-0.5 pt-0.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          {linkLabel}
          <ArrowUpRight
            aria-hidden="true"
            className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </li>
  );
}

function Meta({ children }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
      {children}
    </div>
  );
}

/** `latest` is the normalised latest object from normalizeDashboard(). */
export function LatestResultsCard({ latest }) {
  const { skillGapReport, careerPlan, interview } = latest;
  const interviewDone = interview?.status === "COMPLETED";

  return (
    <section className="min-w-0 rounded-[1.5rem] bg-muted p-3 sm:p-4">
      <div className="px-2 pb-4 pt-2 sm:px-3">
        <h2 className="text-xl font-semibold leading-tight tracking-[-0.02em]">
          Latest results
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Your most recent skill gap report, career plan and mock interview.
        </p>
      </div>

      <ul className="space-y-2">
        <ResultItem
          icon={BarChart3}
          label="Skill gap"
          emptyText="No skill gap analysis yet."
          href="/skill-gap"
          linkLabel={skillGapReport ? "Open skill gap" : "Run analysis"}
        >
          {skillGapReport ? (
            <>
              <p className="break-words text-sm font-semibold tracking-tight">
                {skillGapReport.targetRole || "Target role"}
              </p>
              <Meta>
                <span>{skillGapReport.matchPercentage}% match</span>
                <span>{formatDate(skillGapReport.createdAt)}</span>
              </Meta>
            </>
          ) : null}
        </ResultItem>

        <ResultItem
          icon={BriefcaseBusiness}
          label="Career plan"
          emptyText="No career roadmap yet."
          href="/career-guidance"
          linkLabel={careerPlan ? "Open career guidance" : "Generate roadmap"}
        >
          {careerPlan ? (
            <>
              <p className="break-words text-sm font-semibold tracking-tight">
                {careerPlan.primaryRole || "Recommended role"}
              </p>
              <Meta>
                <span>Plan readiness {careerPlan.readinessScore}/100</span>
                <span>{formatDate(careerPlan.createdAt)}</span>
              </Meta>
            </>
          ) : null}
        </ResultItem>

        <ResultItem
          icon={Mic}
          label="Mock interview"
          emptyText="No mock interviews yet."
          href="/mock-interview"
          linkLabel={
            interview && !interviewDone ? "Continue practice" : "Open mock interview"
          }
        >
          {interview ? (
            <>
              <p className="break-words text-sm font-semibold tracking-tight">
                {interview.targetRole || "Mock interview"}
              </p>
              <Meta>
                <Badge variant={interviewDone ? "secondary" : "outline"}>
                  {getInterviewStatusLabel(interview.status)}
                </Badge>
                {typeof interview.overallScore === "number" ? (
                  <span>Score {interview.overallScore}/100</span>
                ) : null}
                <span>{formatDate(interview.createdAt)}</span>
              </Meta>
            </>
          ) : null}
        </ResultItem>
      </ul>
    </section>
  );
}