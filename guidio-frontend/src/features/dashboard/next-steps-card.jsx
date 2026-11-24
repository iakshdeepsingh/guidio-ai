import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router";
import { getNextSteps } from "@/features/dashboard/dashboard-utils";

/**
 * A short checklist based on what the student has already done.
 * It is rule-based, not AI-generated, and says so.
 */
export function NextStepsCard({ dashboard }) {
  const steps = getNextSteps(dashboard);

  return (
    <section className="min-w-0 rounded-[1.5rem] bg-muted p-3 sm:p-4">
      <div className="px-2 pb-4 pt-2 sm:px-3">
        <h2 className="text-xl font-semibold leading-tight tracking-[-0.02em]">
          Recommended next steps
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Based on your activity so far. This is a checklist, not AI advice.
        </p>
      </div>

      {steps.length > 0 ? (
        <ul className="space-y-2">
          {steps.map(({ id, title, description, href, icon: Icon }, index) => (
            <li key={id}>
              <Link
                to={href}
                className="group flex items-center gap-3 rounded-2xl bg-background p-4 outline-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-24px] hover:shadow-foreground/40 focus-visible:ring-2 focus-visible:ring-ring/60"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-transform duration-300 group-hover:scale-105">
                  <Icon aria-hidden="true" className="size-[18px]" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-[0.6875rem] font-semibold tabular-nums tracking-tight text-muted-foreground">
                    Step {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="block truncate text-sm font-semibold tracking-tight">
                    {title}
                  </span>
                  <span className="block text-xs leading-5 text-muted-foreground">
                    {description}
                  </span>
                </span>

                <ArrowRight
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-foreground"
                />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex items-start gap-3 rounded-2xl bg-background p-4">
          <CheckCircle2
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0 text-success"
          />
          <p className="text-sm leading-6 text-muted-foreground">
            You have covered the basics. Keep practising with mock interviews
            and re-run your skill gap analysis as you learn.
          </p>
        </div>
      )}
    </section>
  );
}