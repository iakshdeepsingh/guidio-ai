import { useAuth } from "@clerk/react";
import { ChevronRight } from "lucide-react";
import { Logo } from "@/components/common/logo";
import { ModeToggle } from "@/components/mode-toggle";
import { SkipLink } from "@/components/skip-link";
import { CtaLink } from "@/features/landing/cta-link";

const reveal = (delay) => ({
  animationDelay: `${delay}ms`,
  animationFillMode: "both",
});

/** Shown for any URL that does not match a page of the site. */
function NotFoundPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const signedIn = isLoaded && isSignedIn;

  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
      <SkipLink />

      <header className="border-b border-transparent">
        <div className="container flex h-14 max-w-6xl items-center justify-between">
          <Logo />
          <ModeToggle />
        </div>
      </header>

      <main
        id="main-content"
        className="container relative flex max-w-3xl flex-1 flex-col items-center justify-center py-16 text-center sm:py-24"
      >
        {/* Big faded number behind the text */}
        <p
          aria-hidden="true"
          style={reveal(0)}
          className="animate-in fade-in zoom-in-95 pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 select-none text-[clamp(11rem,46vw,26rem)] font-semibold leading-none tracking-[-0.06em] text-foreground/[0.05] duration-1000"
        >
          404
        </p>

        <p
          style={reveal(80)}
          className="animate-in fade-in slide-in-from-bottom-2 text-sm font-semibold tracking-tight text-muted-foreground duration-700 sm:text-base"
        >
          Error 404
        </p>

        <h1
          style={reveal(160)}
          className="animate-in fade-in slide-in-from-bottom-3 mt-3 text-[2.75rem] font-semibold leading-[1.05] tracking-[-0.035em] duration-700 sm:text-6xl lg:text-[4.5rem]"
        >
          Page not found.{" "}
          <span className="text-muted-foreground">Let&apos;s get you back.</span>
        </h1>

        <p
          style={reveal(260)}
          className="animate-in fade-in slide-in-from-bottom-3 mx-auto mt-6 max-w-xl text-lg font-medium leading-snug tracking-[-0.01em] text-muted-foreground duration-700 sm:text-xl"
        >
          The page you are looking for does not exist or may have moved. Check
          the address, or go back to a page that works.
        </p>

        <div
          style={reveal(360)}
          className="animate-in fade-in slide-in-from-bottom-3 mt-9 flex w-full flex-col items-center justify-center gap-4 duration-700 sm:w-auto sm:flex-row sm:gap-7"
        >
          <CtaLink
            to="/"
            className="h-12 w-full rounded-full px-7 text-[1.0625rem] sm:w-auto"
          >
            Back to Home
          </CtaLink>

          {signedIn ? (
            <CtaLink
              to="/dashboard"
              variant="ghost"
              className="group h-auto gap-0.5 rounded-full p-0 text-[1.0625rem] font-normal text-primary hover:bg-transparent hover:text-primary hover:underline hover:underline-offset-4"
            >
              Go to Dashboard
              <ChevronRight
                aria-hidden="true"
                className="size-5 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </CtaLink>
          ) : null}
        </div>
      </main>
    </div>
  );
}

export default NotFoundPage;