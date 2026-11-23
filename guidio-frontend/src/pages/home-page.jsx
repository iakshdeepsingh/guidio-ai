import { lazy, Suspense, useEffect } from "react";
import { SkipLink } from "@/components/skip-link";
import { LandingFooter } from "@/features/landing/landing-footer";
import { LandingHero } from "@/features/landing/landing-hero";
import { LandingNavbar } from "@/features/landing/landing-navbar";

// The sections use named exports, so map them to `default` for React.lazy.
const loaders = {
  features: () =>
    import("@/features/landing/landing-features").then((m) => ({
      default: m.LandingFeatures,
    })),
  howItWorks: () =>
    import("@/features/landing/landing-how-it-works").then((m) => ({
      default: m.LandingHowItWorks,
    })),
  journey: () =>
    import("@/features/landing/landing-journey").then((m) => ({
      default: m.LandingJourney,
    })),
  benefits: () =>
    import("@/features/landing/landing-benefits").then((m) => ({
      default: m.LandingBenefits,
    })),
  faq: () =>
    import("@/features/landing/landing-faq").then((m) => ({
      default: m.LandingFaq,
    })),
  cta: () =>
    import("@/features/landing/landing-cta").then((m) => ({
      default: m.LandingCta,
    })),
};

const LandingFeatures = lazy(loaders.features);
const LandingHowItWorks = lazy(loaders.howItWorks);
const LandingJourney = lazy(loaders.journey);
const LandingBenefits = lazy(loaders.benefits);
const LandingFaq = lazy(loaders.faq);
const LandingCta = lazy(loaders.cta);

// Keeps the section's id and rough height while its code loads, so anchor
// links still have a target and the page does not jump when it appears.
function SectionPlaceholder({ id, minHeight }) {
  return <div id={id} aria-hidden="true" style={{ minHeight }} />;
}

function HomePage() {
  // Download the remaining sections in the background once the browser is idle.
  useEffect(() => {
    const prefetch = () => Object.values(loaders).forEach((load) => load());

    if ("requestIdleCallback" in window) {
      const handle = window.requestIdleCallback(prefetch, { timeout: 3000 });
      return () => window.cancelIdleCallback(handle);
    }

    const timer = window.setTimeout(prefetch, 1500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    // overflow-x-clip stops big faded icons and the swipe row from causing
    // sideways scroll on phones. Unlike overflow-hidden, it keeps the
    // sticky tiles in the Journey section working.
    <div className="min-h-screen overflow-x-clip bg-background text-foreground">
      <SkipLink />

      <LandingNavbar />

      <main id="main-content">
        <LandingHero />

        <Suspense
          fallback={<SectionPlaceholder id="features" minHeight="52rem" />}
        >
          <LandingFeatures />
        </Suspense>

        <Suspense
          fallback={<SectionPlaceholder id="how-it-works" minHeight="40rem" />}
        >
          <LandingHowItWorks />
        </Suspense>

        <Suspense
          fallback={<SectionPlaceholder id="journey" minHeight="70rem" />}
        >
          <LandingJourney />
        </Suspense>

        <Suspense
          fallback={<SectionPlaceholder id="benefits" minHeight="60rem" />}
        >
          <LandingBenefits />
        </Suspense>

        <Suspense
          fallback={<SectionPlaceholder id="faq" minHeight="45rem" />}
        >
          <LandingFaq />
        </Suspense>

        <Suspense fallback={<SectionPlaceholder minHeight="30rem" />}>
          <LandingCta />
        </Suspense>
      </main>

      <LandingFooter />
    </div>
  );
}

export default HomePage;