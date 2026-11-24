import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-5 rounded-[1.75rem] bg-muted px-6 py-12 text-center sm:rounded-[2rem] sm:py-16",
        className
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-foreground text-background">
        <Icon aria-hidden="true" className="size-5" />
      </span>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold leading-tight tracking-[-0.02em] sm:text-2xl">
          {title}
        </h3>

        {description ? (
          <p className="mx-auto max-w-sm text-[0.9375rem] font-medium leading-snug tracking-[-0.01em] text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>

      {action ? <div className="pt-1">{action}</div> : null}
    </div>
  );
}