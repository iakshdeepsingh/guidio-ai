import { memo } from "react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";

export const LogoMark = memo(function LogoMark({ className }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center",
        className
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="128 126 988 1020"
        fill="none"
        className="block size-full"
        focusable="false"
      >
        {/* Circle follows the theme: black in light mode, white in dark mode */}
        <ellipse
          cx="622"
          cy="636"
          rx="494"
          ry="510"
          className="fill-foreground"
        />

        {/* The G is cut out in the page background color */}
        <path
          className="fill-background"
          transform="translate(633 335)"
          d="
            M0 0
            H305
            L248 68
            L213 110
            H4
            L-30 114
            C-60 121 -72 126 -84 131
            C-150 160 -217 260 -212 338
            C-206 383 -181 424 -146 452
            C-105 478 -30 503 76 472
            C120 450 152 413 172 368
            L174 363
            H0
            L-94 255
            V253
            H306
            L307 313
            C307 334 307 353 302 373
            C287 440 249 497 195 537
            C143 571 87 592 23 605
            C-20 606 -58 606 -76 602
            C-135 584 -190 557 -225 531
            C-263 492 -296 445 -310 414
            C-332 328 -329 278 -315 232
            C-291 169 -267 139 -244 113
            C-186 60 -149 36 -111 23
            C-66 8 -41 2 -15 1
            Z
          "
        />
      </svg>
    </span>
  );
});

/**
 * Guidio AI logo.
 * Pass `to={null}` to render it without a link.
 */
export const Logo = memo(function Logo({
  to = "/",
  showText = true,
  className,
  textClassName,
}) {
  const content = (
    <>
      <LogoMark />

      {showText ? (
        <span
          className={cn(
            "text-base font-semibold tracking-[-0.02em] text-foreground",
            textClassName
          )}
        >
          Guidio AI
        </span>
      ) : null}
    </>
  );

  if (to === null) {
    return (
      <span
        role={showText ? undefined : "img"}
        aria-label={showText ? undefined : "Guidio AI"}
        className={cn("inline-flex items-center gap-2.5", className)}
      >
        {content}
      </span>
    );
  }

  return (
    <Link
      to={to}
      aria-label="Guidio AI home"
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full outline-none transition-opacity motion-reduce:transition-none hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2",
        className
      )}
    >
      {content}
    </Link>
  );
});