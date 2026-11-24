import { cn } from "@/lib/utils";

/**
 * Single-choice answer shown as large tappable tiles.
 * Built on native radio inputs, so keyboard and screen reader support
 * works without extra code (arrow keys move between options).
 *
 * `options` is an array of { value, label, description? }.
 */
export function ChoiceGroup({
  name,
  value,
  onChange,
  options,
  disabled = false,
  className,
  ...groupProps
}) {
  return (
    <div
      role="radiogroup"
      className={cn("grid gap-2 sm:grid-cols-2", className)}
      {...groupProps}
    >
      {options.map((option) => (
        <label key={option.value} className="relative block">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            disabled={disabled}
            onChange={() => onChange(option.value)}
            className="peer sr-only"
          />
          <span
            className={cn(
              "flex h-full min-h-12 cursor-pointer flex-col justify-center rounded-2xl bg-muted px-4 py-3 text-sm tracking-[-0.01em] transition-all duration-200",
              "hover:bg-foreground/[0.08]",
              // Selected: solid black tile, like the active item in the sidebar
              "peer-checked:bg-foreground peer-checked:text-background",
              "peer-checked:[&_[data-description]]:text-background/70",
              "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring",
              "peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
            )}
          >
            <span className="font-medium">{option.label}</span>
            {option.description ? (
              <span
                data-description
                className="text-xs text-muted-foreground transition-colors duration-200"
              >
                {option.description}
              </span>
            ) : null}
          </span>
        </label>
      ))}
    </div>
  );
}