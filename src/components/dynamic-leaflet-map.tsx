// Example: src/components/dynamic-leaflet-map.tsx
'use client';

import { useEffect, useState } from "react";
import LeafletMap from "./leaflet-map";
import { getDevices } from "@/services/device-service";
import type { Device } from "@/lib/types";

export default function DynamicLeafletMap() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDevices().then((data) => {
      setDevices(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading map...</div>;

  return <LeafletMap devices={devices} />;
}