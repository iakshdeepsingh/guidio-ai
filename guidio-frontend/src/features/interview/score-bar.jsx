import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { clampScore, getScoreTone } from "./interview-utils";

export function ScoreBar({ label, value }) {
  const score = clampScore(value);
  const tone = getScoreTone(score);

  // Start empty and fill on the first frame, so the bar grows in.
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setShown(score));
    return () => window.cancelAnimationFrame(frame);
  }, [score]);

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="font-medium tracking-[-0.01em] text-muted-foreground">
          {label}
        </span>
        <span className="text-base font-semibold tabular-nums tracking-[-0.02em]">
          {score}
        </span>
      </div>

      <div
        role="progressbar"
        aria-label={`${label} score`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={score}
        className="h-2 overflow-hidden rounded-full bg-foreground/10"
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-1000 ease-out motion-reduce:transition-none",
            tone.bar
          )}
          style={{ width: `${shown}%` }}
        />
      </div>
    </div>
  );
}

export function ScoreBadge({ score, className }) {
  const value = clampScore(score);
  const tone = getScoreTone(value);

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tabular-nums tracking-[-0.01em]",
        tone.badge,
        className
      )}
    >
      {value}/100
    </span>
  );
}