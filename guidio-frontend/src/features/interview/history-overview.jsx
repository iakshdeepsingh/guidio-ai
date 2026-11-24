import { CheckCircle2, Mic, Target, Trophy } from "lucide-react";
import { StatCard } from "@/components/common/stat-card";
import { cn } from "@/lib/utils";
import { getHistoryStats, getScoreTrend } from "./history-utils";
import { formatDate, getScoreTone } from "./interview-utils";

function ScoreTrend({ trend }) {
  const summary = trend.map((item) => item.overallScore).join(", ");

  return (
    <section className="rounded-[1.5rem] bg-muted p-3 sm:p-4">
      <div className="px-2 pb-4 pt-2 sm:px-3">
        <h2 className="text-xl font-semibold leading-tight tracking-[-0.02em]">
          Score trend
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Your latest {trend.length} completed interviews, oldest on the left.
        </p>
      </div>

      <div className="rounded-2xl bg-background p-4 sm:p-6">
        <div
          role="img"
          aria-label={`Interview scores from oldest to latest: ${summary}`}
          className="space-y-3"
        >
          <div className="flex h-36 items-end gap-2 border-b border-foreground/10 sm:h-40 sm:gap-3">
            {trend.map((item) => (
              <div
                key={item.id}
                title={`${item.targetRole}, ${formatDate(item.completedAt || item.createdAt)}: ${item.overallScore}/100`}
                className="flex h-full flex-1 items-end"
              >
                <div
                  className={cn(
                    "w-full rounded-t-xl transition-[height] duration-700 ease-out motion-reduce:transition-none",
                    getScoreTone(item.overallScore).bar
                  )}
                  style={{ height: `${Math.max(item.overallScore, 4)}%` }}
                />
              </div>
            ))}
          </div>

          <div className="flex gap-2 sm:gap-3">
            {trend.map((item) => (
              <p
                key={item.id}
                className="flex-1 text-center text-xs font-medium tabular-nums text-muted-foreground"
              >
                {item.overallScore}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function HistoryOverview({ interviews }) {
  const stats = getHistoryStats(interviews);
  const trend = getScoreTrend(interviews);

  return (
    <div className="space-y-3 sm:space-y-4">
      <section
        aria-label="Interview statistics"
        className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4"
      >
        <StatCard
          label="Interviews"
          icon={Mic}
          value={stats.total}
          hint={stats.inProgress > 0 ? `${stats.inProgress} in progress` : "All finished"}
        />

        <StatCard
          label="Completed"
          icon={CheckCircle2}
          value={stats.completed}
          hint="Interviews with a final score"
        />

        <StatCard
          label="Average score"
          icon={Target}
          value={stats.average === null ? null : `${stats.average}/100`}
          hint={
            stats.completed > 0
              ? `From ${stats.completed} completed`
              : "Complete an interview to see this"
          }
        />

        <StatCard
          label="Best score"
          icon={Trophy}
          value={stats.best === null ? null : `${stats.best}/100`}
          hint="Your highest interview score"
        />
      </section>

      {trend.length >= 2 ? <ScoreTrend trend={trend} /> : null}
    </div>
  );
}