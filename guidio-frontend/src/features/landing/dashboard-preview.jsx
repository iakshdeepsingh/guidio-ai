import { memo } from "react";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  BriefcaseBusiness,
  LayoutDashboard,
  Mic,
  Target,
  UserRound,
} from "lucide-react";

import { LogoMark } from "@/components/common/logo";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "My Profile", icon: UserRound },
  { label: "AI Assistant", icon: BrainCircuit },
  { label: "Skill Gap", icon: BarChart3 },
  { label: "Career Guidance", icon: BriefcaseBusiness },
  { label: "Mock Interview", icon: Mic },
];

const stats = [
  {
    label: "Skill match",
    value: "78%",
    hint: "For Marketing Executive",
    icon: BarChart3,
  },
  {
    label: "Mock interviews",
    value: "4",
    hint: "4 completed",
    icon: Mic,
  },
  {
    label: "Average score",
    value: "82/100",
    hint: "From 4 completed",
    icon: Target,
  },
  {
    label: "Questions asked",
    value: "24",
    hint: "Messages sent to AI",
    icon: BrainCircuit,
  },
];

const nextSteps = [
  {
    title: "Review your skill gap",
    description: "Focus on your highest-priority skills",
    icon: BarChart3,
  },
  {
    title: "Practice a mock interview",
    description: "Build confidence for your target role",
    icon: Mic,
  },
];

const tile = "rounded-2xl bg-muted/70 p-3.5 sm:p-4";

// Ring maths is constant, so compute it once instead of on every render.
const RING_RADIUS = 34;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const READINESS_SCORE = 76;
const RING_OFFSET = RING_CIRCUMFERENCE * (1 - READINESS_SCORE / 100);

function StatPreview({ stat }) {
  const Icon = stat.icon;

  return (
    <div className={cn(tile, "min-w-0")}>
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-[10px] font-medium tracking-tight text-muted-foreground sm:text-[11px]">
          {stat.label}
        </p>
        <Icon
          aria-hidden="true"
          className="hidden size-3.5 shrink-0 text-muted-foreground sm:block"
        />
      </div>

      <p className="mt-2 truncate text-xl font-semibold tabular-nums tracking-[-0.03em] sm:text-2xl">
        {stat.value}
      </p>

      <p className="mt-0.5 truncate text-[10px] text-muted-foreground sm:text-[11px]">
        {stat.hint}
      </p>
    </div>
  );
}

function ReadinessPreview() {
  return (
    <div className={tile}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-tight">
            Career readiness
          </p>
          <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">
            Based on your current progress
          </p>
        </div>
        <Target
          aria-hidden="true"
          className="size-4 shrink-0 text-muted-foreground"
        />
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="relative size-[84px] shrink-0">
          <svg
            viewBox="0 0 90 90"
            className="size-full -rotate-90"
            aria-hidden="true"
          >
            <circle
              cx="45"
              cy="45"
              r={RING_RADIUS}
              fill="none"
              strokeWidth="8"
              className="stroke-foreground/10"
            />
            <circle
              cx="45"
              cy="45"
              r={RING_RADIUS}
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={RING_OFFSET}
              className="stroke-foreground"
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-semibold tabular-nums tracking-[-0.03em]">
              {READINESS_SCORE}
            </span>
          </div>
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold">Good progress</p>
          <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
            Complete more practice to improve your readiness.
          </p>
        </div>
      </div>
    </div>
  );
}

function ProfilePreview() {
  return (
    <div className={tile}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-tight">
            Profile completion
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            Personalise your Guidio AI experience
          </p>
        </div>
        <span className="text-sm font-semibold tabular-nums">86%</span>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-foreground/10">
        <div
          className="h-full rounded-full bg-foreground"
          style={{ width: "86%" }}
        />
      </div>

      <dl className="mt-4 space-y-2 text-[10px]">
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Target role</dt>
          <dd className="truncate font-medium">Marketing Executive</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Education</dt>
          <dd className="font-medium">Bachelor's</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Skills</dt>
          <dd className="font-medium">8 added</dd>
        </div>
      </dl>
    </div>
  );
}

