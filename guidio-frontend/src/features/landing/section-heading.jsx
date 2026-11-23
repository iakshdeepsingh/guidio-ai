import { memo, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const SectionHeading = memo(function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}) {
  const isCenter = align === "center";
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  // Play the entrance once, when the heading is about to be seen.
  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "w-full duration-700",
        revealed
          ? "animate-in fade-in slide-in-from-bottom-3 motion-reduce:animate-none"
          : "opacity-0 motion-reduce:opacity-100",
        isCenter ? "mx-auto max-w-3xl text-center" : "max-w-xl",
        className,
      )}
    >
      {eyebrow && (
        <p className="text-sm font-semibold tracking-tight text-muted-foreground sm:text-base">
          {eyebrow}
        </p>
      )}

      <h2
        className={cn(
          "mt-3 font-semibold leading-[1.05] tracking-[-0.035em] text-foreground",
          isCenter
            ? "text-[2rem] sm:text-5xl lg:text-[3.5rem]"
            : "text-[2rem] sm:text-4xl lg:text-5xl",
        )}
      >
        {title}
      </h2>

      {description && (
        <p
          className={cn(
            "mt-4 font-medium leading-snug tracking-[-0.01em] text-muted-foreground sm:mt-5",
            isCenter
              ? "mx-auto max-w-2xl text-base sm:text-xl"
              : "max-w-md text-base sm:text-lg",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
});