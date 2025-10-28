
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DeviceStatus } from "@/lib/types";

type StatusBadgeProps = {
  status: DeviceStatus;
  className?: string;
};

const statusStyles: Record<DeviceStatus, string> = {
  Active: "bg-accent/20 text-accent-foreground border-accent/30 hover:bg-accent/30",
  Stopped: "bg-destructive/20 text-destructive-foreground border-destructive/30 hover:bg-destructive/30",
  Offline: "bg-muted text-muted-foreground border-muted-foreground/30",
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "capitalize transition-colors",
        statusStyles[status],
        className
      )}
    >
      <span className={cn(
        "h-2 w-2 rounded-full mr-2",
        status === "Active" && "bg-accent",
        status === "Stopped" && "bg-destructive",
        status === "Offline" && "bg-muted-foreground",
      )}></span>
      {status}
    </Badge>
  );
}
