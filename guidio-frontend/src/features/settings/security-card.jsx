import { useState } from "react";
import { useClerk, useUser } from "@clerk/react";
import { LoaderCircle, LogOut, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function getSignInMethods(user) {
  if (!user) return [];

  const methods = [];

  if (user.passwordEnabled) {
    methods.push("Email and password");
  }

  for (const account of user.externalAccounts ?? []) {
    const provider = String(account.provider ?? "")
      .replace(/^oauth_/, "")
      .replace(/^\w/, (letter) => letter.toUpperCase());

    if (provider) {
      methods.push(`${provider} sign-in`);
    }
  }

  return [...new Set(methods)];
}

/** How the student signs in, and the sign-out button. */
export function SecurityCard() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const methods = getSignInMethods(user);

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      await signOut({ redirectUrl: "/" });
    } catch {
      setIsSigningOut(false);
    }
  }

  return (
    <section className="rounded-[1.5rem] bg-muted p-3 sm:p-4">
      <div className="flex items-start gap-3 px-2 pb-4 pt-2 sm:px-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
          <ShieldCheck aria-hidden="true" className="size-[18px]" />
        </span>

        <div className="min-w-0">
          <h2 className="text-xl font-semibold leading-tight tracking-[-0.02em]">
            Authentication
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            How you sign in to Guidio AI.
          </p>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="space-y-3 rounded-2xl bg-background p-4 sm:p-5">
          <p className="text-xs font-semibold tracking-tight text-muted-foreground">
            Sign-in methods
          </p>

          {isLoaded && methods.length > 0 ? (
            <ul className="flex flex-wrap gap-1.5">
              {methods.map((method) => (
                <li key={method}>
                  <Badge variant="secondary">{method}</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-medium">
              {isLoaded ? "Not available" : "Loading…"}
            </p>
          )}

          <p className="border-t border-foreground/10 pt-3 text-xs leading-5 text-muted-foreground">
            Sign-in is handled by Clerk, which runs in Development mode for
            this project. Passwords and sessions are never stored by Guidio
            AI. Use Manage account in the Account section to change your
            password or connected accounts.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="h-11 w-full rounded-full border-foreground/10 bg-background px-5 text-sm sm:w-auto"
        >
          {isSigningOut ? (
            <LoaderCircle aria-hidden="true" className="animate-spin" />
          ) : (
            <LogOut aria-hidden="true" />
          )}
          {isSigningOut ? "Signing out..." : "Sign out"}
        </Button>
      </div>
    </section>
  );
}