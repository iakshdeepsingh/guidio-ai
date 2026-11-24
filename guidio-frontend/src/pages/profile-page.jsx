import { Link } from "react-router";
import { Settings } from "lucide-react";
import { ErrorState } from "@/components/common/error-state";
import { PageHeader } from "@/components/common/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { ProfileEditor } from "@/features/profile/profile-editor";
import { useProfile } from "@/features/profile/use-profile";
import { cn } from "@/lib/utils";

// Tiles are soft gray, so the bars use a slightly darker tone.
const bar = "bg-foreground/10";
const tile = "rounded-[1.5rem] bg-muted";

function ProfileSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      className="space-y-4 sm:space-y-6"
    >
      <span className="sr-only">Loading your profile</span>

      {/* Summary */}
      <div className={cn(tile, "flex items-center gap-4 p-5 sm:p-6")}>
        <Skeleton className={cn("size-[4.5rem] shrink-0 rounded-full", bar)} />
        <div className="min-w-0 flex-1 space-y-2.5">
          <Skeleton className={cn("h-6 w-44 rounded-xl", bar)} />
          <Skeleton className={cn("h-4 w-56 max-w-full rounded-full", bar)} />
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-4 sm:space-y-6">
          <Skeleton className={cn("h-56 w-full", tile, bar)} />
          <Skeleton className={cn("h-80 w-full", tile, bar)} />
        </div>
        <Skeleton className={cn("h-72 w-full", tile, bar)} />
      </div>
    </div>
  );
}

function ProfilePage() {
  const { status, profile, error, reload, save } = useProfile();

  return (
    <div className="space-y-8 pb-8 sm:space-y-10">
      <PageHeader
        title="Student profile"
        description="Keep your education, skills and career goals up to date for personalised guidance."
        actions={
          <Link
            to="/settings"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-12 rounded-full px-6 text-[0.9375rem]"
            )}
          >
            <Settings aria-hidden="true" />
            Settings
          </Link>
        }
      />

      {status === "loading" ? <ProfileSkeleton /> : null}

      {status === "error" ? (
        <ErrorState
          title="Unable to load your profile"
          error={error}
          onRetry={reload}
        />
      ) : null}

      {status === "ready" ? (
        <ProfileEditor initialProfile={profile} onSave={save} />
      ) : null}
    </div>
  );
}

export default ProfilePage;