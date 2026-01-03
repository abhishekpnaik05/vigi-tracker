'use client';

import Link from "next/link";
import { MapPin, Battery, ToggleLeft, ToggleRight, Wifi } from "lucide-react";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { Device, DeviceStatus } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import StatusBadge from "./status-badge";

import { updateDevice } from "@/services/device-service";
import { useUser } from "@/firebase/auth/use-user";

type DeviceCardProps = {
  device: Device;
};

export default function DeviceCard({ device }: DeviceCardProps) {
  const router = useRouter();
  const { user } = useUser();

  const [status, setStatus] = useState<DeviceStatus>(device.status);
  const lastUpdated = formatDistanceToNow(
    new Date(device.lastUpdated),
    { addSuffix: true }
  );

  const handleToggle = async (checked: boolean) => {
    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    if (typeof device.id !== "string") {
      console.error("Invalid device id:", device.id);
      return;
    }

    const newStatus: DeviceStatus = checked ? "Active" : "Offline";
    const oldStatus = status;

    // ✅ Optimistic UI
    setStatus(newStatus);

    try {
      // ✅ CORRECT CALL
      await updateDevice(user.uid, device.id, {
        status: newStatus,
      });

      toast.success(`Device ${device.name} is now ${newStatus}.`);
      router.refresh();
    } catch (error) {
      setStatus(oldStatus); // rollback
      toast.error(`Failed to update ${device.name}.`);
      console.error("Failed to update device status:", error);
    }
  };

  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div className="flex-1">
          <CardTitle className="text-lg font-semibold">
            {device.name}
          </CardTitle>
          <CardDescription className="text-xs">
            ID: {device.id}
          </CardDescription>
        </div>
        <StatusBadge status={status} />
      </CardHeader>

      <CardContent className="flex flex-col flex-1 justify-between">
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-muted-foreground items-center">
            <div className="flex items-center gap-2">
              <Battery className="h-4 w-4" />
              <span>{device.battery}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4" />
              <span>{lastUpdated}</span>
            </div>
          </div>
          <Progress value={device.battery} className="h-2" />
        </div>

        <div className="flex items-center justify-between pt-6">
          <Button asChild variant="default" size="sm">
            <Link href={`/devices/${device.id}`}>
              <MapPin />
              Locate
            </Link>
          </Button>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {status !== "Offline"
              ? <ToggleRight className="text-accent h-6 w-6" />
              : <ToggleLeft className="h-6 w-6" />
            }

            <Switch
              id={`power-${device.id}`}
              checked={status !== "Offline"}
              onCheckedChange={handleToggle}
              aria-label="Toggle device power"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
