import { History } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "./skill-gap-utils";

export function ReportHistory({ reports, activeId, disabled, onSelect }) {
  return (
    <section className="rounded-[1.5rem] bg-muted p-3 sm:p-4">
      <div className="flex items-start gap-3 px-2 pb-4 pt-2 sm:px-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
          <History aria-hidden="true" className="size-[18px]" />
        </span>

        <div className="min-w-0">
          <h2 className="text-xl font-semibold leading-tight tracking-[-0.02em]">
            Saved reports
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Every analysis is saved so you can compare over time.
          </p>
        </div>
      </div>

      {reports.length === 0 ? (
        <p className="rounded-2xl bg-background p-5 text-center text-sm font-medium text-muted-foreground">
          No saved reports yet.
        </p>
      ) : (
        <ul className="space-y-2">
          {reports.map((report) => {
            const isActive = report.id === activeId;
            const percent = Math.max(
              0,
              Math.min(100, Number(report.matchPercentage) || 0)
            );

            return (
              <li key={report.id}>
                <button
                  type="button"
                  onClick={() => onSelect(report.id)}
                  disabled={disabled}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "w-full rounded-2xl p-4 text-left outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-ring/60 disabled:opacity-60",
                    isActive
                      ? "bg-foreground text-background"
                      : "bg-background hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-24px] hover:shadow-foreground/40"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 break-words text-sm font-semibold tracking-tight">
                      {report.targetRole}
                    </p>
                    <span className="shrink-0 text-sm font-semibold tabular-nums">
                      {percent}%
                    </span>
                  </div>

                  <div
                    aria-hidden="true"
                    className={cn(
                      "mt-3 h-1 overflow-hidden rounded-full",
                      isActive ? "bg-background/20" : "bg-foreground/10"
                    )}
                  >
                    <div
                      className={cn(
                        "h-full rounded-full",
                        isActive ? "bg-background" : "bg-foreground"
                      )}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <p
                    className={cn(
                      "mt-2.5 text-xs",
                      isActive ? "text-background/60" : "text-muted-foreground"
                    )}
                  >
                    {formatDate(report.createdAt)}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}