import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MatchGauge } from "./match-gauge";
import {
  asArray,
  countByPriority,
  PRIORITY_ORDER,
  PRIORITY_STYLES,
} from "./skill-gap-utils";

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

function PriorityBreakdown({ skills }) {
  const counts = countByPriority(skills);
  const total = PRIORITY_ORDER.reduce((sum, key) => sum + counts[key], 0);

  return (
    <section className={tile}>
      <TileHeader
        title="Gaps by priority"
        description="How the missing skills are split by importance."
      />

      <div className="space-y-4 rounded-2xl bg-background p-4 sm:p-5">
        {total > 0 ? (
          <div
            role="img"
            aria-label={PRIORITY_ORDER.map(
              (key) => `${counts[key]} ${key} priority`
            ).join(", ")}
            className="flex h-2.5 w-full overflow-hidden rounded-full bg-foreground/10"
          >
            {PRIORITY_ORDER.map((key) =>
              counts[key] > 0 ? (
                <div
                  key={key}
                  className={PRIORITY_STYLES[key].bar}
                  style={{ width: `${(counts[key] / total) * 100}%` }}
                />
              ) : null
            )}
          </div>
        ) : null}

        <dl className="grid grid-cols-3 gap-2 sm:gap-3">
          {PRIORITY_ORDER.map((key) => (
            <div key={key} className="min-w-0 rounded-2xl bg-muted p-3 sm:p-4">
              <dt className="flex min-w-0 items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <span
                  aria-hidden="true"
                  className={`size-2 shrink-0 rounded-full ${PRIORITY_STYLES[key].bar}`}
                />
                <span className="truncate">{key}</span>
              </dt>
              <dd className="mt-1.5 text-3xl font-semibold leading-none tracking-[-0.04em] tabular-nums">
                {counts[key]}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function ReportOverview({ report }) {
  const strengths = asArray(report.currentStrengths);
  const missingSkills = asArray(report.missingSkills);
  const prioritySkills = asArray(report.prioritySkills);

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Target role */}
      <section className={tile}>
        <div className="flex flex-col items-center gap-6 rounded-2xl bg-background p-5 sm:flex-row sm:p-8">
          <MatchGauge value={report.matchPercentage} />

          <div className="min-w-0 space-y-3 text-center sm:text-left">
            <div className="space-y-2">
              <Badge variant="outline">Target role</Badge>
              <h2 className="break-words text-2xl font-semibold leading-[1.1] tracking-[-0.03em] sm:text-4xl">
                {report.targetRole}
              </h2>
            </div>

            <p className="text-[0.9375rem] font-medium leading-snug tracking-[-0.01em] text-muted-foreground sm:text-base">
              {report.summary}
            </p>

            <p className="text-xs text-muted-foreground">
              The match is an AI estimate for learning purposes, not a hiring
              prediction.
            </p>
          </div>
        </div>
      </section>

      <PriorityBreakdown skills={missingSkills} />

      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
        {/* Strengths */}
        <section className={tile}>
          <TileHeader
            title="Current strengths"
            description="Skills that already support this role."
          />

          <div className="rounded-2xl bg-background p-4 sm:p-5">
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
          </div>
        </section>

        {/* Learn first */}
        <section className={tile}>
          <TileHeader
            title="Learn these first"
            description="The most useful skills to start with, in order."
          />

          <div className="rounded-2xl bg-background p-4 sm:p-5">
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
          </div>
        </section>
      </div>
    </div>
  );
}