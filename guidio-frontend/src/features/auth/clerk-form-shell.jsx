import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { useAuth } from "@clerk/react";
import { ErrorState } from "@/components/common/error-state";
import { Skeleton } from "@/components/ui/skeleton";

const LOAD_TIMEOUT_MS = 12000;

// Skeleton bars sit on a gray tile, so they use a slightly darker tone.
const bar = "bg-foreground/10";

function FormSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full space-y-6 rounded-[1.75rem] bg-muted p-6 sm:rounded-[2rem] sm:p-8"
    >
      <span className="sr-only">Loading the form</span>

      <div className="space-y-2.5">
        <Skeleton className={`mx-auto h-6 w-40 rounded-full ${bar}`} />
        <Skeleton className={`mx-auto h-4 w-56 max-w-full rounded-full ${bar}`} />
      </div>

      <Skeleton className={`h-12 w-full rounded-full ${bar}`} />

      <div className="space-y-3">
        <Skeleton className={`h-12 w-full rounded-xl ${bar}`} />
        <Skeleton className={`h-12 w-full rounded-xl ${bar}`} />
      </div>

      <Skeleton className="h-12 w-full rounded-full bg-foreground/20" />
    </div>
  );
}

/**
 * Wraps a Clerk form with the states Clerk does not give us:
 *  - loading: a skeleton while Clerk starts
 *  - error: a retry message if Clerk never loads (network blocked, offline)
 *  - signed in: skip the form and go straight to the destination
 */
export function ClerkFormShell({ redirectTo, children }) {
  const { isLoaded, isSignedIn } = useAuth();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      return undefined;
    }

    const timer = window.setTimeout(() => setTimedOut(true), LOAD_TIMEOUT_MS);

    return () => window.clearTimeout(timer);
  }, [isLoaded]);

  if (isLoaded && isSignedIn) {
    return <Navigate to={redirectTo} replace />;
  }

  if (isLoaded) {
    return children;
  }

  if (timedOut) {
    return (
      <ErrorState
        title="Unable to load this page"
        message="The sign-in service did not respond. Check your internet connection and try again."
        onRetry={() => window.location.reload()}
        retryLabel="Reload"
      />
    );
  }

  return <FormSkeleton />;
}