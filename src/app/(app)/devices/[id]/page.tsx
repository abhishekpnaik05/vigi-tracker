import { notFound } from "next/navigation";
import { Battery, Rss, Thermometer, Gauge, Edit, Trash2 } from "lucide-react";

import PageHeader from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import GeofenceSuggester from "@/components/ai/geofence-suggester";
import { getDeviceById } from "@/services/device-service";
import DynamicLeafletMap from "@/components/dynamic-leaflet-map";

export default async function DeviceDetailPage({ params }: { params: { id: string } }) {
  const device = await getDeviceById(params.id);

  if (!device) {
    notFound();
  }

  const deviceDetails = [
    { icon: Battery, label: "Battery", value: `${device.battery}%` },
    { icon: Gauge, label: "Speed", value: `${device.speed} km/h` },
    { icon: Rss, label: "Signal", value: "Strong" },
    { icon: Thermometer, label: "Temp", value: "24°C" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title={device.name}>
        <div className="flex gap-2">
            <Button variant="outline" size="icon"><Edit/></Button>
            <Button variant="destructive" size="icon"><Trash2/></Button>
        </div>
      </PageHeader>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 h-[60vh] md:h-auto rounded-2xl overflow-hidden">
          <DynamicLeafletMap devices={[device]} />
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
              {deviceDetails.map((detail) => (
                <div key={detail.label} className="flex items-center gap-3">
                  <detail.icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">{detail.label}</p>
                    <p className="font-semibold">{detail.value}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <GeofenceSuggester deviceHistory={device.history} />
        </div>
      </div>
    </div>
  );
}
