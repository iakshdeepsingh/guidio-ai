import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CareerInterview } from "./career-interview";
import { CareerOverview } from "./career-overview";
import { CareerProjects } from "./career-projects";
import { CareerRoadmap } from "./career-roadmap";

const tabs = [
  { value: "overview", label: "Overview" },
  { value: "roadmap", label: "Roadmap" },
  { value: "projects", label: "Projects" },
  { value: "interview", label: "Interview prep" },
];

// aria-selected is set by every tabs library, so the active look does not
// depend on which data attribute the shared Tabs component uses.
const triggerClass = cn(
  "h-auto flex-1 rounded-full border-0 px-4 py-2 text-sm font-medium tracking-[-0.01em] text-muted-foreground shadow-none transition-colors duration-200 sm:flex-none",
  "hover:text-foreground",
  "aria-selected:bg-foreground aria-selected:text-background aria-selected:shadow-none"
);

export function CareerPlan({ plan }) {
  return (
    // key: each plan starts on the Overview tab. flex-col is set here because
    // the shared Tabs component only stacks vertically through a data-attribute
    // that Base UI does not set.
    <Tabs
      key={plan.id}
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
        <CareerOverview plan={plan} />
      </TabsContent>

      <TabsContent value="roadmap">
        <CareerRoadmap roadmap={plan.roadmap} />
      </TabsContent>

      <TabsContent value="projects">
        <CareerProjects projects={plan.projects} />
      </TabsContent>

      <TabsContent value="interview">
        <CareerInterview plan={plan} />
      </TabsContent>
    </Tabs>
  );
}