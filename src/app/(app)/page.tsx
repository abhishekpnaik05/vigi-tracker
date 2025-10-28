
'use client';

import Link from "next/link";
import {
  Map,
  PlusCircle,
  Bell,
  CheckCircle2,
  AlertTriangle,
  PowerOff,
  Siren,
  Loader2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/stat-card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { getDevices } from "@/services/device-service";
import type { Device } from "@/lib/types";
import { triggerSOSAlert } from "@/ai/flows/trigger-sos-alert";
import { useAuth } from "@/hooks/use-auth";


export default function DashboardPage() {
  const { user } = useAuth();
  const [deviceCount, setDeviceCount] = useState(0);
  const [activeDevices, setActiveDevices] = useState(0);
  const [stoppedDevices, setStoppedDevices] = useState(0);
  const [offlineDevices, setOfflineDevices] = useState(0);
  const [isSosLoading, setIsSosLoading] = useState(false);

  useEffect(() => {
    async function fetchDevices() {
        try {
            const devices = await getDevices();
            setDeviceCount(devices.length);
            setActiveDevices(devices.filter(d => d.status === 'Active').length);
            setStoppedDevices(devices.filter(d => d.status === 'Stopped').length);
            setOfflineDevices(devices.filter(d => d.status === 'Offline').length);
        } catch (error) {
            console.error("Failed to fetch devices", error);
        }
    }
    fetchDevices();
  }, []);

  const handleSos = () => {
    setIsSosLoading(true);
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                if (!user) {
                    throw new Error("User not authenticated");
                }
                const result = await triggerSOSAlert({
                    userName: user.name,
                    userEmail: user.email,
                    location: {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    },
                });
                toast.error("SOS Activated", {
                    description: result.confirmationMessage,
                });
            } catch (error) {
                toast.error("SOS Failed", {
                    description: "Could not send the SOS alert. Please try again.",
                });
            } finally {
                setIsSosLoading(false);
            }
        },
        (error) => {
            console.error("Error getting location:", error);
            toast.error("Location Error", {
                description: "Could not get your location. Please enable location services.",
            });
            setIsSosLoading(false);
        }
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Track What Matters, Anytime, Anywhere.
        </h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, here's a quick overview of your devices.
        </p>
      </div>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button variant="destructive" size="lg" className="h-24 text-2xl font-bold rounded-2xl shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-4">
                <Siren className="h-10 w-10 animate-pulse" />
                SOS EMERGENCY
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Confirm Emergency SOS?</AlertDialogTitle>
            <AlertDialogDescription>
                This will immediately alert your emergency contacts and the nearest authorities with your current location. Are you sure you want to proceed?
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSos} disabled={isSosLoading}>
                {isSosLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSosLoading ? "Activating..." : "Activate SOS"}
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


      <div className="grid gap-4 md:grid-cols-3">
        <Button
          asChild
          size="lg"
          className="h-20 text-lg rounded-2xl shadow-sm hover:shadow-md transition-shadow"
        >
          <Link href="/devices/new">
            <PlusCircle className="mr-3 h-6 w-6" /> Add Device
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          className="h-20 text-lg bg-accent hover:bg-accent/90 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
        >
          <Link href="/map">
            <Map className="mr-3 h-6 w-6" /> Live Map
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="relative h-20 text-lg rounded-2xl shadow-sm hover:shadow-md transition-shadow"
        >
          <Link href="/notifications">
            <Bell className="mr-3 h-6 w-6" /> Notifications
            <span className="absolute top-3 right-3 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
            </span>
          </Link>
        </Button>
      </div>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Status Snapshot</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Devices"
              value={deviceCount}
              icon={PlusCircle}
            />
            <StatCard
              title="Active"
              value={activeDevices}
              icon={CheckCircle2}
              color="text-accent"
            />
            <StatCard
              title="Stopped"
              value={stoppedDevices}
              icon={AlertTriangle}
              color="text-destructive"
            />
            <StatCard
              title="Offline"
              value={offlineDevices}
              icon={PowerOff}
              color="text-muted-foreground"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
