import { cn } from "@/lib/utils";

/**
 * Small tappable suggestions shown under a text input.
 * Used by onboarding and the profile editor.
 */
export function SuggestionButtons({ options, current, onPick, disabled }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const isActive = current.trim().toLowerCase() === option.toLowerCase();

        return (
          <li key={option}>
            <button
              type="button"
              onClick={() => onPick(option)}
              disabled={disabled}
              aria-pressed={isActive}
              className={cn(
                "inline-flex min-h-8 items-center rounded-full px-3.5 py-1.5 text-xs font-medium tracking-[-0.01em] outline-none transition-all duration-200",
                "focus-visible:ring-2 focus-visible:ring-ring/60",
                "disabled:cursor-not-allowed disabled:opacity-50",
                isActive
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-foreground/[0.08] hover:text-foreground"
              )}
            >
              {option}
            </button>
          </li>
        );
      })}
    </ul>
  );
}