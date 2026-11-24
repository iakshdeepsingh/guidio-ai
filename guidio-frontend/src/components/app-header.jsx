import { UserButton } from "@clerk/react";
import { useLocation } from "react-router";
import { ModeToggle } from "@/components/mode-toggle";
import NotificationPopover from "@/components/notification-popover";
import { navigationItems } from "@/lib/navigation";

function getPageTitle(pathname) {
  const match = navigationItems.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  );

  return match?.title ?? "Guidio AI";
}

export function AppHeader({ onMenuClick }) {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-20 flex h-12 w-full items-center justify-between gap-3 border-b border-foreground/10 bg-background/72 px-4 backdrop-blur-[20px] backdrop-saturate-[1.8] sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-1">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="group -ml-2 flex size-10 shrink-0 items-center justify-center rounded-full text-foreground/80 outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 lg:hidden"
        >
          <span aria-hidden="true" className="flex flex-col gap-[6px]">
            <span className="block h-px w-[17px] bg-current transition-transform duration-300 group-hover:translate-x-0.5" />
            <span className="block h-px w-[17px] bg-current transition-transform duration-300 group-hover:-translate-x-0.5" />
          </span>
        </button>

        <p className="truncate text-sm font-semibold tracking-tight">
          {getPageTitle(pathname)}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <NotificationPopover />
        <ModeToggle />

        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "size-8",
              userButtonPopoverCard: "border shadow-xl",
            },
          }}
        />
      </div>
    </header>
  );
}