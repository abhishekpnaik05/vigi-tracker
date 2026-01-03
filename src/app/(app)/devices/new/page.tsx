"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Camera, ScanLine, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { addDevice } from "@/services/device-service";
import type { Device } from "@/lib/types";
import { useUser } from "@/firebase/auth/use-user";

type PairingMethod = "manual" | "qr";

const formSchema = z.object({
  name: z.string().min(2, { message: "Nickname must be at least 2 characters." }),
  serialNumber: z.string().min(5, { message: "Serial number must be at least 5 characters." }),
  type: z.enum(["Car", "Bike", "Person", "Other"], { required_error: "Please select a type."}),
  notes: z.string().optional(),
});

export default function NewDevicePage() {
  const router = useRouter();
  const { user } = useUser();
  const [pairingMethod, setPairingMethod] = useState<PairingMethod>("manual");
  const [showScanner, setShowScanner] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      serialNumber: "",
      notes: "",
    },
  });

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
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast.error("Authentication Error", {
        description: "You must be logged in to add a device.",
      });
      return;
    }
    setIsSubmitting(true);
    try {
        const newDeviceData = {
            name: values.name,
            type: values.type,
            userId: user.uid,
            // Mock data for fields not in form
            battery: 100,
            speed: 0,
            status: 'Offline' as const,
        };
        await addDevice(newDeviceData as any); // Casting to any to match service call
        toast.success("Device Added", {
            description: `${values.name} has been successfully added to your devices.`,
        });
        router.push("/devices");
    } catch (error) {
        toast.error("Failed to Add Device", {
            description: "An error occurred while saving the device. Please try again.",
        });
        console.error("Failed to add device:", error);
    } finally {
        setIsSubmitting(false);
    }
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8 max-w-3xl mx-auto">
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
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device Nickname</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Daughter's Car, School Van" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="serialNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device ID / Serial Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., VRB12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle/Asset Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Car">Car</SelectItem>
                      <SelectItem value="Bike">Bike</SelectItem>
                      <SelectItem value="Person">Person</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add any relevant notes here..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Saving..." : "Save Device"}
            </Button>
        </div>
      </form>
    </Form>
  );
}
