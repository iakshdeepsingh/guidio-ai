import { ChevronDown } from "lucide-react";
import { FIELD_OPTIONS } from "@/features/onboarding/field-data";
import { cn } from "@/lib/utils";

/**
 * Field-of-study picker. A native select keeps keyboard, screen reader and
 * mobile behaviour correct without extra code.
 * `FormField` passes id and the aria-* props through `...props`.
 */
export function FieldSelect({ value, onChange, disabled = false, className, ...props }) {
  return (
    <div className="relative w-full min-w-0">
      <select
        {...props}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className={cn(
          "h-11 w-full min-w-0 appearance-none rounded-xl border border-field bg-background pl-3.5 pr-10 text-base tracking-[-0.01em] text-foreground outline-none transition-colors",
          "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          !value && "text-muted-foreground",
          className
        )}
      >
        <option value="">Select a field</option>
        {FIELD_OPTIONS.map((field) => (
          <option key={field.id} value={field.id} className="text-foreground">
            {field.label}
          </option>
        ))}
      </select>

      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  );
}