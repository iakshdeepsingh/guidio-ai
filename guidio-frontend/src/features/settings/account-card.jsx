import { useClerk, useUser } from "@clerk/react";
import { ExternalLink, UserRound } from "lucide-react";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/features/dashboard/dashboard-utils";
import { cn } from "@/lib/utils";

const pillButton =
  "h-11 rounded-full border-foreground/10 bg-background px-5 text-sm";

function Row({ label, children }) {
  return (
    <div className="flex flex-col gap-1 py-3.5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="min-w-0 break-words font-medium tracking-[-0.01em] sm:text-right">
        {children}
      </dd>
    </div>
  );
}

/** Account details read from Clerk. Nothing here is stored by Guidio AI. */
export function AccountCard() {
  const { user, isLoaded } = useUser();
  const { openUserProfile } = useClerk();

  const name = user?.fullName || user?.firstName || user?.username || "";
  const email = user?.primaryEmailAddress?.emailAddress || "";
  const isVerified = user?.primaryEmailAddress?.verification?.status === "verified";
  const memberSince = user?.createdAt ? formatDate(user.createdAt) : "";

  return (
    <section className="rounded-[1.5rem] bg-muted p-3 sm:p-4">
      <div className="flex items-start gap-3 px-2 pb-4 pt-2 sm:px-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
          <UserRound aria-hidden="true" className="size-[18px]" />
        </span>

        <div className="min-w-0">
          <h2 className="text-xl font-semibold leading-tight tracking-[-0.02em]">
            Account
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Your sign-in details. They are managed by Clerk.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="rounded-2xl bg-background p-4 sm:p-5">
          {!isLoaded ? (
            <div role="status" aria-busy="true" className="space-y-3">
              <span className="sr-only">Loading account details</span>
              <Skeleton className="h-5 w-full rounded-full bg-foreground/10" />
              <Skeleton className="h-5 w-full rounded-full bg-foreground/10" />
              <Skeleton className="h-5 w-2/3 rounded-full bg-foreground/10" />
            </div>
          ) : (
            <dl className="divide-y divide-foreground/10 text-sm">
              <Row label="Name">{name || "Not added"}</Row>

              <Row label="Email">
                <span className="inline-flex flex-wrap items-center gap-2 sm:justify-end">
                  {email || "Not available"}
                  {email ? (
                    <Badge variant={isVerified ? "secondary" : "outline"}>
                      {isVerified ? "Verified" : "Not verified"}
                    </Badge>
                  ) : null}
                </span>
              </Row>

              <Row label="Member since">{memberSince || "Not available"}</Row>
            </dl>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            to="/profile"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              pillButton
            )}
          >
            Edit name and student details
          </Link>

          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => openUserProfile()}
            disabled={!isLoaded}
            className={pillButton}
          >
            <ExternalLink aria-hidden="true" />
            Manage account
          </Button>
        </div>
      </div>
    </section>
  );
}