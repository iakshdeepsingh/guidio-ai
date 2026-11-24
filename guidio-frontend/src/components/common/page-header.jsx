import { cn } from "@/lib/utils";

export function PageHeader({ title, description, actions, className }) {
  return (
    <header
      className={cn(
        "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="min-w-0 space-y-2">
        <h1 className="text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.035em] sm:text-4xl">
          {title}
        </h1>

        {description ? (
          <p className="max-w-2xl text-[0.9375rem] font-medium leading-snug tracking-[-0.01em] text-muted-foreground sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>

      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      ) : null}
    </header>
  );
}