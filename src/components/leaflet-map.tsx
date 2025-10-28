'use client';

import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { useMemo } from 'react';
import type { Device } from '@/lib/types';

const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then(mod => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then(mod => mod.Popup),
  { ssr: false }
);

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet icons
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

type LeafletMapProps = {
  devices: Device[];
};

export default function LeafletMap({ devices = [] }: LeafletMapProps) {
  const { theme } = useTheme();

  const center = useMemo<[number, number]>(() => {
    if (devices.length > 0) {
      return [devices[0].location.lat, devices[0].location.lon];
    }
    return [12.9716, 77.5946]; // Default: Bangalore
  }, [devices]);

  const tileUrl =
    theme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const attribution =
    theme === 'dark'
      ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MapContainer
        key={theme} // only re-init when theme changes
        center={center}
        zoom={devices.length > 1 ? 12 : 15}
        scrollWheelZoom
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url={tileUrl} attribution={attribution} />
        {devices.map(device => (
          <Marker
            key={device.id}
            position={[device.location.lat, device.location.lon]}
          >
            <Popup>
              <b>{device.name}</b>
              <br />
              Status: {device.status}
              <br />
              Speed: {device.speed} km/h
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
