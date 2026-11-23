import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/react";
import { Sparkles } from "lucide-react";

import { CtaLink, PrimaryCta } from "@/features/landing/cta-link";
import { cn } from "@/lib/utils";

const highlights = ["4 AI tools", "Every field of study", "Free for students"];

function SignInLink() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded || isSignedIn) return null;

  return (
    <CtaLink
      to="/sign-in"
      variant="ghost"
      className="group h-auto gap-0.5 rounded-full p-0 text-[1.0625rem] font-normal text-background hover:bg-transparent hover:text-background hover:underline hover:underline-offset-4"
    >
      I already have an account
    </CtaLink>
  );
}

export function LandingCta() {
  const cardRef = useRef(null);
  const [revealed, setRevealed] = useState(false);

  // Play the entrance once, when the card is about to be seen.
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="container max-w-6xl pb-16 sm:pb-24">
      <div
        ref={cardRef}
        className={cn(
          "group relative isolate overflow-hidden rounded-[1.75rem] bg-foreground px-6 py-16 text-center text-background duration-700 sm:rounded-[2rem] sm:px-12 sm:py-24",
          revealed
            ? "animate-in fade-in slide-in-from-bottom-4 motion-reduce:animate-none"
            : "opacity-0",
        )}
      >
        {/* Big faded artwork */}
        <Sparkles
          aria-hidden="true"
          strokeWidth={1}
          className="pointer-events-none absolute -right-10 -top-10 -z-10 size-64 text-background/[0.07] transition-transform duration-1000 motion-reduce:transition-none group-hover:rotate-12 group-hover:scale-110 sm:-right-6 sm:size-96"
        />
        <Sparkles
          aria-hidden="true"
          strokeWidth={1}
          className="pointer-events-none absolute -bottom-16 -left-12 -z-10 size-52 text-background/[0.05] transition-transform duration-1000 motion-reduce:transition-none group-hover:-rotate-12 group-hover:scale-110 sm:size-80"
        />

        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold tracking-tight text-background/60 sm:text-base">
            Your next step starts here
          </p>

          <h2 className="mt-3 text-[2.25rem] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-6xl lg:text-[4rem]">
            Ready to take the next step in your career?
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base font-medium leading-snug tracking-[-0.01em] text-background/70 sm:text-xl">
            Build your skills, explore career opportunities and prepare for
            interviews with Guidio AI.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-7">
            <PrimaryCta
              variant="secondary"
              className="h-12 w-full rounded-full px-7 text-[1.0625rem] sm:w-auto"
            />

            <SignInLink />
          </div>

          <ul
            role="list"
            className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-background/15 pt-6 text-xs font-medium text-background/60 sm:text-sm"
          >
            {highlights.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="size-1 rounded-full bg-background/40"
                />
                {item}
              </li>
            ))}
          </ul>

          <p className="mt-5 text-xs text-background/50">
            AI usage limits may apply
          </p>
        </div>
      </div>
    </section>
  );
}