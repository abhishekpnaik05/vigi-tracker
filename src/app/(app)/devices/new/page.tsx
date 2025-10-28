
"use client";

import { useState, useRef, useEffect, type ChangeEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Camera, ScanLine } from "lucide-react";
import { toast } from "sonner";

import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

type PairingMethod = "manual" | "qr";

export default function NewDevicePage() {
  const [pairingMethod, setPairingMethod] = useState<PairingMethod>("manual");
  const [showScanner, setShowScanner] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (showScanner) {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error("Error accessing camera:", error);
          setHasCameraPermission(false);
          toast.error("Camera Access Denied", {
            description: "Please enable camera permissions in your browser settings to scan a QR code.",
          });
          setShowScanner(false);
          setPairingMethod("manual");
        }
      };

      getCameraPermission();

      return () => {
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
        }
      }
    }
  }, [showScanner]);


  const handlePairingChange = (value: PairingMethod) => {
    setPairingMethod(value);
    if (value === "qr") {
      setShowScanner(true);
    } else {
      setShowScanner(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto">
      <PageHeader title="Add New Device">
        <Button asChild variant="outline">
          <Link href="/devices">
            <ArrowLeft />
            Back to Devices
          </Link>
        </Button>
      </PageHeader>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Pairing Method</CardTitle>
          <CardDescription>
            Choose how you want to add your new device.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={pairingMethod}
            onValueChange={(v) => handlePairingChange(v as PairingMethod)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <RadioGroupItem value="manual" id="manual" className="peer sr-only" />
              <Label
                htmlFor="manual"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <ScanLine className="mb-3 h-6 w-6" />
                Manual Entry
              </Label>
            </div>
            <div>
              <RadioGroupItem value="qr" id="qr" className="peer sr-only" />
              <Label
                htmlFor="qr"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Camera className="mb-3 h-6 w-6" />
                Scan QR Code
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {showScanner && (
         <Card className="rounded-2xl shadow-sm">
           <CardHeader>
             <CardTitle>Scan QR Code</CardTitle>
             <CardDescription>Position the QR code within the frame to pair your device automatically.</CardDescription>
           </CardHeader>
           <CardContent>
             <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-64 h-64 border-4 border-dashed border-white/50 rounded-2xl"/>
                </div>
             </div>
             {hasCameraPermission === false && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTitle>Camera Access Required</AlertTitle>
                  <AlertDescription>
                    Please allow camera access in your browser to use this feature.
                  </AlertDescription>
                </Alert>
              )}
           </CardContent>
         </Card>
      )}

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Device Details</CardTitle>
          <CardDescription>
            Fill in the information below to register a new tracking device.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="device-nickname">Device Nickname</Label>
            <Input
              id="device-nickname"
              placeholder="e.g., Daughter's Car, School Van"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="device-id">Device ID / Serial Number</Label>
            <Input id="device-id" placeholder="e.g., VRB12345" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="device-type">Vehicle/Asset Type</Label>
            <Select>
              <SelectTrigger id="device-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="car">Car</SelectItem>
                <SelectItem value="bike">Bike</SelectItem>
                <SelectItem value="person">Person</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any relevant notes here..."
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save Device</Button>
      </div>
    </div>
  );
}
