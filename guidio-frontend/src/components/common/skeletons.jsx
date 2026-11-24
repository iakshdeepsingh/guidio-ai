import { memo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Tiles are soft gray, so the bars use a slightly darker tone.
const bar = "bg-foreground/10";
const tile = "rounded-[1.5rem] bg-muted p-5 sm:p-6";

function SkeletonWrapper({ className, children }) {
  return (
    <div role="status" aria-busy="true" className={className}>
      <span className="sr-only">Loading…</span>
      {children}
    </div>
  );
}

function StatCardBody() {
  return (
    <div className={cn(tile, "space-y-4")}>
      <Skeleton className={cn("h-4 w-24 rounded-full", bar)} />
      <div className="space-y-2.5">
        <Skeleton className={cn("h-9 w-24 rounded-xl", bar)} />
        <Skeleton className={cn("h-3.5 w-28 rounded-full", bar)} />
      </div>
    </div>
  );
}

// Bodies have no status role, so they can be nested without extra announcements.
function CardBody({ lines = 3 }) {
  return (
    <div className={cn(tile, "space-y-5")}>
      <Skeleton className={cn("h-5 w-40 rounded-full", bar)} />
      <div className="space-y-3">
        {Array.from({ length: lines }, (_, index) => (
          <Skeleton
            key={index}
            className={cn(
              "h-4 rounded-full",
              bar,
              index === lines - 1 ? "w-2/3" : "w-full",
            )}
          />
        ))}
      </div>
    </div>
  );
}

function ListBody({ rows = 4, className }) {
  return (
    <div className={cn("space-y-2.5", className)}>
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 rounded-2xl bg-muted p-3.5"
        >
          <Skeleton className={cn("size-10 shrink-0 rounded-full", bar)} />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className={cn("h-4 w-1/2 rounded-full", bar)} />
            <Skeleton className={cn("h-3.5 w-3/4 rounded-full", bar)} />
          </div>
        </div>
      ))}
    </div>
  );
}

// Stat cards are meant to be placed inside a parent that already announces loading.
export const StatCardSkeleton = memo(StatCardBody);

export const CardSkeleton = memo(function CardSkeleton({ lines = 3, className }) {
  return (
    <SkeletonWrapper className={className}>
      <CardBody lines={lines} />
    </SkeletonWrapper>
  );
});

export const ListSkeleton = memo(function ListSkeleton({ rows = 4, className }) {
  return (
    <SkeletonWrapper className={className}>
      <ListBody rows={rows} />
    </SkeletonWrapper>
  );
});

export const PageSkeleton = memo(function PageSkeleton() {
  return (
    <SkeletonWrapper className="space-y-6">
      <div className="space-y-2.5">
        <Skeleton className={cn("h-9 w-56 rounded-xl", bar)} />
        <Skeleton className={cn("h-4 w-80 max-w-full rounded-full", bar)} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <StatCardBody key={index} />
        ))}
      </div>

      <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        <CardBody lines={4} />
        <CardBody lines={4} />
      </div>
    </SkeletonWrapper>
  );
});