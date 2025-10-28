
import { History, FileDown, Dot, PlayCircle, PauseCircle, AlertCircle, CheckCircle } from "lucide-react";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deviceHistory } from "@/lib/data";
import RouteSummarizer from "@/components/ai/route-summarizer";
import type { DeviceHistory } from "@/lib/types";
import { cn } from "@/lib/utils";

const eventIcons = {
    start: PlayCircle,
    stop: PauseCircle,
    move: Dot,
    alert: AlertCircle,
    end: CheckCircle
}

const eventColors = {
    start: 'text-accent',
    stop: 'text-destructive',
    move: 'text-primary',
    alert: 'text-destructive',
    end: 'text-accent'
}


function HistoryTimelineItem({ event }: { event: DeviceHistory }) {
    const Icon = eventIcons[event.type];
    return (
        <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
                <span className={cn("flex h-8 w-8 items-center justify-center rounded-full bg-muted", eventColors[event.type])}>
                   <Icon className="h-5 w-5" />
                </span>
                {event.type !== 'end' && <div className="w-px h-16 bg-border" />}
            </div>
            <div className="flex-1 pt-1.5">
                <p className="font-semibold">{event.location}</p>
                <p className="text-sm text-muted-foreground">{event.details}</p>
                <time className="text-xs text-muted-foreground">{event.time}</time>
            </div>
        </div>
    )
}

export default function HistoryPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Device History">
        <Button variant="outline">
          <FileDown />
          Export Report
        </Button>
      </PageHeader>
      
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
            <Card className="rounded-2xl shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <History />
                        <span>Trip Timeline: Today</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {deviceHistory.map((event, index) => (
                            <HistoryTimelineItem key={index} event={event} />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-1">
          <RouteSummarizer deviceId="DEV001" historyData={deviceHistory} />
        </div>
      </div>
    </div>
  );
}
