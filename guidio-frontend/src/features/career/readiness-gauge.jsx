import { useEffect, useState } from "react";
import { clampPercent } from "./career-utils";

export function ReadinessGauge({ value, size = 144 }) {
  const percent = clampPercent(value);
  const stroke = 9;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  // Start empty and fill on the first frame, so the ring animates in.
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setShown(percent));
    return () => window.cancelAnimationFrame(frame);
  }, [percent]);

  return (
    <div
      role="img"
      aria-label={`Career readiness: ${percent} out of 100`}
      className="relative shrink-0"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-foreground/10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - shown / 100)}
          className="stroke-foreground transition-[stroke-dashoffset] duration-1000 ease-out motion-reduce:transition-none"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-semibold leading-none tracking-[-0.04em] tabular-nums">
          {percent}
        </span>
        <span className="mt-1 text-xs text-muted-foreground">out of 100</span>
      </div>
    </div>
  );
}