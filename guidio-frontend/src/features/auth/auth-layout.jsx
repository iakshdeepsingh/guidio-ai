import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { Link } from "react-router";

import { AiUsageNotice } from "@/components/common/ai-usage-notice";
import { Logo } from "@/components/common/logo";
import { ModeToggle } from "@/components/mode-toggle";
import { SkipLink } from "@/components/skip-link";

const reveal = (delay) => ({
  animationDelay: `${delay}ms`,
  animationFillMode: "both",
});

const highlights = [
  "Skill gap analysis against your target role",
  "Career roadmaps built around your profile",
  "Technical and HR mock interviews with scored feedback",
  "An AI assistant for study and career questions",
];

/**
 * Shared shell for the sign-in and sign-up pages: header, a short product
 * panel on large screens and the form column.
 */
export function AuthLayout({ eyebrow, title, description, children }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SkipLink />

      <header className="border-b border-foreground/10">
        <div className="container flex h-12 max-w-6xl items-center justify-between">
          <Logo />
          <ModeToggle />
        </div>
      </header>

      <main
        id="main-content"
        className="container grid max-w-6xl flex-1 gap-10 py-8 sm:py-12 lg:grid-cols-[1.1fr_1fr] lg:items-stretch lg:gap-6 lg:py-10"
      >
        {/* Product panel (large screens only) */}
        <aside
          style={reveal(0)}
          className="animate-in fade-in slide-in-from-bottom-4 relative hidden flex-col overflow-hidden rounded-[2rem] bg-muted p-10 duration-700 lg:flex xl:p-12"
        >
          <Sparkles
            aria-hidden="true"
            strokeWidth={1}
            className="pointer-events-none absolute -bottom-12 -right-12 size-80 text-foreground/[0.05]"
          />

          <p className="relative text-sm font-semibold tracking-tight text-muted-foreground">
            Guidio AI
          </p>

          <h2 className="relative mt-3 max-w-md text-5xl font-semibold leading-[1.05] tracking-[-0.035em] text-balance xl:text-[3.5rem]">
            Your AI career{" "}
            <span className="text-muted-foreground">companion.</span>
          </h2>

          <ul className="relative mt-10 space-y-3">
            {highlights.map((item, index) => (
              <li
                key={item}
                style={reveal(150 + index * 80)}
                className="animate-in fade-in slide-in-from-bottom-2 flex items-start gap-3 text-[0.9375rem] font-medium leading-snug tracking-[-0.01em] duration-700"
              >
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                  <Check aria-hidden="true" className="size-3" />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="relative mt-auto rounded-[1.25rem] bg-background p-4 pt-4">
            <AiUsageNotice />
          </div>
        </aside>

        {/* Form column */}
        <div className="mx-auto flex w-full max-w-md flex-col justify-center lg:max-w-none lg:items-center">
          <div className="w-full max-w-md">
            <div
              style={reveal(80)}
              className="animate-in fade-in slide-in-from-bottom-3 mb-7 text-center duration-700 lg:text-left"
            >
              <p className="text-sm font-semibold tracking-tight text-muted-foreground sm:text-base">
                {eyebrow}
              </p>

              <h1 className="mt-2 text-[2rem] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-4xl">
                {title}
              </h1>

              <p className="mt-3 text-base font-medium leading-snug tracking-[-0.01em] text-muted-foreground">
                {description}
              </p>
            </div>

            <div
              style={reveal(180)}
              className="animate-in fade-in slide-in-from-bottom-3 flex justify-center duration-700 lg:justify-start"
            >
              {children}
            </div>

            <p className="mt-7 text-center text-sm lg:text-left">
              <Link
                to="/"
                className="group inline-flex items-center gap-1 text-primary hover:underline hover:underline-offset-4"
              >
                <ArrowLeft
                  aria-hidden="true"
                  className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5"
                />
                Back to home
              </Link>
            </p>

            <p className="mt-4 text-center text-xs leading-5 text-muted-foreground lg:text-left">
              By continuing, you agree to our{" "}
              <Link
                to="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-foreground"
              >
                Terms and Conditions
                <span className="sr-only"> (opens in a new tab)</span>
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-foreground"
              >
                Privacy Policy
                <span className="sr-only"> (opens in a new tab)</span>
              </Link>
              .
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}