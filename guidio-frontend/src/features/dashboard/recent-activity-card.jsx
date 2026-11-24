import { CalendarCheck2 } from "lucide-react";
import { Link } from "react-router";
import { EmptyState } from "@/components/common/empty-state";
import { buttonVariants } from "@/components/ui/button";
import {
  formatRelativeTime,
  getActivityIcon,
  getSafeHref,
} from "@/features/dashboard/dashboard-utils";

/** `activities` is an array from the dashboard API (newest first, max 5). */
export function RecentActivityCard({ activities }) {
  return (
    <section className="min-w-0 rounded-[1.5rem] bg-muted p-3 sm:p-4">
      <div className="px-2 pb-4 pt-2 sm:px-3">
        <h2 className="text-xl font-semibold leading-tight tracking-[-0.02em]">
          Recent activity
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          What you did most recently on Guidio AI.
        </p>
      </div>

      {activities.length > 0 ? (
        <ul className="space-y-2">
          {activities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            const time = formatRelativeTime(activity.createdAt);

            return (
              <li key={`${activity.type}-${activity.createdAt}`}>
                <Link
                  to={getSafeHref(activity.href)}
                  className="group flex items-center gap-3 rounded-2xl bg-background p-3.5 outline-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-24px] hover:shadow-foreground/40 focus-visible:ring-2 focus-visible:ring-ring/60"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-transform duration-300 group-hover:scale-105">
                    <Icon aria-hidden="true" className="size-[18px]" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold tracking-tight">
                      {activity.title}
                    </span>
                    <span className="block truncate text-xs leading-5 text-muted-foreground">
                      {activity.description}
                    </span>
                  </span>

                  {time ? (
                    <time
                      dateTime={new Date(activity.createdAt).toISOString()}
                      className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-[0.6875rem] font-medium text-muted-foreground"
                    >
                      {time}
                    </time>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="rounded-2xl bg-background p-2">
          <EmptyState
            icon={CalendarCheck2}
            title="No activity yet"
            description="Your profile updates, AI conversations, reports and interviews will appear here."
            action={
              <Link
                to="/assistant"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                Ask the AI Assistant
              </Link>
            }
          />
        </div>
      )}
    </section>
  );
}