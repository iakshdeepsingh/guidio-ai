import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/react";
import { ArrowRight, Bell, CheckCheck, LoaderCircle, TriangleAlert } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { getSafeRedirect } from "@/features/auth/auth-redirect";
import { apiRequest } from "@/lib/api-client";
import { cn } from "@/lib/utils";

function formatReminderTime(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60_000);
  const hours = Math.floor(diffMs / 3_600_000);
  const days = Math.floor(diffMs / 86_400_000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
  }).format(date);
}

function NotificationPopover() {
  const { getToken } = useAuth();

  // Keep the latest getToken in a ref so re-renders never trigger new requests.
  const getTokenRef = useRef(getToken);

  const [open, setOpen] = useState(false);
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);
  const [actionError, setActionError] = useState("");
  const [state, setState] = useState({
    status: "loading", // "loading" | "ready" | "error"
    reminders: [],
    unreadCount: 0,
    error: "",
  });

  useEffect(() => {
    getTokenRef.current = getToken;
  }, [getToken]);

  const load = useCallback(async (signal) => {
    try {
      const token = await getTokenRef.current();
      const response = await apiRequest("/api/reminders", { token, signal });

      setState({
        status: "ready",
        reminders: response?.data?.reminders ?? [],
        unreadCount: response?.data?.unreadCount ?? 0,
        error: "",
      });
    } catch (error) {
      if (error?.name === "AbortError") return;

      setState((previous) => ({
        ...previous,
        status: "error",
        error: error?.message || "Unable to load notifications.",
      }));
    }
  }, []);

  // Load once when the app shell appears, so the unread badge is correct
  // before the popover is ever opened.
  useEffect(() => {
    const controller = new AbortController();

    load(controller.signal);

    return () => controller.abort();
  }, [load]);

  function handleOpenChange(nextOpen) {
    setOpen(nextOpen);

    if (!nextOpen) return;

    setActionError("");

    // Refresh quietly. Show the loading skeleton only if there is nothing
    // to display yet.
    if (state.status !== "ready") {
      setState((previous) => ({ ...previous, status: "loading", error: "" }));
    }

    load();
  }

  function handleRetry() {
    setState((previous) => ({ ...previous, status: "loading", error: "" }));
    load();
  }

  async function markReminderRead(reminderId) {
    const target = state.reminders.find((reminder) => reminder.id === reminderId);

    if (!target || target.isRead) return;

    try {
      const token = await getTokenRef.current();

      await apiRequest(`/api/reminders/${reminderId}/read`, {
        method: "PATCH",
        token,
      });

      setState((previous) => ({
        ...previous,
        reminders: previous.reminders.map((reminder) =>
          reminder.id === reminderId ? { ...reminder, isRead: true } : reminder
        ),
        unreadCount: Math.max(0, previous.unreadCount - 1),
      }));
    } catch {
      // The reminder simply stays unread. Navigation still works.
    }
  }

  async function markAllRead() {
    if (!state.unreadCount) return;

    try {
      setIsMarkingAllRead(true);
      setActionError("");

      const token = await getTokenRef.current();

      await apiRequest("/api/reminders/read-all", {
        method: "PATCH",
        token,
      });

      setState((previous) => ({
        ...previous,
        reminders: previous.reminders.map((reminder) => ({
          ...reminder,
          isRead: true,
        })),
        unreadCount: 0,
      }));
    } catch (error) {
      setActionError(error?.message || "Unable to mark notifications as read.");
    } finally {
      setIsMarkingAllRead(false);
    }
  }

  function handleReminderClick(reminderId) {
    markReminderRead(reminderId);
    setOpen(false);
  }

  const { status, reminders, unreadCount, error } = state;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={
            unreadCount > 0
              ? `Notifications, ${unreadCount} unread`
              : "Notifications"
          }
          className="relative size-8 shrink-0 rounded-full border-0 text-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60"
        >
          <Bell aria-hidden="true" className="size-[18px]" />

          {unreadCount > 0 ? (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-semibold tabular-nums text-background ring-2 ring-background">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-[calc(100vw-2rem)] max-w-md rounded-[1.5rem] border-foreground/10 bg-popover/90 p-2 shadow-[0_24px_48px_-24px] shadow-foreground/30 backdrop-blur-[20px] backdrop-saturate-[1.8]"
      >
        <div className="flex items-center justify-between gap-3 px-3 pb-3 pt-2.5">
          <div className="min-w-0">
            <p className="text-base font-semibold leading-tight tracking-[-0.02em]">
              Notifications
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Your weekly readiness reminders
            </p>
          </div>

          {unreadCount > 0 ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={markAllRead}
              disabled={isMarkingAllRead}
              className="h-8 shrink-0 rounded-full bg-muted px-3.5 text-xs"
            >
              {isMarkingAllRead ? (
                <LoaderCircle aria-hidden="true" className="animate-spin" />
              ) : (
                <CheckCheck aria-hidden="true" />
              )}
              Mark all read
            </Button>
          ) : null}
        </div>

        <div className="max-h-96 space-y-1.5 overflow-y-auto">
          {actionError ? (
            <p
              role="alert"
              className="rounded-2xl bg-destructive/10 px-4 py-3 text-xs font-medium text-destructive"
            >
              {actionError}
            </p>
          ) : null}

          {status === "loading" ? (
            <div role="status" aria-busy="true" className="space-y-1.5">
              <span className="sr-only">Loading notifications…</span>
              {[1, 2, 3].map((item) => (
                <Skeleton
                  key={item}
                  className="h-20 w-full rounded-2xl bg-foreground/10"
                />
              ))}
            </div>
          ) : null}

          {status === "error" ? (
            <div role="alert" className="space-y-3 rounded-2xl bg-muted p-4">
              <div className="flex items-start gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-destructive text-white">
                  <TriangleAlert aria-hidden="true" className="size-4" />
                </span>
                <p className="pt-1 text-sm leading-6 text-muted-foreground">
                  {error}
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="h-9 rounded-full border-foreground/10 bg-background px-4"
              >
                Try again
              </Button>
            </div>
          ) : null}

          {status === "ready" && reminders.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-muted px-6 py-10 text-center">
              <span className="flex size-11 items-center justify-center rounded-full bg-foreground text-background">
                <Bell aria-hidden="true" className="size-5" />
              </span>
              <div className="space-y-1">
                <p className="text-base font-semibold tracking-[-0.02em]">
                  No notifications yet
                </p>
                <p className="text-xs leading-5 text-muted-foreground">
                  Weekly readiness reminders will appear here once they are sent.
                </p>
              </div>
            </div>
          ) : null}

          {status === "ready"
            ? reminders.map((reminder) => (
                <Link
                  key={reminder.id}
                  to={getSafeRedirect(reminder.actionHref) ?? "/dashboard"}
                  onClick={() => handleReminderClick(reminder.id)}
                  className={cn(
                    "group relative block rounded-2xl p-4 outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring/60",
                    reminder.isRead
                      ? "hover:bg-muted"
                      : "bg-muted hover:bg-foreground/[0.08]"
                  )}
                >
                  {!reminder.isRead ? (
                    <span
                      aria-hidden="true"
                      className="absolute right-4 top-4 size-2 rounded-full bg-foreground"
                    />
                  ) : null}

                  <div className="space-y-1 pr-5">
                    <p
                      className={cn(
                        "text-sm tracking-[-0.01em]",
                        reminder.isRead ? "font-medium" : "font-semibold"
                      )}
                    >
                      {reminder.title}
                    </p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {reminder.message}
                    </p>

                    <div className="flex items-center justify-between gap-3 pt-1.5">
                      <span className="text-xs text-muted-foreground">
                        {formatReminderTime(reminder.createdAt)}
                      </span>

                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                        {reminder.actionLabel || "Open"}
                        <ArrowRight
                          aria-hidden="true"
                          className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            : null}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default NotificationPopover;