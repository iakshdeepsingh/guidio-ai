import { Check as CheckIcon, Minus } from "lucide-react";
import { Link } from "react-router";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Item({ done, label, children }) {
  return (
    <div className="flex min-w-0 gap-3">
      <span
        aria-hidden="true"
        className={cn(
          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
          done
            ? "border-foreground bg-foreground text-background"
            : "border-foreground/15 text-muted-foreground"
        )}
      >
        {done ? <CheckIcon className="size-3" /> : <Minus className="size-3" />}
      </span>

      <div className="min-w-0 space-y-2">
        <p className="text-sm font-semibold tracking-[-0.01em]">
          {label}
          <span className="sr-only">{done ? " (added)" : " (missing)"}</span>
        </p>
        {children}
      </div>
    </div>
  );
}

/**
 * The analysis is built by the server from the saved profile, so the target
 * role and skills shown here are the exact inputs it will use.
 */
export function ProfileInputsCard({ profile, canAnalyze }) {
  const skills = Array.isArray(profile?.skills) ? profile.skills : [];
  const hasRole = Boolean(profile?.targetRole);

  return (
    <section className="rounded-[1.5rem] bg-muted p-3 sm:p-4">
      <div className="px-2 pb-4 pt-2 sm:px-3">
        <h2 className="text-xl font-semibold leading-tight tracking-[-0.02em]">
          Analysis inputs
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Taken from your saved profile. Update your profile to change them.
        </p>
      </div>

      <div className="space-y-2">
        <div className="space-y-5 rounded-2xl bg-background p-4 sm:p-5">
          <Item done={hasRole} label="Target role">
            <p className="break-words text-sm text-muted-foreground">
              {hasRole ? profile.targetRole : "Not added yet"}
            </p>
          </Item>

          <Item done={skills.length > 0} label="Current skills">
            {skills.length > 0 ? (
              <ul className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full bg-muted px-3 py-1 text-xs font-medium tracking-[-0.01em]"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Add at least one skill
              </p>
            )}
          </Item>
        </div>

        <Link
          to="/profile"
          className={cn(
            buttonVariants({
              variant: canAnalyze ? "outline" : "default",
              size: "lg",
            }),
            "h-12 w-full rounded-full text-[0.9375rem]",
            canAnalyze && "border-foreground/10 bg-background"
          )}
        >
          {canAnalyze ? "Edit profile" : "Complete your profile"}
        </Link>
      </div>
    </section>
  );
}