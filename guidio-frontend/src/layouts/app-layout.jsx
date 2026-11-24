import { useState } from "react";
import { Outlet, useLocation } from "react-router";
import { AppHeader } from "@/components/app-header";
import { DesktopSidebar, MobileSidebar } from "@/components/app-sidebar";

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-background"
      >
        Skip to content
      </a>

      {/* Fixed sidebar on large screens, drawer on smaller screens */}
      <DesktopSidebar />
      <MobileSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

      <div className="flex min-h-screen min-w-0 flex-col lg:pl-64">
        <AppHeader onMenuClick={() => setSidebarOpen(true)} />

        <main id="main-content" className="flex-1">
          {/* The key replays the fade each time the page changes */}
          <div
            key={pathname}
            className="animate-in fade-in slide-in-from-bottom-2 mx-auto w-full max-w-[1400px] px-4 py-6 duration-500 motion-reduce:animate-none sm:px-6 sm:py-8 lg:px-8 lg:py-10"
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;