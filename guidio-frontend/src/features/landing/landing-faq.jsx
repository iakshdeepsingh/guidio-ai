import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/features/landing/landing-data";
import { SectionHeading } from "@/features/landing/section-heading";
import { cn } from "@/lib/utils";

// Duration is set here so the hover transition can keep its own, shorter one.
const reveal = (delay) => ({
  animationDelay: `${delay}ms`,
  animationDuration: "700ms",
  animationFillMode: "both",
});

const pad = (n) => String(n).padStart(2, "0");

export function LandingFaq() {
  const listRef = useRef(null);
  const [revealed, setRevealed] = useState(false);

  // Play the entrance once, when the questions are about to be seen.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="faq" className="scroll-mt-20 py-16 sm:py-24">
      <div className="container max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          {/* Left: stays in view while the questions scroll */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              align="left"
              eyebrow="FAQ"
              title="Questions students ask."
              description="Everything you need to know about getting started with Guidio AI."
            />

            <div className="relative mt-8 hidden overflow-hidden rounded-[2rem] bg-foreground p-8 text-background lg:block">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-2 -top-8 select-none text-[9rem] font-semibold leading-none text-background/10"
              >
                ?
              </span>

              <p className="relative text-2xl font-semibold leading-tight tracking-[-0.03em]">
                Still have questions?
              </p>
              <p className="relative mt-3 max-w-xs text-[0.9375rem] leading-relaxed text-background/70">
                We're here to help you understand how Guidio AI can support
                your learning and career journey.
              </p>
            </div>
          </div>

          {/* Questions */}
          <div ref={listRef}>
            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={faq.value}
                  value={faq.value}
                  style={reveal(index * 70)}
                  className={cn(
                    "rounded-[1.5rem] border-b-0 bg-muted px-5 transition-colors duration-300 motion-reduce:transition-none hover:bg-foreground/[0.07] sm:rounded-[1.75rem] sm:px-7",
                    revealed
                      ? "animate-in fade-in slide-in-from-bottom-3 motion-reduce:animate-none"
                      : "opacity-0",
                  )}
                >
                  <AccordionTrigger className="group/trigger gap-4 py-5 text-left text-lg font-semibold tracking-[-0.02em] hover:no-underline sm:py-6 sm:text-xl [&>svg]:hidden">
                    <span className="flex min-w-0 items-baseline gap-4">
                      <span className="shrink-0 font-mono text-xs font-medium tabular-nums text-muted-foreground">
                        {pad(index + 1)}
                      </span>
                      <span className="leading-snug">{faq.question}</span>
                    </span>

                    <span
                      aria-hidden="true"
                      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-transform duration-300 motion-reduce:transition-none group-data-[state=open]/trigger:rotate-45"
                    >
                      <Plus className="size-4" />
                    </span>
                  </AccordionTrigger>

                  <AccordionContent className="pb-6 pr-12 text-base leading-relaxed text-muted-foreground sm:pb-7 sm:pl-[2.25rem] sm:text-[1.0625rem]">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}