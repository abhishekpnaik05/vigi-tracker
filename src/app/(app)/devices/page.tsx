
import { Suspense } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import DeviceCard from "@/components/device-card";
import DeviceCardSkeleton from "@/components/device-card-skeleton";
import { getDevices } from "@/services/device-service";

async function DeviceList() {
  const devices = await getDevices();
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
