import { LoaderCircle } from "lucide-react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "@clerk/react";
import { Logo } from "@/components/common/logo";
import { withRedirect } from "@/features/auth/auth-redirect";

function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth();
  const location = useLocation();

  // Clerk is still starting.
  if (!isLoaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <div
          role="status"
          aria-live="polite"
          // Short delay so a fast load does not flash this screen
          style={{ animationDelay: "150ms", animationFillMode: "both" }}
          className="animate-in fade-in slide-in-from-bottom-2 flex flex-col items-center gap-6 text-center duration-500 motion-reduce:animate-none"
        >
          <Logo to={null} className="scale-125" />

          <p className="inline-flex items-center gap-2.5 rounded-full bg-muted px-4 py-2.5 text-sm font-medium tracking-[-0.01em] text-muted-foreground">
            <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
            Loading your workspace...
          </p>
        </div>
      </main>
    );
  }

  // Not signed in: go to sign-in and remember where the student wanted to go.
  if (!isSignedIn) {
    return (
      <Navigate
        to={withRedirect("/sign-in", `${location.pathname}${location.search}`)}
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;