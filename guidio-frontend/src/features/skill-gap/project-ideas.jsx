import { asArray } from "./skill-gap-utils";

export function ProjectIdeas({ projects }) {
  const ideas = asArray(projects);

  if (ideas.length === 0) {
    return (
      <p className="rounded-[1.5rem] bg-muted p-8 text-center text-sm font-medium text-muted-foreground">
        This report has no project ideas.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
      {ideas.map((project, index) => (
        <li
          key={`${project.title}-${index}`}
          className="group relative flex min-w-0 flex-col gap-4 overflow-hidden rounded-[1.5rem] bg-muted p-5 sm:p-6"
        >
          {/* Big faded number */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-2 -top-4 select-none text-[6rem] font-semibold leading-none tracking-[-0.06em] text-foreground/[0.05] transition-transform duration-700 group-hover:-translate-x-1"
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          <div className="relative flex flex-wrap items-start justify-between gap-2">
            <span className="text-xs font-semibold tabular-nums tracking-tight text-muted-foreground">
              Project {String(index + 1).padStart(2, "0")}
            </span>

            <span className="shrink-0 rounded-full bg-background px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {project.difficulty}
            </span>
          </div>

          <div className="relative space-y-2">
            <h3 className="min-w-0 break-words text-xl font-semibold leading-tight tracking-[-0.02em]">
              {project.title}
            </h3>

            <p className="break-words text-sm leading-6 text-muted-foreground">
              {project.description}
            </p>
          </div>

          <ul className="relative mt-auto flex flex-wrap gap-1.5">
            {asArray(project.skills).map((skill) => (
              <li
                key={skill}
                className="rounded-full bg-background px-3 py-1 text-xs font-medium tracking-[-0.01em]"
              >
                {skill}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}