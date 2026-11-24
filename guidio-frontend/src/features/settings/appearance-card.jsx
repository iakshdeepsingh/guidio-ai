import { Palette } from "lucide-react";
import { ChoiceGroup } from "@/features/onboarding/choice-group";
import { useTheme } from "@/hooks/use-theme";

const THEME_OPTIONS = [
  { value: "light", label: "Light", description: "Bright background" },
  { value: "dark", label: "Dark", description: "Dark background" },
];

/** Theme selection. The choice is stored in this browser only. */
export function AppearanceCard() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <section className="rounded-[1.5rem] bg-muted p-3 sm:p-4">
      <div className="flex items-start gap-3 px-2 pb-4 pt-2 sm:px-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
          <Palette aria-hidden="true" className="size-[18px]" />
        </span>

        <div className="min-w-0">
          <h2 className="text-xl font-semibold leading-tight tracking-[-0.02em]">
            Appearance
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Choose how Guidio AI looks on this device.
          </p>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl bg-background p-4 sm:p-5">
        <ChoiceGroup
          name="theme"
          aria-label="Theme"
          value={resolvedTheme ?? theme}
          onChange={setTheme}
          options={THEME_OPTIONS}
          className="sm:grid-cols-2"
        />

        <p className="text-xs leading-5 text-muted-foreground">
          Currently showing the {resolvedTheme ?? theme} theme. This choice is
          saved in this browser only, so it is not shared between your
          devices.
        </p>
      </div>
    </section>
  );
}