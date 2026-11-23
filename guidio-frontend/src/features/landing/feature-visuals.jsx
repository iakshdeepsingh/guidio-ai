import { memo } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** Illustrations shown inside the feature detail panel. Decorative only. */

const assistantSteps = [
  "Revise the core subjects of your field",
  "Build one small project or case study",
  "Practise common interview questions",
];

const careerPhases = [
  { name: "Foundations", note: "Core concepts", state: "done" },
  { name: "Projects", note: "Build two portfolio pieces", state: "current" },
  { name: "Interview prep", note: "Mock rounds and revision", state: "next" },
];

function VisualFrame({ title, children }) {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-2xl border bg-card"
    >
      <div className="flex items-center justify-between border-b px-4 py-2.5">
        <span className="text-xs font-medium">{title}</span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Example
        </span>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}

function Meter({ label, value, tone = "bg-foreground", trailing }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="font-medium">{label}</span>
        {trailing ?? (
          <span className="tabular-nums text-muted-foreground">{value}%</span>
        )}
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "animate-in slide-in-from-left-full h-full rounded-full duration-700 motion-reduce:animate-none",
            tone,
          )}
          style={{ width: `${value}%`, animationFillMode: "both" }}
        />
      </div>
    </div>
  );
}

function Tag({ children, strong }) {
  return (
    <span
      className={cn(
        "rounded-full border px-2 py-0.5 text-[10px] font-medium",
        strong
          ? "border-foreground bg-foreground text-background"
          : "text-muted-foreground",
      )}
    >
      {children}
    </span>
  );
}

function Ring({ value, label }) {
  return (
    <div className="relative size-16 shrink-0">
      <svg viewBox="0 0 36 36" className="size-full -rotate-90">
        <circle
          cx="18"
          cy="18"
          r="15.9"
          fill="none"
          strokeWidth="3"
          pathLength="100"
          className="stroke-muted"
        />
        <circle
          cx="18"
          cy="18"
          r="15.9"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray={`${value} 100`}
          className="stroke-foreground"
        />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="text-sm font-semibold tabular-nums">{value}</span>
        <span className="mt-0.5 text-[9px] text-muted-foreground">{label}</span>
      </span>
    </div>
  );
}

function AssistantVisual() {
  return (
    <VisualFrame title="Student Assistant">
      <div className="space-y-3">
        <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-primary px-3.5 py-2.5 text-xs leading-relaxed text-primary-foreground">
          How do I prepare for my first job in my field?
        </p>

        <div className="w-fit max-w-[92%] rounded-2xl rounded-bl-md bg-muted px-3.5 py-3 text-xs leading-relaxed">
          <p className="font-medium">Here is a simple plan:</p>
          <ol className="mt-2 space-y-1.5 text-muted-foreground">
            {assistantSteps.map((step, index) => (
              <li key={step} className="flex gap-2">
                <span className="tabular-nums text-foreground">
                  {index + 1}.
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="flex items-center justify-between rounded-full border px-4 py-2 text-xs text-muted-foreground">
          Ask a follow-up question
          <span className="size-5 rounded-full bg-foreground" />
        </div>
      </div>
    </VisualFrame>
  );
}

function SkillGapVisual() {
  return (
    <VisualFrame title="Skill gap report">
      <div className="flex items-center gap-4 border-b pb-4">
        <Ring value={72} label="match" />
        <div className="min-w-0">
          <p className="text-sm font-semibold">Target role match</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            2 strengths, 3 skills to learn
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3.5">
        <Meter
          label="Communication"
          value={85}
          trailing={<Tag>Strength</Tag>}
        />
        <Meter
          label="Subject knowledge"
          value={55}
          tone="bg-foreground/60"
          trailing={<Tag>Medium</Tag>}
        />
        <Meter
          label="Presentation"
          value={20}
          tone="bg-foreground/30"
          trailing={<Tag strong>High priority</Tag>}
        />
      </div>
    </VisualFrame>
  );
}

function CareerVisual() {
  return (
    <VisualFrame title="Career roadmap">
      <div className="flex items-center gap-4 border-b pb-4">
        <Ring value={68} label="ready" />
        <div className="min-w-0">
          <p className="text-sm font-semibold">Readiness score</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            3 phases, 2 alternative roles
          </p>
        </div>
      </div>

      <ol className="mt-4">
        {careerPhases.map((phase, index) => (
          <li key={phase.name} className="relative flex gap-3 pb-4 last:pb-0">
            {index < careerPhases.length - 1 && (
              <span className="absolute left-[11px] top-6 h-[calc(100%-1.5rem)] w-px bg-border" />
            )}

            <span
              className={cn(
                "relative flex size-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-medium",
                phase.state === "done" &&
                  "border-foreground bg-foreground text-background",
                phase.state === "current" && "border-foreground bg-background",
                phase.state === "next" && "text-muted-foreground",
              )}
            >
              {phase.state === "done" ? (
                <Check className="size-3" />
              ) : (
                index + 1
              )}
            </span>

            <span className="min-w-0 pt-0.5">
              <span className="block text-xs font-medium">{phase.name}</span>
              <span className="block text-xs text-muted-foreground">
                {phase.note}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </VisualFrame>
  );
}

function InterviewVisual() {
  return (
    <VisualFrame title="Mock interview feedback">
      <p className="rounded-xl bg-muted px-3.5 py-3 text-xs leading-relaxed text-muted-foreground">
        <span className="mb-1 block text-[10px] uppercase tracking-wider">
          Question 3
        </span>
        <span className="text-foreground">
          Tell me about a project you are proud of.
        </span>
      </p>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Overall score</p>
          <p className="text-3xl font-semibold tabular-nums tracking-tight">
            7.4
            <span className="text-base font-normal text-muted-foreground">
              /10
            </span>
          </p>
        </div>
        <Tag>Session saved</Tag>
      </div>

      <div className="mt-4 space-y-3.5">
        <Meter label="Subject knowledge" value={78} />
        <Meter label="Communication" value={64} tone="bg-foreground/60" />
        <Meter label="Answer structure" value={48} tone="bg-foreground/35" />
      </div>
    </VisualFrame>
  );
}

const visuals = {
  assistant: AssistantVisual,
  "skill-gap": SkillGapVisual,
  career: CareerVisual,
  interview: InterviewVisual,
};

// Memoised: the illustrations are static, so they only need to render again
// if the `id` changes, not whenever the features section re-renders.
export const FeatureVisual = memo(function FeatureVisual({ id }) {
  const Visual = visuals[id];
  return Visual ? <Visual /> : null;
});