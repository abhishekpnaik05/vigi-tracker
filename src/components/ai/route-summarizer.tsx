
"use client";

import { useState } from "react";
import { Wand2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { summarizeRouteHistory } from "@/ai/flows/summarize-route-history";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import type { DeviceHistory } from "@/lib/types";

type RouteSummarizerProps = {
  deviceId: string;
  historyData: DeviceHistory[];
};

export default function RouteSummarizer({ deviceId, historyData }: RouteSummarizerProps) {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSummarize = async () => {
    setIsLoading(true);
    setSummary("");
    try {
      const result = await summarizeRouteHistory({
        deviceId,
        startTime: "08:00 AM",
        endTime: "01:30 PM",
        routeHistory: JSON.stringify(historyData, null, 2),
      });
      setSummary(result.summary);
    } catch (error) {
      console.error("Failed to summarize route history:", error);
      toast.error("Summarization Failed", {
        description: "Could not generate route summary. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle>AI Route Summary</CardTitle>
        <CardDescription>
          Get a quick, human-readable summary of this trip.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleSummarize} disabled={isLoading} className="w-full">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          {isLoading ? "Generating Summary..." : "Generate AI Summary"}
        </Button>
        {summary && (
          <div className="mt-4 rounded-lg border bg-muted/50 p-4 text-sm">
            <p className="whitespace-pre-wrap font-sans">{summary}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
