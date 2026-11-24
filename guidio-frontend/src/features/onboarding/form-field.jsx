import { CircleAlert } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const labelClass =
  "flex items-center gap-2 text-sm font-semibold leading-none tracking-[-0.01em]";

/**
 * Label + hint + error wrapper for one form control.
 *
 * `children` is a function that receives the props the control needs
 * (id, aria-invalid, aria-describedby and, for grouped controls,
 * aria-labelledby). Spread them onto the control:
 *
 *   <FormField name="college" label="College" error={errors.college}>
 *     {(control) => <Input {...control} value={...} onChange={...} />}
 *   </FormField>
 *
 * Use `group` for controls that are not a single input (radio cards,
 * chip lists).
 */
export function FormField({
  name,
  label,
  optional = false,
  hint,
  error,
  group = false,
  className,
  children,
}) {
  const id = `ob-${name}`;
  const labelId = `${id}-label`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") ||
    undefined;

  const control = {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    ...(group ? { "aria-labelledby": labelId } : {}),
  };

  const labelContent = (
    <>
      {label}
      {optional ? (
        <span className="text-xs font-normal text-muted-foreground">
          (optional)
        </span>
      ) : null}
    </>
  );

  return (
    <div
      data-invalid={error ? "true" : undefined}
      className={cn("space-y-2.5", className)}
    >
      <div className="space-y-1">
        {group ? (
          <p id={labelId} className={labelClass}>
            {labelContent}
          </p>
        ) : (
          <Label htmlFor={id} className={labelClass}>
            {labelContent}
          </Label>
        )}

        {hint ? (
          <p id={hintId} className="text-xs leading-5 text-muted-foreground">
            {hint}
          </p>
        ) : null}
      </div>

      {children(control)}

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="flex items-start gap-1.5 text-sm font-medium leading-5 text-destructive"
        >
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}