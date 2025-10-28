
import { Bell, Check, Circle } from "lucide-react";
import { format } from "date-fns";

import PageHeader from "@/components/page-header";
import { notifications } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { NotificationType } from "@/lib/types";

const notificationIcons: Record<NotificationType, React.ElementType> = {
  info: Circle,
  warning: Circle,
  success: Circle,
};

const notificationColors: Record<NotificationType, string> = {
  info: "fill-primary text-primary",
  warning: "fill-destructive text-destructive",
  success: "fill-accent text-accent",
};

export default function NotificationsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Notifications" />

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-0">
          <ul className="divide-y">
            {notifications.map((notif) => {
              const Icon = notificationIcons[notif.type];
              return (
                <li
                  key={notif.id}
                  className={cn(
                    "flex items-start gap-4 p-4 transition-colors hover:bg-muted/50",
                    !notif.isRead && "bg-primary/5"
                  )}
                >
                  <div className="mt-1">
                     <Icon className={cn("h-3 w-3", notificationColors[notif.type])} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{notif.message}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(notif.timestamp), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                  {!notif.isRead && (
                    <div className="mt-1">
                      <span className="text-xs font-semibold text-primary">NEW</span>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
