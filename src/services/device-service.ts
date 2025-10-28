
'use server';

import type { Device, DeviceStatus } from "@/lib/types";

const generateRandomCoordinates = (lat: number, lon: number, radius: number) => {
  const y0 = lat;
  const x0 = lon;
  const rd = radius / 111300; // about 111300 meters in one degree

  const u = Math.random();
  const v = Math.random();

  const w = rd * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);

  return {
    lat: y + y0,
    lon: x + x0,
  };
};

const statuses: DeviceStatus[] = ["Active", "Stopped", "Offline"];
const deviceNames = [
  "Personal Car - Toyota",
  "Delivery Van 1",
  "Asset Tracker A2",
  "Fleet Truck #502",
  "Kids School Bus",
  "John's Motorcycle",
  "Warehouse Forklift",
  "Shipping Container Z7",
];
const deviceTypes: Array<Device['type']> = ["Car", "Car", "Other", "Car", "Car", "Bike", "Other", "Other"];

// In-memory store for devices. In a real application, this would be a database.
let devices: Device[] = Array.from({ length: 8 }, (_, i) => {
    const status = statuses[i % statuses.length];
    const { lat, lon } = generateRandomCoordinates(12.9716, 77.5946, 5000); // Centered around Bangalore
    return {
      id: `DEV00${i + 1}`,
      name: deviceNames[i],
      status,
      battery: Math.floor(Math.random() * 81) + 20, // 20-100%
      speed: status === "Active" ? Math.floor(Math.random() * 60) + 20 : 0, // 20-80 km/h if active
      lastUpdated: new Date(Date.now() - Math.random() * 1000 * 60 * 60).toISOString(),
      location: {
        lat,
        lon,
      },
      history: `Location A at 10:00, Location B at 10:30 (stopped for 5 mins), Location C at 11:00`,
      type: deviceTypes[i],
    };
  });

export async function getDevices(): Promise<Device[]> {
  // In a real app, you'd fetch this from a database.
  return Promise.resolve(devices);
}

export async function getDeviceById(id: string): Promise<Device | undefined> {
  // In a real app, you'd query the database for a device with this ID.
  return Promise.resolve(devices.find(d => d.id === id));
}

export async function addDevice(device: Omit<Device, 'id' | 'lastUpdated' | 'location' | 'history'>): Promise<Device> {
  const newId = `DEV${String(devices.length + 1).padStart(3, '0')}`;
  const { lat, lon } = generateRandomCoordinates(12.9716, 77.5946, 5000);
  const newDevice: Device = {
    ...device,
    id: newId,
    lastUpdated: new Date().toISOString(),
    location: { lat, lon },
    history: 'Device just added.',
    type: 'Other'
  };
  devices.push(newDevice);
  return Promise.resolve(newDevice);
}

export async function updateDevice(id: string, updates: Partial<Device>): Promise<Device | null> {
  const deviceIndex = devices.findIndex(d => d.id === id);
  if (deviceIndex === -1) {
    return null;
  }
  const updatedDevice = { ...devices[deviceIndex], ...updates };
  devices[deviceIndex] = updatedDevice;
  return Promise.resolve(updatedDevice);
}

export async function deleteDevice(id: string): Promise<boolean> {
  const initialLength = devices.length;
  devices = devices.filter(d => d.id !== id);
  return Promise.resolve(devices.length < initialLength);
}
