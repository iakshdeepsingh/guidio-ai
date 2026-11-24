import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { ThemeContext } from "@/app/theme-context";

const THEMES = ["light", "dark"];

// Browser bar color for each theme. Keep these in step with --background.
const BAR_COLORS = { light: "#ffffff", dark: "#050505" };

function readStoredTheme(storageKey, fallback) {
  try {
    const stored = localStorage.getItem(storageKey);
    return THEMES.includes(stored) ? stored : fallback;
  } catch {
    return fallback;
  }
}

// Turns off every CSS transition for one frame, so switching themes does not
// make hundreds of elements animate their colors at the same time.
// The theme toggle (data-theme-toggle) is left out so its icon can animate.
function disableTransitionsTemporarily() {
  const style = document.createElement("style");
  style.appendChild(
    document.createTextNode(
      "*:not([data-theme-toggle]):not([data-theme-toggle] *),*::before,*::after{transition:none!important}",
    ),
  );
  document.head.appendChild(style);

  return () => {
    // Force the browser to apply the new styles before transitions return.
    window.getComputedStyle(document.body);
    window.setTimeout(() => style.remove(), 1);
  };
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "Guidio-Ai-theme",
}) {
  const [theme, setThemeState] = useState(() =>
    readStoredTheme(storageKey, defaultTheme),
  );

  // Apply the theme to <html> before the browser paints.
  useLayoutEffect(() => {
    const root = document.documentElement;
    const restoreTransitions = disableTransitionsTemporarily();

    root.classList.remove("light", "dark");
    root.classList.add(theme);
    root.style.colorScheme = theme;

    // Keep the browser bar (mobile address bar) in step with the theme.
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", BAR_COLORS[theme]);

    restoreTransitions();
  }, [theme]);

  // Keep other open tabs in sync.
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === storageKey && THEMES.includes(event.newValue)) {
        setThemeState(event.newValue);
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [storageKey]);

  const setTheme = useCallback(
    (nextTheme) => {
      if (!THEMES.includes(nextTheme)) {
        return;
      }

      try {
        localStorage.setItem(storageKey, nextTheme);
      } catch {
        // Storage can be unavailable (private mode). Theme still updates.
      }

      setThemeState(nextTheme);
    },
    [storageKey],
  );

  const value = useMemo(
    () => ({ theme, resolvedTheme: theme, setTheme }),
    [theme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}