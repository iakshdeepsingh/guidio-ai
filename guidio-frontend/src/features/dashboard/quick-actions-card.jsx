import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { QUICK_ACTIONS } from "@/features/dashboard/dashboard-utils";

export function QuickActionsCard() {
  return (
    <section className="min-w-0 rounded-[1.5rem] bg-muted p-3 sm:p-4">
      <div className="px-2 pb-4 pt-2 sm:px-3">
        <h2 className="text-xl font-semibold leading-tight tracking-[-0.02em]">
          Quick actions
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Jump straight into a tool.
        </p>
      </div>

      <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {QUICK_ACTIONS.map(({ href, title, description, icon: Icon }) => (
          <li key={href}>
            <Link
              to={href}
              className="group relative flex h-full flex-col gap-6 rounded-2xl bg-background p-4 outline-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-24px] hover:shadow-foreground/40 focus-visible:ring-2 focus-visible:ring-ring/60"
            >
              <span className="flex items-start justify-between">
                <span className="flex size-10 items-center justify-center rounded-full bg-foreground text-background transition-transform duration-300 group-hover:scale-105">
                  <Icon aria-hidden="true" className="size-[18px]" />
                </span>

                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                />
              </span>

              <span className="mt-auto block min-w-0">
                <span className="block text-sm font-semibold tracking-tight">
                  {title}
                </span>
                <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                  {description}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}