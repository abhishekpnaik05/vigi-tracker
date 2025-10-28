
"use client";

import { useState } from "react";
import { Wand2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { generateGeofenceSuggestions } from "@/ai/flows/generate-geofence-alert";

type GeofenceSuggesterProps = {
  deviceHistory: string;
};

export default function GeofenceSuggester({ deviceHistory }: GeofenceSuggesterProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateSuggestions = async () => {
    setIsLoading(true);
    setSuggestions([]);
    try {
      const result = await generateGeofenceSuggestions({ deviceHistory });
      setSuggestions(result.geofenceSuggestions);
    } catch (error) {
      console.error("Error generating geofence suggestions:", error);
      toast.error("Generation Failed", {
        description: "Could not generate geofence suggestions. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle>AI Geofence Suggestions</CardTitle>
        <CardDescription>
          Generate potential safe zones or important locations based on this device's history.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Button onClick={handleGenerateSuggestions} disabled={isLoading}>
            <Wand2 className="mr-2 h-4 w-4" />
            {isLoading ? "Generating..." : "Suggest Geofences"}
          </Button>

          {suggestions.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="font-semibold">Suggested Locations:</h4>
              <ul className="list-disc list-inside bg-muted/50 p-4 rounded-lg">
                {suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
