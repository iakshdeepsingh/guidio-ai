import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/react";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/common/logo";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CtaLink, PrimaryCta } from "@/features/landing/cta-link";
import { navLinks } from "@/features/landing/landing-data";
import { cn } from "@/lib/utils";

const pad = (n) => String(n).padStart(2, "0");

function scrollToSection(id, headerEl) {
  const el = document.getElementById(id);
  if (!el) return;

  const offset = headerEl ? headerEl.offsetHeight : 0;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
  window.history.replaceState(null, "", `#${id}`);
}

function AuthActions({ fullWidth = false }) {
  const { isLoaded, isSignedIn } = useAuth();
  const showSignIn = isLoaded && !isSignedIn;

  const sizing = fullWidth
    ? "h-12 w-full rounded-full text-base"
    : "h-7 rounded-full px-3 text-xs";

  return (
    <>
      {showSignIn ? (
        <CtaLink
          to="/sign-in"
          variant={fullWidth ? "outline" : "ghost"}
          size="md"
          className={sizing}
        >
          Sign in
        </CtaLink>
      ) : null}
      <PrimaryCta size="md" className={sizing} />
    </>
  );
}

export function LandingNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState(null);

  const headerRef = useRef(null);
  const progressRef = useRef(null);
  const navigateTimer = useRef(null);

  // Border + page progress (no React re-render while scrolling)
  useEffect(() => {
    let maxScroll = 0;
    let ticking = false;

    const measure = () => {
      maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
    };

    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const progress = maxScroll > 0 ? Math.min(y / maxScroll, 1) : 0;

      setScrolled(y > 0); // React skips the render if the value is unchanged

      const bar = progressRef.current;
      if (bar) {
        bar.style.transform = `scaleX(${progress})`;
        bar.style.opacity = y > 0 ? "1" : "0";
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    // Page height changes when images/fonts/content load
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      resizeObserver.disconnect();
    };
  }, []);

  // Highlight the link of the section in view. Sections are lazy-loaded, so
  // new ones are picked up as they appear in the page.
  useEffect(() => {
    const observed = new Set();

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const { id } = entry.target;
          if (entry.isIntersecting) {
            setActiveId(id);
          } else {
            // Clear only if this section was the active one
            setActiveId((prev) => (prev === id ? null : prev));
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    const sync = () => {
      // Stop watching elements that were removed (placeholders)
      observed.forEach((el) => {
        if (!el.isConnected) {
          intersectionObserver.unobserve(el);
          observed.delete(el);
        }
      });

      // Start watching sections that are now in the page
      navLinks.forEach((link) => {
        const el = document.getElementById(link.id);
        if (el && !observed.has(el)) {
          observed.add(el);
          intersectionObserver.observe(el);
        }
      });
    };

    let raf = 0;
    const scheduleSync = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        sync();
      });
    };

    sync();

    const mutationObserver = new MutationObserver(scheduleSync);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      intersectionObserver.disconnect();
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  // Close the mobile menu if the viewport grows to desktop width
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (event) => {
      if (event.matches) setMenuOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Clean up pending navigation timer on unmount
  useEffect(() => {
    return () => window.clearTimeout(navigateTimer.current);
  }, []);

  const handleDesktopNavigate = useCallback((event, id) => {
    event.preventDefault();
    scrollToSection(id, headerRef.current);
  }, []);

  const handleMobileNavigate = useCallback((event, id) => {
    event.preventDefault();
    setMenuOpen(false);

    // Wait for the sheet to close and release the scroll lock
    window.clearTimeout(navigateTimer.current);
    navigateTimer.current = window.setTimeout(() => {
      scrollToSection(id, headerRef.current);
    }, 250);
  }, []);

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-40 w-full border-b bg-background/72 backdrop-blur-[20px] backdrop-saturate-[1.8] transition-colors duration-300",
        scrolled ? "border-foreground/10" : "border-transparent",
      )}
    >
      <div className="mx-auto flex h-12 max-w-[1024px] items-center justify-between px-5 lg:h-11 lg:px-4">
        <Logo />

        <nav
          aria-label="Main"
          className="hidden flex-1 items-center justify-evenly px-10 lg:flex"
        >
          {navLinks.map((link) => {
            const isActive = link.id === activeId;

            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(event) => handleDesktopNavigate(event, link.id)}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "relative py-1 text-xs tracking-[-0.01em] transition-colors duration-200 hover:text-foreground focus-visible:text-foreground focus-visible:outline-none",
                  isActive ? "text-foreground" : "text-foreground/70",
                )}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute -bottom-0.5 left-1/2 h-px -translate-x-1/2 rounded-full bg-foreground transition-all duration-300",
                    isActive ? "w-full opacity-100" : "w-0 opacity-0",
                  )}
                />
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <ModeToggle />

          <div className="hidden items-center gap-1 lg:flex">
            <AuthActions />
          </div>

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              aria-label="Open menu"
              className="group flex size-10 items-center justify-center rounded-full text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none lg:hidden"
            >
              <span aria-hidden="true" className="flex flex-col gap-[6px]">
                <span className="block h-px w-[17px] bg-current transition-transform duration-300 group-hover:translate-x-0.5" />
                <span className="block h-px w-[17px] bg-current transition-transform duration-300 group-hover:-translate-x-0.5" />
              </span>
            </SheetTrigger>

            <SheetContent
              side="top"
              className="h-dvh max-h-none w-full gap-0 border-0 bg-background/95 data-[side=top]:max-h-none"
            >
              <SheetHeader className="flex h-12 flex-row items-center justify-between border-0 px-5 py-0">
                <Logo />
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <SheetDescription className="sr-only">
                  Navigate around the Guidio AI home page.
                </SheetDescription>
              </SheetHeader>

              <nav
                aria-label="Mobile"
                className="flex flex-1 flex-col overflow-y-auto px-8 pt-6"
              >
                {navLinks.map((link, index) => (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={(event) => handleMobileNavigate(event, link.id)}
                    style={{
                      animationDelay: `${120 + index * 60}ms`,
                      animationFillMode: "both",
                    }}
                    className="group animate-in fade-in slide-in-from-bottom-2 flex items-baseline justify-between gap-4 border-b border-foreground/10 py-4 duration-500"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="font-mono text-xs tabular-nums text-muted-foreground">
                        {pad(index + 1)}
                      </span>
                      <span className="text-[2rem] font-semibold leading-tight tracking-[-0.03em] text-foreground/90 transition-colors group-hover:text-foreground">
                        {link.label}
                      </span>
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-5 shrink-0 self-center text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                ))}
              </nav>

              <div
                style={{ animationDelay: "420ms", animationFillMode: "both" }}
                className="animate-in fade-in flex flex-col gap-3 px-8 pb-8 pt-4 duration-500"
              >
                <AuthActions fullWidth />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Page progress (updated via ref, not state) */}
      <span
        ref={progressRef}
        aria-hidden="true"
        className="absolute inset-x-0 bottom-[-1px] h-px origin-left bg-foreground/60 transition-opacity duration-300 will-change-transform"
        style={{ transform: "scaleX(0)", opacity: 0 }}
      />
    </header>
  );
}