'use client';

import { notFound, useParams } from "next/navigation";
import { Battery, Rss, Thermometer, Gauge, Edit, Trash2 } from "lucide-react";
import { useEffect, useState, Suspense } from "react";

import PageHeader from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import GeofenceSuggester from "@/components/ai/geofence-suggester";
import { Skeleton } from "@/components/ui/skeleton";

import { getDeviceById } from "@/services/device-service";
import { useUser } from "@/firebase/auth/use-user";
import type { Device } from "@/lib/types";

export default function DeviceDetailPage() {
  const params = useParams();
  const { user } = useUser();

  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔴 HARD NARROWING — THIS IS THE KEY
  const deviceId =
    typeof params.id === "string" ? params.id : undefined;

  useEffect(() => {
    if (!user || !deviceId) return;

    const fetchDevice = async () => {
      try {
        setLoading(true);

        // ✅ NO ERROR HERE — deviceId IS string
        const fetchedDevice = await getDeviceById(user.uid, deviceId);

        if (!fetchedDevice) {
          notFound();
          return;
        }

        setDevice(fetchedDevice);
      } catch (error) {
        console.error("Failed to fetch device:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchDevice();
  }, [user, deviceId]);

  if (loading || !device) {
    return (
      <div className="flex flex-col gap-8">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-8 lg:grid-cols-3">
          <Skeleton className="h-[400px] w-full rounded-2xl lg:col-span-2" />
          <div className="space-y-8">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title={device.name}>
        <div className="flex gap-2">
          <Button variant="outline" size="icon"><Edit /></Button>
          <Button variant="destructive" size="icon"><Trash2 /></Button>
        </div>
      </PageHeader>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Last Known Location</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                The last known location was near Bangalore.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Device Info</span>
                <StatusBadge status={device.status} />
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-6 text-sm">
              <div><Battery /> {device.battery}%</div>
              <div><Gauge /> {device.speed} km/h</div>
              <div><Rss /> Strong</div>
              <div><Thermometer /> 24°C</div>
            </CardContent>
          </Card>

          <Suspense fallback={<Skeleton className="h-40 w-full rounded-2xl" />}>
            <GeofenceSuggester deviceHistory={device.history} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
