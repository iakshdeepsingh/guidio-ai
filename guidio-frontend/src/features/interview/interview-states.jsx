import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Shown when an interview is still "in progress" but has no open question.
 * The server saves each answer before the AI prepares the next question, so
 * if the AI fails in between (for example at its free limit) the interview
 * cannot continue from the website. The saved answers can still be reviewed.
 */
export function StalledState({ hasAnswers, onNew }) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-5 rounded-[1.75rem] bg-muted px-6 py-12 text-center sm:rounded-[2rem] sm:py-14"
    >
      <span
        aria-hidden="true"
        className="flex size-12 items-center justify-center rounded-full bg-foreground text-background"
      >
        <TriangleAlert className="size-5" />
      </span>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold leading-tight tracking-[-0.02em] sm:text-2xl">
          This interview cannot continue
        </h2>

        <p className="mx-auto max-w-md text-[0.9375rem] font-medium leading-snug tracking-[-0.01em] text-muted-foreground">
          {hasAnswers
            ? "Your answers were saved, but the next step could not be prepared. This can happen when the free AI limit is reached. Select a numbered question above to review your feedback, or start a new interview."
            : "The first question could not be prepared, so nothing was saved for this interview. This can happen when the free AI limit is reached. Please start a new interview."}
        </p>
      </div>

      <Button
        type="button"
        onClick={onNew}
        className="h-12 rounded-full px-7 text-[0.9375rem]"
      >
        Start a new interview
      </Button>
    </div>
  );
}