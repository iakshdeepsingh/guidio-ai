import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { LearningPlan } from "./learning-plan";
import { MissingSkillsList } from "./missing-skills-list";
import { ProjectIdeas } from "./project-ideas";
import { ReportOverview } from "./report-overview";

const tabs = [
  { value: "overview", label: "Overview" },
  { value: "missing", label: "Missing skills" },
  { value: "plan", label: "Learning plan" },
  { value: "projects", label: "Projects" },
];

// aria-selected is set by every tabs library, so the active look does not
// depend on which data attribute the shared Tabs component uses.
const triggerClass = cn(
  "h-auto flex-1 rounded-full border-0 px-4 py-2 text-sm font-medium tracking-[-0.01em] text-muted-foreground shadow-none transition-colors duration-200 sm:flex-none",
  "hover:text-foreground",
  "aria-selected:bg-foreground aria-selected:text-background aria-selected:shadow-none"
);

export function SkillGapReport({ report }) {
  return (
    // key: each report starts on the Overview tab. flex-col is set here because
    // the shared Tabs component only stacks vertically through a data-attribute
    // that Base UI does not set.
    <Tabs
      key={report.id}
      defaultValue="overview"
      className="flex-col gap-4 sm:gap-6"
    >
      <div className="max-w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <TabsList className="h-auto w-max min-w-full gap-1 rounded-full bg-muted p-1 sm:min-w-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={triggerClass}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent value="overview">
        <ReportOverview report={report} />
      </TabsContent>

      <TabsContent value="missing">
        <MissingSkillsList skills={report.missingSkills} />
      </TabsContent>

      <TabsContent value="plan">
        <LearningPlan plan={report.learningPlan} />
      </TabsContent>

      <TabsContent value="projects">
        <ProjectIdeas projects={report.projectIdeas} />
      </TabsContent>
    </Tabs>
  );
}