
export type DeviceStatus = "Active" | "Stopped" | "Offline";

export type Device = {
  id: string;
  name: string;
  status: DeviceStatus;
  battery: number;
  speed: number;
  lastUpdated: string;
  location: {
    latitude: number;
    longitude: number;
  };
  history: string;
  type: "Car" | "Bike" | "Person" | "Other";
  userId: string;
};

export type NotificationType = "info" | "warning" | "success";

export type Notification = {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: string;
  isRead: boolean;
};

export type DeviceHistory = {
  type: "start" | "stop" | "move" | "alert" | "end";
  location: string;
  time: string;
  details: string;
};