function NextStepsPreview() {
  return (
    <div className={tile}>
      <p className="text-xs font-semibold tracking-tight">
        Recommended next steps
      </p>
      <p className="mt-0.5 text-[10px] text-muted-foreground">
        Based on your activity so far
      </p>

      <div className="mt-4 space-y-2">
        {nextSteps.map((step) => {
          const Icon = step.icon;

          return (
            <div
              key={step.title}
              className="flex items-center gap-2.5 rounded-xl bg-background p-2.5"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                <Icon className="size-3.5" aria-hidden="true" />
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[10px] font-semibold">
                  {step.title}
                </p>
                <p className="truncate text-[9px] text-muted-foreground">
                  {step.description}
                </p>
              </div>

              <ArrowRight
                aria-hidden="true"
                className="size-3 shrink-0 text-muted-foreground"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Static landing-page illustration of the Guidio AI dashboard.
 * Values are intentionally sample data and are not connected to the app.
 * The surrounding frame (border, radius, shadow) comes from the hero.
 *
 * Memoised and layout/paint-contained so it stays cheap while the hero
 * animates it in 3D.
 */
export const DashboardPreview = memo(function DashboardPreview({ className }) {
  return (
    <div
      role="img"
      aria-label="Illustration of the Guidio AI student dashboard using sample data"
      className={cn(
        "bg-background text-left [backface-visibility:hidden] [contain:layout_paint_style]",
        className,
      )}
    >
      {/* Window chrome */}
      <div className="relative flex items-center justify-center bg-muted/50 px-4 py-3">
        <div
          aria-hidden="true"
          className="absolute left-4 flex items-center gap-1.5"
        >
          <span className="size-2.5 rounded-full bg-foreground/20" />
          <span className="size-2.5 rounded-full bg-foreground/20" />
          <span className="size-2.5 rounded-full bg-foreground/20" />
        </div>

        <span className="rounded-full bg-background px-3 py-0.5 text-[10px] font-medium text-muted-foreground">
          Sample dashboard
        </span>
      </div>

      <div className="grid md:grid-cols-[190px_1fr]">
        {/* Sidebar */}
        <aside className="hidden bg-muted/40 p-3 md:block">
          <div className="mb-5 flex items-center gap-2 px-2.5 pt-1">
            <LogoMark className="size-6" />
            <span className="text-xs font-semibold tracking-tight">
              Guidio AI
            </span>
          </div>

          <div className="space-y-0.5">
            {sidebarItems.map(({ label, icon: Icon, active }) => (
              <div
                key={label}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs",
                  active
                    ? "bg-foreground font-medium text-background"
                    : "text-muted-foreground",
                )}
              >
                <Icon aria-hidden="true" className="size-3.5 shrink-0" />
                <span className="truncate tracking-tight">{label}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Dashboard */}
        <main className="min-w-0 space-y-4 p-4 sm:space-y-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-medium tracking-tight text-muted-foreground">
                Student dashboard
              </p>
              <p className="mt-0.5 truncate text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
                Welcome back, Alex
              </p>
              <p className="mt-0.5 hidden text-[11px] text-muted-foreground sm:block">
                Here is your progress and what to do next.
              </p>
            </div>

            <div className="hidden shrink-0 items-center gap-1 rounded-full bg-foreground px-3 py-1.5 text-[10px] font-medium text-background sm:flex">
              Ask AI Assistant
              <ArrowRight aria-hidden="true" className="size-3" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
            {stats.map((stat) => (
              <StatPreview key={stat.label} stat={stat} />
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <ReadinessPreview />
            <ProfilePreview />
            <NextStepsPreview />
          </div>
        </main>
      </div>
    </div>
  );
});