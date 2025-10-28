
import { MapPin, Car, PersonStanding, Bike } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { Device } from '@/lib/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type MapPlaceholderProps = {
  devices: Device[];
};

// A simple function to scale lat/lon to a 100x100 grid
const scaleCoordinates = (lat: number, lon: number, devices: Device[]) => {
  if (devices.length <= 1) {
    return { top: '50%', left: '50%' };
  }
  const latitudes = devices.map(d => d.location.lat);
  const longitudes = devices.map(d => d.location.lon);

  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLon = Math.min(...longitudes);
  const maxLon = Math.max(...longitudes);

  const latRange = maxLat - minLat;
  const lonRange = maxLon - minLon;

  const top = latRange > 0 ? ((maxLat - lat) / latRange) * 100 : 50;
  const left = lonRange > 0 ? ((lon - minLon) / lonRange) * 100 : 50;

  return { top: `${Math.max(5, Math.min(95, top))}%`, left: `${Math.max(5, Math.min(95, left))}%` };
};

const getDeviceIcon = (type: string | undefined) => {
    switch (type?.toLowerCase()) {
        case 'car': return <Car className="h-5 w-5" />;
        case 'person': return <PersonStanding className="h-5 w-5" />;
        case 'bike': return <Bike className="h-5 w-5" />;
        default: return <MapPin className="h-5 w-5" />;
    }
}

export default function MapPlaceholder({ devices = [] }: MapPlaceholderProps) {
  return (
    <Card className="relative h-[60vh] md:h-full w-full overflow-hidden rounded-2xl border-dashed border-2">
      <div className="absolute inset-0 bg-[radial-gradient(hsl(var(--border))_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-transparent to-background/80" />
      
      <div className="z-10 absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-background/80 backdrop-blur-sm">
          <MapPin className="h-12 w-12 text-primary" />
          <h2 className="mt-4 text-xl font-semibold text-foreground">
            Live Map Interface
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {devices.length > 0 ? `${devices.length} device(s) online.` : 'No devices to display.'}
          </p>
        </div>
      </div>
      
      <TooltipProvider>
        {devices.map((device) => {
            const { top, left } = scaleCoordinates(device.location.lat, device.location.lon, devices);
            return (
                <Tooltip key={device.id}>
                    <TooltipTrigger asChild>
                        <div 
                            className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 p-2 bg-primary text-primary-foreground rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform"
                            style={{ top, left }}
                        >
                           {getDeviceIcon(device.type)}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="font-bold">{device.name}</p>
                        <p className="text-sm text-muted-foreground">Status: {device.status}</p>
                        <p className="text-sm text-muted-foreground">Speed: {device.speed} km/h</p>
                    </TooltipContent>
                </Tooltip>
            );
        })}
      </TooltipProvider>

    </Card>
  );
}
