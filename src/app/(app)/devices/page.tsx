'use client';
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import DeviceCard from "@/components/device-card";
import DeviceCardSkeleton from "@/components/device-card-skeleton";
import { getDevices } from "@/services/device-service";
import { useUser } from "@/firebase/auth/use-user";
import type { Device } from "@/lib/types";

function DeviceList() {
  const { user } = useUser();
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDevices() {
      if (!user) return;
      try {
        setIsLoading(true);
        const userDevices = await getDevices(user.uid);
        setDevices(userDevices);
      } catch (error) {
        console.error("Failed to fetch devices:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDevices();
  }, [user]);

  if (isLoading) {
    return <DeviceListSkeleton />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {devices.map((device) => (
        <DeviceCard key={device.id} device={device} />
      ))}
    </div>
  );
}

function DeviceListSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <DeviceCardSkeleton key={i} />
            ))}
        </div>
    );
}


export default function DevicesPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Manage Devices">
        <Button asChild>
          <Link href="/devices/new">
            <PlusCircle />
            Add Device
          </Link>
        </Button>
      </PageHeader>
      <Suspense fallback={<DeviceListSkeleton/>}>
        <DeviceList />
      </Suspense>
    </div>
  );
}
