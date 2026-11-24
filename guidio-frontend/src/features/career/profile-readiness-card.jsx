import { Check, Minus } from "lucide-react";
import { Link } from "react-router";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getProfileChecks } from "./career-utils";

/**
 * The plan is built by the server from the saved profile, so this checklist
 * shows exactly what the server will read.
 */
export function ProfileReadinessCard({ profile, canGenerate }) {
  const checks = getProfileChecks(profile);
  const doneCount = checks.filter((check) => check.done).length;

  return (
    <section className="rounded-[1.5rem] bg-muted p-3 sm:p-4">
      <div className="px-2 pb-4 pt-2 sm:px-3">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-xl font-semibold leading-tight tracking-[-0.02em]">
            Profile checklist
          </h2>

          <span className="shrink-0 rounded-full bg-background px-2.5 py-1 text-[0.6875rem] font-semibold tabular-nums text-muted-foreground">
            {doneCount}/{checks.length}
          </span>
        </div>

        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {doneCount} of {checks.length} ready. The plan is built from your
          saved profile.
        </p>
      </div>

      <div className="space-y-2">
        <ul className="space-y-1 rounded-2xl bg-background p-2">
          {checks.map((check) => (
            <li
              key={check.key}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                  check.done
                    ? "border-foreground bg-foreground text-background"
                    : "border-foreground/15 text-muted-foreground"
                )}
              >
                {check.done ? (
                  <Check className="size-3" />
                ) : (
                  <Minus className="size-3" />
                )}
              </span>

              <span
                className={cn(
                  "min-w-0 break-words tracking-[-0.01em]",
                  check.done
                    ? "font-medium"
                    : "font-normal text-muted-foreground"
                )}
              >
                {check.label}
              </span>

              <span className="sr-only">
                {check.done ? "(done)" : "(missing)"}
              </span>
            </li>
          ))}
        </ul>

        <Link
          to="/profile"
          className={cn(
            buttonVariants({
              variant: canGenerate ? "outline" : "default",
              size: "lg",
            }),
            "h-12 w-full rounded-full text-[0.9375rem]",
            canGenerate && "border-foreground/10 bg-background"
          )}
        >
          {canGenerate ? "Edit profile" : "Complete your profile"}
        </Link>
      </div>
    </section>
  );
}