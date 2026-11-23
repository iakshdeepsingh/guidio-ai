import { useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";
import { CtaLink, PrimaryCta } from "@/features/landing/cta-link";
import { DashboardPreview } from "@/features/landing/dashboard-preview";
import { features } from "@/features/landing/landing-data";

const reveal = (delay) => ({
  animationDelay: `${delay}ms`,
  animationFillMode: "both",
});

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);

// Distance from the top of the page, ignoring CSS transforms/animations.
const pageTop = (el) => {
  let y = 0;
  let node = el;
  while (node) {
    y += node.offsetTop;
    node = node.offsetParent;
  }
  return y;
};

export function LandingHero() {
  const sectionRef = useRef(null);
  const copyRef = useRef(null);
  const frameRef = useRef(null);

  // Scroll-linked motion: the preview starts tilted back and settles flat as
  // it scrolls into view, while the headline softly fades out.
  useEffect(() => {
    const section = sectionRef.current;
    const copy = copyRef.current;
    const frame = frameRef.current;
    if (!section || !copy || !frame) return undefined;

    const anchor = frame.parentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    let vh = window.innerHeight;
    let anchorTop = 0;
    let raf = 0;
    let visible = true;
    let active = false;

    const measure = () => {
      vh = window.innerHeight;
      anchorTop = pageTop(anchor);
    };

    const update = () => {
      raf = 0;
      const y = window.scrollY;

      // 0 when the preview enters the screen, 1 when it is near the top third.
      const t = clamp((vh - (anchorTop - y)) / (vh * 0.95));
      const fade = clamp(y / (vh * 0.7));

      frame.style.transform = `rotateX(${((1 - t) * 16).toFixed(2)}deg) scale(${(
        0.9 +
        t * 0.1
      ).toFixed(3)})`;
      copy.style.opacity = (1 - fade * 0.65).toFixed(3);
      copy.style.transform = `translate3d(0, ${(fade * -24).toFixed(1)}px, 0)`;
    };

    const onScroll = () => {
      if (visible && !raf) raf = window.requestAnimationFrame(update);
    };

    const onResize = () => {
      measure();
      onScroll();
    };

    const resizeObserver = new ResizeObserver(onResize);

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      // One last update so the final state is correct when leaving the screen.
      update();
    });

    const start = () => {
      if (active) return;
      active = true;
      measure();
      update();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);
      resizeObserver.observe(section);
      visibilityObserver.observe(section);
    };

    const stop = () => {
      if (!active) return;
      active = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      if (raf) window.cancelAnimationFrame(raf);
      raf = 0;
    };

    const sync = () => {
      if (reduce.matches) {
        stop();
        frame.style.transform = "none";
        copy.style.opacity = "1";
        copy.style.transform = "none";
      } else {
        start();
      }
    };

    sync();
    reduce.addEventListener("change", sync);

    return () => {
      reduce.removeEventListener("change", sync);
      stop();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative isolate overflow-hidden">
      <div className="container max-w-6xl pb-16 pt-14 sm:pb-24 sm:pt-20 lg:pt-24">
        <div
          ref={copyRef}
          className="mx-auto max-w-[1040px] text-center will-change-[transform,opacity]"
        >
          <p
            style={reveal(0)}
            className="animate-in fade-in slide-in-from-bottom-2 text-sm font-semibold tracking-tight text-muted-foreground duration-700 motion-reduce:animate-none sm:text-base"
          >
            Free AI career companion for students
          </p>

          <h1
            style={reveal(80)}
            className="animate-in fade-in slide-in-from-bottom-3 mt-3 text-[3rem] font-semibold leading-[1.02] tracking-[-0.04em] duration-700 motion-reduce:animate-none sm:text-7xl lg:text-[6rem]"
          >
            Your Career. Your Potential.{" "}
            <span className="text-muted-foreground">Powered by AI.</span>
          </h1>

          <p
            style={reveal(180)}
            className="animate-in fade-in slide-in-from-bottom-3 mx-auto mt-6 max-w-2xl text-lg font-medium leading-snug tracking-[-0.01em] text-muted-foreground duration-700 motion-reduce:animate-none sm:text-xl lg:text-[1.375rem]"
          >
            Discover your strengths, identify skill gaps, explore career
            opportunities and prepare for interviews with your personal AI
            career companion.
          </p>

          <div
            style={reveal(280)}
            className="animate-in fade-in slide-in-from-bottom-3 mt-9 flex flex-col items-center justify-center gap-4 duration-700 motion-reduce:animate-none sm:flex-row sm:gap-7"
          >
            <PrimaryCta className="h-12 w-full rounded-full px-7 text-[1.0625rem] sm:w-auto" />

            <CtaLink
              href="#features"
              variant="ghost"
              className="group h-auto gap-0.5 rounded-full p-0 text-[1.0625rem] font-normal text-primary hover:bg-transparent hover:text-primary hover:underline hover:underline-offset-4"
            >
              Explore Features
              <ChevronRight
                aria-hidden="true"
                className="size-5 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </CtaLink>
          </div>

          <p
            style={reveal(360)}
            className="animate-in fade-in mt-5 text-xs text-muted-foreground duration-700 motion-reduce:animate-none"
          >
            Free for students. AI features use free AI services, so usage
            limits may apply.
          </p>
        </div>

        {/* Preview: outer div plays the entrance, inner div follows the scroll */}
        <div
          style={reveal(450)}
          className="animate-in fade-in slide-in-from-bottom-8 mx-auto mt-14 max-w-5xl duration-1000 motion-reduce:animate-none sm:mt-20 [perspective:1600px]"
        >
          <div
            ref={frameRef}
            className="origin-top will-change-transform"
            style={{ transform: "rotateX(16deg) scale(0.9)" }}
          >
            <div className="rounded-[1.5rem] border border-foreground/10 bg-muted/40 p-1.5 shadow-[0_50px_100px_-45px] shadow-foreground/40 sm:rounded-[2rem] sm:p-3">
              <div className="overflow-hidden rounded-[1.1rem] border border-foreground/10 bg-background sm:rounded-[1.4rem]">
                <DashboardPreview />
              </div>
            </div>
          </div>
        </div>

        {/* Bridge to the features section */}
        <div
          style={reveal(600)}
          className="animate-in fade-in mt-10 flex flex-col items-center gap-3 duration-1000 motion-reduce:animate-none sm:mt-14"
        >
          <p className="text-xs font-semibold tracking-tight text-muted-foreground">
            Four tools in one place
          </p>

          <ul className="flex flex-wrap justify-center gap-2">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <li key={feature.id}>
                  <a
                    href="#features"
                    className="flex items-center gap-2 rounded-full bg-muted px-3.5 py-2 text-xs font-medium tracking-tight text-foreground outline-none transition-colors hover:bg-foreground hover:text-background focus-visible:ring-2 focus-visible:ring-ring/60 sm:text-[0.8125rem]"
                  >
                    <Icon aria-hidden="true" className="size-3.5" />
                    {feature.title}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}