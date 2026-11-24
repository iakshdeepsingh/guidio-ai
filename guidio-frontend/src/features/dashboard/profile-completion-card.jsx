import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Detail({ label, value }) {
  const hasValue = value !== null && value !== undefined && value !== "";

  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "min-w-0 truncate text-right font-medium",
          !hasValue && "font-normal text-muted-foreground"
        )}
      >
        {hasValue ? value : "Not added"}
      </dd>
    </div>
  );
}

/** `profile` is the normalised profile object from normalizeDashboard(). */
export function ProfileCompletionCard({ profile }) {
  const isComplete = profile.completion >= 100;
  const percent = Math.min(Math.max(profile.completion, 0), 100);

  return (
    <section className="min-w-0 rounded-[1.5rem] bg-muted p-3 sm:p-4">
      <div className="px-2 pb-4 pt-2 sm:px-3">
        <h2 className="text-xl font-semibold leading-tight tracking-[-0.02em]">
          Profile completion
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          A complete profile helps Guidio AI personalise your guidance.
        </p>
      </div>

      <div className="space-y-2">
        {/* Progress */}
        <div className="rounded-2xl bg-background p-4">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-4xl font-semibold leading-none tracking-[-0.04em] tabular-nums">
              {profile.completion}%
            </span>
            <span className="text-xs text-muted-foreground">
              {isComplete ? "All details added" : "Some details are missing"}
            </span>
          </div>

          <div
            role="progressbar"
            aria-label="Profile completion"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            className="mt-4 h-1.5 overflow-hidden rounded-full bg-foreground/10"
          >
            <div
              className="h-full rounded-full bg-foreground transition-all duration-700"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Details */}
        <dl className="space-y-2.5 rounded-2xl bg-background p-4 text-sm">
          <Detail label="Target role" value={profile.targetRole} />
          <Detail label="Education" value={profile.education} />
          <Detail label="Degree" value={profile.degree} />
          <Detail label="Experience" value={profile.experienceLevel} />
          <Detail
            label="Skills"
            value={profile.skillsCount > 0 ? `${profile.skillsCount} added` : null}
          />
          <Detail
            label="Interests"
            value={
              profile.interestsCount > 0 ? `${profile.interestsCount} added` : null
            }
          />
        </dl>

        <Link
          to={isComplete ? "/profile" : "/onboarding"}
          className={cn(
            buttonVariants({
              variant: isComplete ? "outline" : "default",
              size: "lg",
            }),
            "h-12 w-full rounded-full text-[0.9375rem]",
            isComplete && "border-foreground/10 bg-background"
          )}
        >
          {isComplete ? "Edit profile" : "Complete profile"}
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}