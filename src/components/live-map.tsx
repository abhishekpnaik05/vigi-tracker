
'use client';

import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import type { Device } from '@/lib/types';
import { useTheme } from 'next-themes';

// Manually import and configure Leaflet's default icons to fix issues with Next.js.
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapUpdater({ devices }: { devices: Device[] }) {
  const map = useMap();
  useEffect(() => {
    if (devices.length > 0) {
      const markers = devices.map(device =>
        L.marker([device.location.latitude, device.location.longitude])
      );
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.1));
    }
  }, [devices, map]);
  return null;
}

export default function LiveMap({ devices = [] }: { devices: Device[] }) {
  const { theme } = useTheme();

  const center: [number, number] =
    devices.length > 0
      ? [devices[0].location.latitude, devices[0].location.longitude]
      : [12.9716, 77.5946];

  const tileUrl =
    theme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const attribution =
    theme === 'dark'
      ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  return (
    <MapContainer
      center={center}
      zoom={12}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer url={tileUrl} attribution={attribution} key={theme} />
      {devices.map(device => (
        <Marker
          key={device.id}
          position={[device.location.latitude, device.location.longitude]}
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
      <MapUpdater devices={devices} />
    </MapContainer>
  );
}
