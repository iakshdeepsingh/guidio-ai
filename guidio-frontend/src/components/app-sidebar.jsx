import { useUser } from "@clerk/react";
import { Link, NavLink } from "react-router";
import { LogoMark } from "@/components/common/logo";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { navigationItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";

function SidebarBrand({ onNavigate }) {
  return (
    <Link
      to="/dashboard"
      onClick={onNavigate}
      aria-label="Guidio AI dashboard"
      className="inline-flex items-center gap-2.5 rounded-full outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring/60"
    >
      <LogoMark />
      <span className="text-base font-semibold tracking-[-0.02em]">
        Guidio AI
      </span>
    </Link>
  );
}

function NavigationLinks({ onNavigate }) {
  return (
    <nav aria-label="Main navigation" className="space-y-1 px-3 py-4">
      {navigationItems.map(({ href, title, icon: Icon }) => (
        <NavLink
          key={href}
          to={href}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium tracking-[-0.01em] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/60",
              isActive
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground"
            )
          }
        >
          <Icon
            aria-hidden="true"
            className="size-4 shrink-0 transition-transform duration-200 group-hover:scale-110"
          />
          <span className="truncate">{title}</span>
        </NavLink>
      ))}
    </nav>
  );
}

function SidebarUser() {
  const { user } = useUser();

  const name =
    user?.fullName || user?.firstName || user?.username || "Student";
  const email = user?.primaryEmailAddress?.emailAddress || "";
  const initial = name.trim().charAt(0).toUpperCase() || "S";

  return (
    <div className="p-3">
      <div className="flex items-center gap-3 rounded-2xl bg-background p-3">
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background"
        >
          {initial}
        </span>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-tight">
            {name}
          </p>
          {email ? (
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function SidebarPanel({ onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      {/* Same height as the app header so the two line up */}
      <div className="flex h-12 shrink-0 items-center px-5">
        <SidebarBrand onNavigate={onNavigate} />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <NavigationLinks onNavigate={onNavigate} />
      </div>

      <SidebarUser />
    </div>
  );
}

/** Always visible from the "lg" breakpoint (1024px) upwards. */
export function DesktopSidebar() {
  return (
    <aside
      aria-label="Sidebar"
      className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-foreground/10 bg-muted/50 lg:block"
    >
      <SidebarPanel />
    </aside>
  );
}

/** Slide-in drawer for phones and tablets. */
export function MobileSidebar({ open, onOpenChange }) {
  const close = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="gap-0 border-foreground/10 bg-muted/95 p-0 backdrop-blur-[20px] backdrop-saturate-[1.8] data-[side=left]:w-72 data-[side=left]:max-w-[85vw] data-[side=left]:sm:max-w-72"
      >
        <SheetTitle className="sr-only">Navigation menu</SheetTitle>
        <SheetDescription className="sr-only">
          Move between the pages of Guidio AI.
        </SheetDescription>

        <SidebarPanel onNavigate={close} />
      </SheetContent>
    </Sheet>
  );
}