import { useId } from "react";
import { useTheme } from "@/hooks/use-theme";

const ease = "ease-[cubic-bezier(0.32,0.72,0,1)]";

export function ModeToggle() {
  const { setTheme } = useTheme();
  const maskId = `halo-${useId().replace(/:/g, "")}`;

  function toggle() {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className="group flex size-9 shrink-0 items-center justify-center rounded-full text-foreground/70 outline-none transition-colors duration-200 hover:text-foreground focus-visible:text-foreground active:opacity-60"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" className="size-[22px]">
        <mask id={maskId}>
          <rect width="24" height="24" fill="white" />
          {/* Cutout: parked off-frame in light, slides in to carve the crescent */}
          <circle
            cx="16.5"
            cy="8"
            r="5"
            fill="black"
            className={`translate-x-[14px] -translate-y-[14px] transition-transform duration-500 ${ease} group-hover:translate-x-[11px] group-hover:-translate-y-[11px] dark:translate-x-0 dark:translate-y-0 dark:group-hover:translate-x-[2px] dark:group-hover:-translate-y-[2px]`}
          />
        </mask>

        {/* Halo: dashed (rays) in light, closes into a solid ring in dark */}
        <circle
          cx="12"
          cy="12"
          r="10"
          pathLength="48"
          stroke="currentColor"
          strokeWidth="1.25"
          className={`origin-center rotate-0 [stroke-dasharray:2_4] [transform-box:fill-box] transition-[stroke-dasharray,transform] duration-500 ${ease} group-hover:rotate-[22deg] dark:rotate-90 dark:[stroke-dasharray:48_0] dark:group-hover:rotate-[112deg]`}
        />

        {/* Core: full sun disc in light, crescent moon in dark */}
        <circle cx="12" cy="12" r="5.5" fill="currentColor" mask={`url(#${maskId})`} />
      </svg>
    </button>
  );
}