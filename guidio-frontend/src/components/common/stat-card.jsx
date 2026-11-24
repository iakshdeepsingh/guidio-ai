import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Shows one real number. If `value` is null or undefined it shows an
 * em dash, never an invented figure.
 */
export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  loading = false,
  className,
}) {
  const hasValue = value !== null && value !== undefined && value !== "";

  return (
    <div
      className={cn(
        "group space-y-4 rounded-[1.5rem] bg-muted p-5 transition-transform duration-300 hover:-translate-y-0.5 sm:p-6",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-sm font-medium tracking-tight text-muted-foreground">
          {label}
        </p>

        {Icon ? (
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
            <Icon aria-hidden="true" className="size-4" />
          </span>
        ) : null}
      </div>

      <div className="space-y-1.5">
        {loading ? (
          <>
            <Skeleton className="h-9 w-24 rounded-xl bg-foreground/10" />
            <Skeleton className="h-3.5 w-28 rounded-full bg-foreground/10" />
          </>
        ) : (
          <>
            <p
              className={cn(
                "text-4xl font-semibold leading-none tracking-[-0.04em] tabular-nums",
                !hasValue && "text-muted-foreground"
              )}
            >
              {hasValue ? value : "—"}
            </p>

            {hint ? (
              <p className="text-xs leading-5 text-muted-foreground">{hint}</p>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}