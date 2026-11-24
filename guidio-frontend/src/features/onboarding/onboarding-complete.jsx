import { ArrowRight, BarChart3, BriefcaseBusiness, Check, Mic } from "lucide-react";
import { Link } from "react-router";
import { AiUsageNotice } from "@/components/common/ai-usage-notice";
import { Button, buttonVariants } from "@/components/ui/button";
import { mergeSkills } from "@/features/onboarding/onboarding-data";
import { cn } from "@/lib/utils";

const reveal = (delay) => ({
  animationDelay: `${delay}ms`,
  animationFillMode: "both",
});

const nextSteps = [
  {
    title: "Analyze your skill gap",
    description: "Compare your skills with your target role.",
    href: "/skill-gap",
    icon: BarChart3,
  },
  {
    title: "Explore career guidance",
    description: "Get a roadmap, projects and interview topics.",
    href: "/career-guidance",
    icon: BriefcaseBusiness,
  },
  {
    title: "Practice a mock interview",
    description: "Answer role-based questions and get feedback.",
    href: "/mock-interview",
    icon: Mic,
  },
];

function SummaryRow({ label, children }) {
  return (
    <div className="grid gap-0.5 py-3.5 first:pt-0 last:pb-0 sm:grid-cols-[10rem_1fr] sm:gap-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="min-w-0 break-words text-sm font-medium tracking-[-0.01em]">
        {children}
      </dd>
    </div>
  );
}

/**
 * Shown after the last step is saved, and when a student who has already
 * finished onboarding opens this page again. Everything shown here comes
 * from the saved answers.
 */
export function OnboardingComplete({ form, firstName, onEdit }) {
  const skills = mergeSkills(form.skills, form.languages);
  const degree = form.branch ? `${form.degree}, ${form.branch}` : form.degree;

  return (
    <div className="space-y-10 sm:space-y-12">
      <div className="space-y-4 text-center">
        <span
          style={reveal(0)}
          className="animate-in fade-in zoom-in-95 mx-auto flex size-14 items-center justify-center rounded-full bg-foreground text-background duration-700 motion-reduce:animate-none"
        >
          <Check aria-hidden="true" className="size-6" />
        </span>

        <h1
          style={reveal(80)}
          className="animate-in fade-in slide-in-from-bottom-3 text-[2.25rem] font-semibold leading-[1.05] tracking-[-0.035em] duration-700 motion-reduce:animate-none sm:text-5xl"
        >
          {firstName ? (
            <>
              You are all set,{" "}
              <span className="text-muted-foreground">{firstName}</span>
            </>
          ) : (
            "You are all set"
          )}
        </h1>

        <p
          style={reveal(160)}
          className="animate-in fade-in slide-in-from-bottom-3 mx-auto max-w-md text-base font-medium leading-snug tracking-[-0.01em] text-muted-foreground duration-700 motion-reduce:animate-none sm:text-lg"
        >
          Your profile is saved. Guidio AI will use it to personalize your skill
          analysis, career guidance and interview practice.
        </p>

        <div
          style={reveal(240)}
          className="animate-in fade-in slide-in-from-bottom-3 flex flex-col justify-center gap-3 pt-2 duration-700 motion-reduce:animate-none sm:flex-row"
        >
          <Link
            to="/dashboard"
            className={cn(
              buttonVariants(),
              "h-12 gap-2 rounded-full px-7 text-[0.9375rem]"
            )}
          >
            Go to dashboard
            <ArrowRight aria-hidden="true" />
          </Link>

          <Button
            type="button"
            variant="outline"
            onClick={onEdit}
            className="h-12 rounded-full px-7 text-[0.9375rem]"
          >
            Edit my answers
          </Button>
        </div>
      </div>

      <section
        aria-labelledby="ob-summary-title"
        className="rounded-[1.5rem] bg-muted p-3 sm:p-4"
      >
        <h2
          id="ob-summary-title"
          className="px-2 pb-4 pt-2 text-xl font-semibold leading-tight tracking-[-0.02em] sm:px-3"
        >
          Your profile
        </h2>

        <dl className="divide-y divide-foreground/10 rounded-2xl bg-background p-4 sm:p-6">
          <SummaryRow label="Name">{form.fullName || "Not set"}</SummaryRow>
          <SummaryRow label="Education">
            {form.education} · {form.college}
          </SummaryRow>
          <SummaryRow label="Degree">{degree}</SummaryRow>
          <SummaryRow label="Graduation year">{form.graduationYear}</SummaryRow>
          <SummaryRow label="Experience level">{form.experienceLevel}</SummaryRow>
          <SummaryRow label="Preferred role">{form.targetRole}</SummaryRow>
          <SummaryRow label="Skills and knowledge">{skills.join(", ")}</SummaryRow>
          <SummaryRow label="Interests">{form.interests.join(", ")}</SummaryRow>
        </dl>
      </section>

      <section aria-labelledby="ob-next-title" className="space-y-4">
        <h2
          id="ob-next-title"
          className="text-xl font-semibold leading-tight tracking-[-0.02em]"
        >
          What to do next
        </h2>

        <ul className="grid gap-3 sm:grid-cols-3">
          {nextSteps.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className="group flex h-full flex-col gap-6 rounded-[1.5rem] bg-muted p-5 outline-none transition-all duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring/60"
                >
                  <span className="flex size-10 items-center justify-center rounded-full bg-foreground text-background transition-transform duration-300 group-hover:scale-105">
                    <Icon aria-hidden="true" className="size-[18px]" />
                  </span>

                  <span className="mt-auto block">
                    <span className="block text-base font-semibold leading-tight tracking-[-0.02em]">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <AiUsageNotice className="justify-center text-center" />
    </div>
  );
}