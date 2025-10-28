
import type { DeviceHistory, Notification } from "@/lib/types";

export const notifications: Notification[] = [
  {
    id: "NOTIF001",
    type: "warning",
    message: "Device 'Delivery Van 1' has been stopped for over 30 minutes.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    isRead: false,
  },
  {
    id: "NOTIF002",
    type: "info",
    message: "Personal Car - Toyota started moving at 8:30 AM.",
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    isRead: false,
  },
  {
    id: "NOTIF003",
    type: "success",
    message: "Kids School Bus entered 'School' safe zone.",
    timestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    isRead: true,
  },
  {
    id: "NOTIF004",
    type: "warning",
    message: "Fleet Truck #502 battery is low (22%).",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    isRead: true,
  },
  {
    id: "NOTIF005",
    type: "info",
    message: "Asset Tracker A2 is back online.",
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    isRead: true,
  },
];

export const deviceHistory: DeviceHistory[] = [
    { type: 'start', location: 'Main Warehouse', time: '08:00 AM', details: 'Trip Started' },
    { type: 'stop', location: 'Customer A, Koramangala', time: '09:15 AM', details: 'Stopped for 12 mins' },
    { type: 'move', location: 'En route to Indiranagar', time: '09:27 AM', details: 'Distance: 5.2 km' },
    { type: 'stop', location: 'Customer B, Indiranagar', time: '10:05 AM', details: 'Stopped for 25 mins' },
    { type: 'move', location: 'En route to Whitefield', time: '10:30 AM', details: 'Distance: 15.8 km' },
    { type: 'alert', location: 'Marathahalli Bridge', time: '11:10 AM', details: 'Idle Alert: 10 mins' },
    { type: 'stop', location: 'Customer C, Whitefield', time: '11:45 AM', details: 'Stopped for 45 mins' },
    { type: 'end', location: 'Return to Warehouse', time: '01:30 PM', details: 'Trip Ended' },
]
