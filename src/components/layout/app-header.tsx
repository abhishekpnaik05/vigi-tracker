
"use client";

import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserNav } from "@/components/user-nav";

const getPageTitle = (pathname: string) => {
  if (pathname.startsWith("/devices/new")) return "Add New Device";
  if (pathname.startsWith("/devices/")) return "Device Details";
  const link = NAV_LINKS.find((l) => l.href === pathname);
  return link ? link.label : "Dashboard";
};

export default function AppHeader() {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="flex w-full items-center gap-4">
        <h1 className="flex-1 text-lg font-semibold tracking-tight md:text-xl">
          {pageTitle}
        </h1>
        <UserNav />
      </div>
    </header>
  );
}
