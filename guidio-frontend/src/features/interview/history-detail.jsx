import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { ErrorState } from "@/components/common/error-state";
import { CardSkeleton } from "@/components/common/skeletons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { InterviewResult } from "./interview-result";
import { formatDate } from "./interview-utils";
import { useInterviewDetail } from "./use-interview-detail";

function BackLink() {
  return (
    <Link
      to="/interview-history"
      className="group inline-flex items-center gap-1.5 rounded-full text-sm font-medium tracking-[-0.01em] text-primary outline-none hover:underline hover:underline-offset-4 focus-visible:ring-2 focus-visible:ring-ring/60"
    >
      <ArrowLeft
        aria-hidden="true"
        className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5"
      />
      All interviews
    </Link>
  );
}

function UnfinishedInterview({ interview }) {
  const date = formatDate(interview.createdAt);

  return (
    <section className="rounded-[1.5rem] bg-muted p-3 sm:p-4">
      <div className="space-y-4 rounded-2xl bg-background p-5 sm:p-8">
        <div className="space-y-3">
          <span className="inline-flex rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
            In progress
          </span>

          <h2 className="break-words text-2xl font-semibold leading-[1.1] tracking-[-0.03em] sm:text-4xl">
            {interview.targetRole} interview
          </h2>

          <p className="text-sm text-muted-foreground">
            {interview.interviewType} · {interview.difficulty}
            {date ? ` · ${date}` : ""}
          </p>
        </div>

        <p className="max-w-2xl text-[0.9375rem] font-medium leading-snug tracking-[-0.01em] text-muted-foreground">
          This interview is not finished, so it has no final score yet. Open
          Mock Interview and choose it from your history to continue or to
          review the answers you have already given.
        </p>

        <Link
          to="/mock-interview"
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-12 w-full rounded-full px-7 text-[0.9375rem] sm:w-auto"
          )}
        >
          Go to Mock Interview
        </Link>
      </div>
    </section>
  );
}

/** One interview. The page gives it key={id} so the state resets per interview. */
export function HistoryDetail({ id }) {
  const detail = useInterviewDetail(id);
  const navigate = useNavigate();
  const { status, error, interview } = detail;

  let content;

  if (status === "loading") {
    content = <CardSkeleton lines={8} />;
  } else if (status === "error") {
    const notFound = error?.code === "not_found";

    content = (
      <ErrorState
        title={notFound ? "Interview not found" : "Unable to load this interview"}
        error={error}
        onRetry={notFound ? undefined : detail.reload}
      />
    );
  } else if (interview.status === "COMPLETED") {
    content = (
      <InterviewResult
        interview={interview}
        onNew={() => navigate("/mock-interview")}
        onRefresh={detail.refresh}
        isRefreshing={detail.isRefreshing}
        refreshError={detail.refreshError}
      />
    );
  } else {
    content = <UnfinishedInterview interview={interview} />;
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <BackLink />
      <div className="max-w-4xl">{content}</div>
    </div>
  );
}