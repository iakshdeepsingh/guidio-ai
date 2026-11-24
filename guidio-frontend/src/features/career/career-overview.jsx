import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { asArray } from "./career-utils";
import { ReadinessGauge } from "./readiness-gauge";

const tile = "rounded-[1.5rem] bg-muted p-3 sm:p-4";

function TileHeader({ title, description }) {
  return (
    <div className="px-2 pb-4 pt-2 sm:px-3">
      <h2 className="text-xl font-semibold leading-tight tracking-[-0.02em]">
        {title}
      </h2>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

export function CareerOverview({ plan }) {
  const alternativeRoles = asArray(plan.alternativeRoles);
  const strengths = asArray(plan.strengths);
  const prioritySkills = asArray(plan.prioritySkills);

  const showTargetRole =
    plan.targetRole && plan.targetRole !== plan.primaryRole;

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Recommended role */}
      <section className={tile}>
        <div className="flex flex-col items-center gap-6 rounded-2xl bg-background p-5 sm:flex-row sm:p-8">
          <ReadinessGauge value={plan.readinessScore} />

          <div className="min-w-0 space-y-3 text-center sm:text-left">
            <div className="space-y-2">
              <Badge variant="outline">Recommended role</Badge>
              <h2 className="break-words text-2xl font-semibold leading-[1.1] tracking-[-0.03em] sm:text-4xl">
                {plan.primaryRole}
              </h2>
              {showTargetRole ? (
                <p className="break-words text-xs text-muted-foreground">
                  Your saved target role: {plan.targetRole}
                </p>
              ) : null}
            </div>

            <p className="break-words text-[0.9375rem] font-medium leading-snug tracking-[-0.01em] text-muted-foreground sm:text-base">
              {plan.summary}
            </p>

            <p className="text-xs text-muted-foreground">
              The readiness score is an AI estimate based on your profile. It is
              a learning guide, not a hiring prediction.
            </p>
          </div>
        </div>
      </section>

      {/* Other roles */}
      {alternativeRoles.length > 0 ? (
        <section className={tile}>
          <TileHeader
            title="Other suitable roles"
            description="Roles close to your profile that you could also explore."
          />

          <ul className="flex flex-wrap gap-2 rounded-2xl bg-background p-4 sm:p-5">
            {alternativeRoles.map((role) => (
              <li key={role}>
                <Badge
                  variant="secondary"
                  className="h-auto whitespace-normal py-1"
                >
                  {role}
                </Badge>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
        {/* Strengths */}
        <section className={tile}>
          <TileHeader
            title="Your strengths"
            description="Skills and qualities you can build on."
          />

          <div className="rounded-2xl bg-background p-4 sm:p-5">
            {strengths.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                This plan lists no strengths.
              </p>
            ) : (
              <ul className="space-y-3">
                {strengths.map((strength) => (
                  <li key={strength} className="flex gap-3 text-sm leading-6">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-foreground text-background"
                    >
                      <Check className="size-3" />
                    </span>
                    <span className="min-w-0 break-words font-medium tracking-[-0.01em]">
                      {strength}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Skills to learn */}
        <section className={tile}>
          <TileHeader
            title="Skills to learn"
            description="The skills this role needs, in the order to learn them."
          />

          <div className="rounded-2xl bg-background p-4 sm:p-5">
            {prioritySkills.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                This plan lists no skills to learn.
              </p>
            ) : (
              <ol className="space-y-3">
                {prioritySkills.map((skill, index) => (
                  <li key={skill} className="flex gap-3 text-sm leading-6">
                    <span
                      aria-hidden="true"
                      className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold tabular-nums"
                    >
                      {index + 1}
                    </span>
                    <span className="min-w-0 break-words pt-0.5 font-medium tracking-[-0.01em]">
                      {skill}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}