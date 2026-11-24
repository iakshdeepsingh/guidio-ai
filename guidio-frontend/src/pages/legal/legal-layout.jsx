import { useEffect } from "react";
import { Link } from "react-router";

import { Logo } from "@/components/common/logo";
import { ModeToggle } from "@/components/mode-toggle";
import { SkipLink } from "@/components/skip-link";
import { LEGAL } from "@/lib/site-config";

const reveal = (delay) => ({
  animationDelay: `${delay}ms`,
  animationFillMode: "both",
});

/** Highlights information that still has to be supplied by the site owner. */
export function Placeholder({ children }) {
  return (
    <mark className="rounded bg-warning/20 px-1 py-0.5 font-medium text-foreground">
      {children}
    </mark>
  );
}

/** An underlined in-text link to another page of the site. */
export function TextLink({ to, children }) {
  return (
    <Link
      to={to}
      className="font-medium text-foreground underline underline-offset-4 transition-opacity hover:opacity-70"
    >
      {children}
    </Link>
  );
}

/** A clickable mailto link to the contact email set in LEGAL.contactEmail. */
export function EmailLink() {
  return (
    <a
      href={`mailto:${LEGAL.contactEmail}`}
      className="font-medium text-foreground underline underline-offset-4 transition-opacity hover:opacity-70"
    >
      {LEGAL.contactEmail}
    </a>
  );
}

export function LegalSection({ id, title, children }) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-24 space-y-4 border-t border-foreground/10 pt-8 first:border-t-0 first:pt-0"
    >
      <h2
        id={`${id}-title`}
        className="text-[1.375rem] font-semibold leading-tight tracking-[-0.02em] sm:text-2xl"
      >
        {title}
      </h2>

      <div className="space-y-4 text-base leading-7 text-muted-foreground [&_strong]:font-semibold [&_strong]:text-foreground">
        {children}
      </div>
    </section>
  );
}

export function LegalList({ children }) {
  return (
    <ul className="list-disc space-y-2 pl-5 marker:text-foreground/30">
      {children}
    </ul>
  );
}

const footerLinkClass =
  "text-[0.8125rem] tracking-[-0.01em] text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none";

/** Shared page shell for the Privacy Policy and the Terms and Conditions. */
export function LegalLayout({ title, updated, children }) {
  // Opening a legal page from the footer must start at the top of the page.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SkipLink />

      <header className="sticky top-0 z-40 border-b border-foreground/10 bg-background/72 backdrop-blur-[20px] backdrop-saturate-[1.8]">
        <div className="container flex h-12 max-w-6xl items-center justify-between gap-4">
          <Logo />
          <ModeToggle />
        </div>
      </header>

      <main id="main-content" className="flex-1">
        {/* Title block */}
        <div className="border-b border-foreground/10 bg-muted/40">
          <div className="container max-w-3xl py-14 sm:py-20">
            <p
              style={reveal(0)}
              className="animate-in fade-in slide-in-from-bottom-2 text-sm font-semibold tracking-tight text-muted-foreground duration-700 sm:text-base"
            >
              Legal
            </p>

            <h1
              style={reveal(80)}
              className="animate-in fade-in slide-in-from-bottom-3 mt-3 text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.035em] duration-700 sm:text-6xl"
            >
              {title}
            </h1>

            <p
              style={reveal(160)}
              className="animate-in fade-in slide-in-from-bottom-3 mt-5 inline-flex rounded-full bg-background px-3.5 py-1.5 text-xs font-medium text-muted-foreground duration-700"
            >
              Last updated: {updated}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container max-w-3xl py-12 sm:py-16">
          <div className="space-y-8">{children}</div>
        </div>
      </main>

      <footer className="bg-muted/60">
        <div className="container flex max-w-6xl flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2">
            <Link to="/privacy" className={footerLinkClass}>
              Privacy Policy
            </Link>

            <Link to="/terms" className={footerLinkClass}>
              Terms and Conditions
            </Link>

            <Link to="/" className={footerLinkClass}>
              Home
            </Link>
          </nav>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Guidio AI
          </p>
        </div>
      </footer>
    </div>
  );
}