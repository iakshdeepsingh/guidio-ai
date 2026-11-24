import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { copyToClipboard } from "@/lib/clipboard";
import { cn } from "@/lib/utils";

/**
 * Small "copy" button that shows a short "Copied" confirmation.
 * `tone="dark"` is for use on the always-dark code block header.
 */
export function CopyButton({
  text,
  label = "Copy",
  copiedLabel = "Copied",
  ariaLabel = "Copy to clipboard",
  tone = "default",
  className,
}) {
  const [status, setStatus] = useState("idle");
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  async function handleCopy() {
    const copied = await copyToClipboard(text);

    setStatus(copied ? "copied" : "failed");

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => setStatus("idle"), 1800);
  }

  const Icon = status === "copied" ? Check : Copy;
  const labelText =
    status === "copied" ? copiedLabel : status === "failed" ? "Failed" : label;

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium tracking-[-0.01em] outline-none transition-all duration-200 active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100",
        "focus-visible:ring-2",
        tone === "dark"
          ? "text-neutral-400 hover:bg-white/10 hover:text-white focus-visible:ring-white/40"
          : "text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring/60",
        status === "copied" && (tone === "dark" ? "text-white" : "text-foreground"),
        className
      )}
    >
      <Icon aria-hidden="true" className="size-3.5" />
      <span aria-live="polite">{labelText}</span>
    </button>
  );
}