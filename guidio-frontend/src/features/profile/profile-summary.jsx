import { useUser } from "@clerk/react";

/** Top card: who the student is and how complete the saved profile is. */
export function ProfileSummary({ savedForm, completion }) {
  const { user } = useUser();

  const name =
    user?.fullName || user?.firstName || user?.username || "Student";
  const email = user?.primaryEmailAddress?.emailAddress || "";
  const initial = name.trim().charAt(0).toUpperCase() || "S";
  const percent = Math.min(Math.max(completion.percent, 0), 100);

  const subtitle = [savedForm.degree, savedForm.college]
    .filter(Boolean)
    .join(" · ");

  return (
    <section className="rounded-[1.5rem] bg-muted p-3 sm:p-4">
      <div className="grid gap-3 sm:gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
        {/* Who the student is */}
        <div className="flex min-w-0 items-center gap-4 px-2 py-2 sm:px-3 sm:py-3">
          {user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt=""
              width={72}
              height={72}
              className="size-[4.5rem] shrink-0 rounded-full object-cover ring-4 ring-background"
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex size-[4.5rem] shrink-0 items-center justify-center rounded-full bg-foreground text-2xl font-semibold text-background ring-4 ring-background"
            >
              {initial}
            </span>
          )}

          <div className="min-w-0 space-y-1">
            <p className="truncate text-2xl font-semibold leading-tight tracking-[-0.03em] sm:text-3xl">
              {name}
            </p>
            {email ? (
              <p className="truncate text-sm text-muted-foreground">{email}</p>
            ) : null}
            <p className="truncate text-sm font-medium tracking-[-0.01em] text-muted-foreground">
              {savedForm.targetRole
                ? `Preparing for ${savedForm.targetRole}`
                : "No target role set yet"}
              {subtitle ? ` · ${subtitle}` : ""}
            </p>
          </div>
        </div>

        {/* Completion */}
        <div className="rounded-2xl bg-background p-4 sm:p-5">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-xs font-semibold tracking-tight text-muted-foreground">
              Profile completion
            </span>
            <span className="text-4xl font-semibold leading-none tracking-[-0.04em] tabular-nums">
              {completion.percent}%
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

          <p className="mt-3 text-xs text-muted-foreground">
            {completion.done} of {completion.total} details added
          </p>
        </div>
      </div>
    </section>
  );
}