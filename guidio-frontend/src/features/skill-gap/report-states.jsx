import { LoaderCircle, TrendingUp } from "lucide-react";

const tile =
  "flex flex-col items-center justify-center gap-5 rounded-[1.75rem] bg-muted px-6 py-12 text-center sm:rounded-[2rem] sm:py-16";

export function AnalyzingState() {
  return (
    <div role="status" aria-live="polite" className={tile}>
      <span
        aria-hidden="true"
        className="flex size-12 items-center justify-center rounded-full bg-foreground text-background"
      >
        <LoaderCircle className="size-5 animate-spin" />
      </span>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold leading-tight tracking-[-0.02em] sm:text-2xl">
          Analyzing your skill gap
        </h2>
        <p className="mx-auto max-w-md text-[0.9375rem] font-medium leading-snug tracking-[-0.01em] text-muted-foreground">
          Guidio AI is comparing your saved skills with your target role. This
          can take a little while, so please keep this page open.
        </p>
      </div>
    </div>
  );
}

export function NoReportState({ canAnalyze }) {
  return (
    <div className={tile}>
      <span
        aria-hidden="true"
        className="flex size-12 items-center justify-center rounded-full bg-foreground text-background"
      >
        <TrendingUp className="size-5" />
      </span>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold leading-tight tracking-[-0.02em] sm:text-2xl">
          No analysis yet
        </h2>

        <p className="mx-auto max-w-md text-[0.9375rem] font-medium leading-snug tracking-[-0.01em] text-muted-foreground">
          {canAnalyze
            ? "Run your first analysis to see your skill match, missing skills, a learning plan and project ideas for your target role."
            : "Add a target role and at least one skill to your profile first. Then you can run your first analysis."}
        </p>
      </div>
    </div>
  );
}