
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import AppHeader from "@/components/layout/app-header";
import AppSidebar from "@/components/layout/app-sidebar";
import { Sidebar, SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Skeleton } from '@/components/ui/skeleton';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen w-full">
        <div className="hidden md:flex flex-col gap-4 p-4">
            <Skeleton className="h-12 w-[14rem]" />
            <Skeleton className="h-8 w-[14rem]" />
            <Skeleton className="h-8 w-[14rem]" />
            <Skeleton className="h-8 w-[14rem]" />
        </div>
        <div className="flex-1 p-8">
            <Skeleton className="h-16 w-full mb-8" />
            <Skeleton className="h-[60vh] w-full" />
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <AppSidebar />
        </Sidebar>
        <div className="flex flex-1 flex-col">
          <AppHeader />
          <SidebarInset>
            <main className="flex-1 bg-background p-4 sm:p-6 md:p-8">
              {children}
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
