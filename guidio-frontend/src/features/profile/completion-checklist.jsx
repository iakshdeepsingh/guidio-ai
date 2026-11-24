import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** Which of the 8 profile details are saved. Uses the saved data only. */
export function CompletionChecklist({ completion }) {
  const doneCount = completion.items.filter((item) => item.done).length;

  return (
    <section className="rounded-[1.5rem] bg-muted p-3 sm:p-4">
      <div className="px-2 pb-4 pt-2 sm:px-3">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-xl font-semibold leading-tight tracking-[-0.02em]">
            What is saved
          </h2>

          <span className="shrink-0 rounded-full bg-background px-2.5 py-1 text-[0.6875rem] font-semibold tabular-nums text-muted-foreground">
            {doneCount}/{completion.items.length}
          </span>
        </div>

        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Guidio AI uses these details to personalise your guidance.
        </p>
      </div>

      <ul className="space-y-1 rounded-2xl bg-background p-2">
        {completion.items.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm"
          >
            <span
              aria-hidden="true"
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                item.done
                  ? "border-foreground bg-foreground text-background"
                  : "border-foreground/15 text-transparent"
              )}
            >
              <Check className="size-3" />
            </span>

            <span
              className={cn(
                "font-medium tracking-[-0.01em]",
                !item.done && "font-normal text-muted-foreground"
              )}
            >
              {item.label}
            </span>

            <span className="sr-only">
              {item.done ? "(saved)" : "(not added yet)"}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}