import { Compass, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const tile =
  "flex flex-col items-center justify-center gap-5 rounded-[1.75rem] bg-muted px-6 py-12 text-center sm:rounded-[2rem] sm:py-16";

export function GeneratingState() {
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
          Building your career plan
        </h2>
        <p className="mx-auto max-w-md text-[0.9375rem] font-medium leading-snug tracking-[-0.01em] text-muted-foreground">
          Guidio AI is reading your saved profile and writing a roadmap. This
          can take a little while, so please keep this page open.
        </p>
      </div>
    </div>
  );
}

export function NoPlanState({ canGenerate }) {
  return (
    <div className={cn(tile)}>
      <span
        aria-hidden="true"
        className="flex size-12 items-center justify-center rounded-full bg-foreground text-background"
      >
        <Compass className="size-5" />
      </span>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold leading-tight tracking-[-0.02em] sm:text-2xl">
          No career plan yet
        </h2>

        <p className="mx-auto max-w-md text-[0.9375rem] font-medium leading-snug tracking-[-0.01em] text-muted-foreground">
          {canGenerate
            ? "Generate your first plan to see a recommended role, the skills to learn, a step-by-step roadmap, project ideas and interview topics."
            : "Complete the items on the right in your profile first. Then you can generate your first career plan."}
        </p>
      </div>
    </div>
  );
}