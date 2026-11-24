import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Honest information about AI usage. It never shows request counts or a
 * "remaining" number, because the backend does not provide real usage data.
 *
 * `model` is shown only if a caller passes it (the backend does not expose
 * the model name yet, so most callers will leave it out).
 */
export function AiUsageNotice({ variant = "inline", model, className }) {
  if (variant === "inline") {
    return (
      <p
        className={cn(
          "flex items-start gap-2 text-xs leading-5 tracking-[-0.005em] text-muted-foreground",
          className
        )}
      >
        <Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
        <span>
          Guidio AI uses free AI services. Usage limits may apply, and
          availability depends on the current service quotas. Always verify
          important information.
        </span>
      </p>
    );
  }

  return (
    <section className={cn("rounded-[1.5rem] bg-muted p-3 sm:p-4", className)}>
      <div className="px-2 pb-4 pt-2 sm:px-3">
        <h2 className="text-xl font-semibold leading-tight tracking-[-0.02em]">
          AI usage
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          How the AI features of Guidio AI are powered.
        </p>
      </div>

      <div className="space-y-2 text-sm">
        <dl className="grid gap-2 sm:grid-cols-2">
          <div className="space-y-1 rounded-2xl bg-background p-4">
            <dt className="text-xs font-semibold tracking-tight text-muted-foreground">
              Provider
            </dt>
            <dd className="font-semibold tracking-tight">Free AI services</dd>
          </div>

          <div className="space-y-1 rounded-2xl bg-background p-4">
            <dt className="text-xs font-semibold tracking-tight text-muted-foreground">
              Plan
            </dt>
            <dd>
              <Badge variant="secondary">Free tier</Badge>
            </dd>
          </div>

          {model ? (
            <div className="space-y-1 rounded-2xl bg-background p-4 sm:col-span-2">
              <dt className="text-xs font-semibold tracking-tight text-muted-foreground">
                Model
              </dt>
              <dd className="font-semibold tracking-tight">{model}</dd>
            </div>
          ) : null}
        </dl>

        <ul className="list-disc space-y-2 rounded-2xl bg-background py-4 pl-9 pr-4 leading-6 text-muted-foreground marker:text-foreground/30">
          <li>
            Free AI services may have request quotas and rate limits.
            Availability is not guaranteed and depends on the current
            service limits.
          </li>
          <li>
            Live usage numbers are not available, so none are shown here.
          </li>
          <li>
            If a usage limit is reached, you will see a message and can try
            again shortly. What you typed is kept.
          </li>
        </ul>
      </div>
    </section>
  );
}