import { RefreshCw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Page-level or section-level error with an optional retry button.
 * Pass either `error` (an Error/ApiError) or an explicit `message`.
 */
export function ErrorState({
  title = "Something went wrong",
  error,
  message,
  onRetry,
  retryLabel = "Try again",
  className,
}) {
  const text =
    message || error?.message || "Unable to load this content. Please try again.";

  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-5 rounded-[1.75rem] bg-muted px-6 py-12 text-center sm:rounded-[2rem] sm:py-16",
        className
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-destructive text-white">
        <TriangleAlert aria-hidden="true" className="size-5" />
      </span>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold leading-tight tracking-[-0.02em] sm:text-2xl">
          {title}
        </h3>
        <p className="mx-auto max-w-md text-[0.9375rem] font-medium leading-snug tracking-[-0.01em] text-muted-foreground">
          {text}
        </p>
      </div>

      {onRetry ? (
        <Button
          type="button"
          variant="outline"
          onClick={onRetry}
          className="h-11 rounded-full border-foreground/10 bg-background px-6"
        >
          <RefreshCw aria-hidden="true" />
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}