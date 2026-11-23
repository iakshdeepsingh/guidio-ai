import { memo } from "react";
import { ArrowUp, ArrowUpRight, Heart } from "lucide-react";
import { Link } from "react-router";

import { AiUsageNotice } from "@/components/common/ai-usage-notice";
import { Logo } from "@/components/common/logo";
import { navLinks } from "@/features/landing/landing-data";

const currentYear = new Date().getFullYear();

const productLinks = navLinks.map((link) => ({
  label: link.label,
  href: `#${link.id}`,
}));

const accountLinks = [
  { label: "Sign in", to: "/sign-in" },
  { label: "Create account", to: "/sign-up" },
];

const legalLinks = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms and Conditions", to: "/terms" },
];

const linkClass =
  "group inline-flex items-center gap-1 text-[0.8125rem] tracking-[-0.01em] text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:text-foreground focus-visible:outline-none";

function scrollToTop() {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="text-xs font-semibold tracking-tight text-foreground">
        {title}
      </h3>

      <ul role="list" className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            {link.to ? (
              <Link to={link.to} className={linkClass}>
                {link.label}
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-3 -translate-x-1 opacity-0 transition-[transform,opacity] duration-200 motion-reduce:transition-none group-hover:translate-x-0 group-hover:opacity-100"
                />
              </Link>
            ) : (
              <a href={link.href} className={linkClass}>
                {link.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export const LandingFooter = memo(function LandingFooter() {
  return (
    <footer className="relative isolate overflow-hidden bg-muted/60">
      <div className="container max-w-6xl pb-8 pt-12 sm:pt-16">
        {/* Top: brand + back to top */}
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-sm text-[0.9375rem] font-medium leading-snug tracking-[-0.01em] text-muted-foreground">
              Your AI-powered career companion. Discover your potential,
              develop essential skills, and prepare for the opportunities
              ahead.
            </p>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="group flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background outline-none transition-transform duration-300 motion-reduce:transition-none hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring/60"
          >
            <ArrowUp
              aria-hidden="true"
              className="size-4 transition-transform duration-300 motion-reduce:transition-none group-hover:-translate-y-0.5"
            />
          </button>
        </div>

        {/* Link columns */}
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-foreground/10 pt-10 sm:grid-cols-3">
          <FooterColumn title="Explore" links={productLinks} />
          <FooterColumn title="Account" links={accountLinks} />
          <FooterColumn title="Legal" links={legalLinks} />
        </div>

        {/* AI usage notice */}
        <div className="mt-10 rounded-[1.25rem] bg-background p-4 sm:p-5">
          <AiUsageNotice className="max-w-3xl" />
        </div>

        {/* Fine print */}
        <div className="mt-8 flex flex-col gap-3 border-t border-foreground/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Guidio AI. All rights reserved.
          </p>

          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            Made for students with
            <Heart
              aria-hidden="true"
              className="size-3.5 fill-foreground text-foreground"
            />
            <span className="sr-only">love</span>
          </p>
        </div>
      </div>

      {/* Big faded wordmark */}
      <p
        aria-hidden="true"
        className="pointer-events-none -mb-[0.2em] select-none text-center text-[clamp(4rem,19vw,15rem)] font-semibold leading-[0.8] tracking-[-0.06em] text-foreground/[0.05]"
      >
        Guidio AI
      </p>
    </footer>
  );
});