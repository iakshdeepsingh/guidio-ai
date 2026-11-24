import { Lightbulb } from "lucide-react";
import { Link } from "react-router";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { asArray } from "./career-utils";

const tile = "rounded-[1.5rem] bg-muted p-3 sm:p-4";

export function CareerInterview({ plan }) {
  const topics = asArray(plan.interviewTopics);
  const firstSkill = asArray(plan.prioritySkills)[0];

  return (
    <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
      {/* Interview topics */}
      <section className={tile}>
        <div className="px-2 pb-4 pt-2 sm:px-3">
          <h2 className="text-xl font-semibold leading-tight tracking-[-0.02em]">
            Interview topics
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Topics to practise for {plan.primaryRole}.
          </p>
        </div>

        <div className="space-y-2">
          <div className="rounded-2xl bg-background p-4 sm:p-5">
            {topics.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                This plan lists no interview topics.
              </p>
            ) : (
              <ol className="space-y-3">
                {topics.map((topic, index) => (
                  <li key={topic} className="flex gap-3 text-sm leading-6">
                    <span
                      aria-hidden="true"
                      className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold tabular-nums"
                    >
                      {index + 1}
                    </span>
                    <span className="min-w-0 break-words pt-0.5 font-medium tracking-[-0.01em]">
                      {topic}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <Link
            to="/mock-interview"
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "lg",
              }),
              "h-12 w-full rounded-full border-foreground/10 bg-background text-[0.9375rem]"
            )}
          >
            Practise a mock interview
          </Link>
        </div>
      </section>

      {/* Advice */}
      <section className={tile}>
        <div className="flex items-start gap-3 px-2 pb-4 pt-2 sm:px-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
            <Lightbulb aria-hidden="true" className="size-[18px]" />
          </span>

          <div className="min-w-0">
            <h2 className="text-xl font-semibold leading-tight tracking-[-0.02em]">
              Advice for you
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              A practical note on your next steps.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="rounded-2xl bg-background p-4 sm:p-5">
            <p className="whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">
              {plan.advice}
            </p>
          </div>

          {firstSkill ? (
            <div className="rounded-2xl bg-foreground p-4 text-background sm:p-5">
              <p className="text-xs font-semibold tracking-tight text-background/60">
                Suggested next action
              </p>
              <p className="mt-1.5 break-words text-sm font-medium leading-6 tracking-[-0.01em]">
                Start with {firstSkill}. Study it a little every day this week
                and build a small project with it.
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}