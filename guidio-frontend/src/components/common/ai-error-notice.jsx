import { Clock, RefreshCw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFriendlyAiError } from "@/lib/ai";
import { cn } from "@/lib/utils";

/**
 * Friendly error for AI requests (rate limit, unavailable, etc.).
 *
 * `cooldownSeconds` comes from useCooldown(). While it is above zero the
 * retry button is disabled, which prevents repeated requests that would
 * hit the same limit.
 */
export function AiErrorNotice({ error, onRetry, cooldownSeconds = 0, className }) {
  if (!error) {
    return null;
  }

  const friendly = getFriendlyAiError(error);
  const isRateLimit = friendly.kind === "rate_limited";
  const Icon = isRateLimit ? Clock : TriangleAlert;
  const waiting = cooldownSeconds > 0;

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3.5 rounded-[1.5rem] p-4 sm:p-5",
        isRateLimit ? "bg-muted" : "bg-destructive/10",
        className
      )}
    >
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full",
          isRateLimit
            ? "bg-foreground text-background"
            : "bg-destructive text-white"
        )}
      >
        <Icon aria-hidden="true" className="size-[18px]" />
      </span>

      <div className="min-w-0 flex-1 space-y-3">
        <div className="space-y-1">
          <p className="text-base font-semibold leading-tight tracking-[-0.02em]">
            {friendly.title}
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            {friendly.message}
          </p>
        </div>

        {onRetry ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRetry}
            disabled={waiting}
            className="h-9 rounded-full border-foreground/10 bg-background px-4"
          >
            <RefreshCw aria-hidden="true" />
            {waiting ? `Try again in ${cooldownSeconds}s` : "Try again"}
          </Button>
        ) : null}
      </div>
    </div>
  );
}