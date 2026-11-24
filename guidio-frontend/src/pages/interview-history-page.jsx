import { Mic } from "lucide-react";
import { Link, useParams } from "react-router";
import { ErrorState } from "@/components/common/error-state";
import { PageHeader } from "@/components/common/page-header";
import { PageSkeleton } from "@/components/common/skeletons";
import { buttonVariants } from "@/components/ui/button";
import { HistoryDetail } from "@/features/interview/history-detail";
import { HistoryList } from "@/features/interview/history-list";
import { HistoryOverview } from "@/features/interview/history-overview";
import { useInterviewHistory } from "@/features/interview/use-interview-history";
import { cn } from "@/lib/utils";

function HistoryIndex() {
  const { status, error, interviews, reload } = useInterviewHistory();

  if (status === "loading") {
    return <PageSkeleton />;
  }

  if (status === "error") {
    return (
      <ErrorState
        title="Unable to load your interview history"
        error={error}
        onRetry={reload}
      />
    );
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      <PageHeader
        title="Interview History"
        description="Review your past mock interviews, scores, feedback and improvement plans."
        actions={
          <Link
            to="/mock-interview"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-12 rounded-full px-6 text-[0.9375rem]"
            )}
          >
            <Mic aria-hidden="true" />
            New interview
          </Link>
        }
      />

      {interviews.length > 0 ? <HistoryOverview interviews={interviews} /> : null}

      <HistoryList interviews={interviews} />
    </div>
  );
}

function InterviewHistoryPage() {
  const { id } = useParams();

  return id ? <HistoryDetail key={id} id={id} /> : <HistoryIndex />;
}

export default InterviewHistoryPage;