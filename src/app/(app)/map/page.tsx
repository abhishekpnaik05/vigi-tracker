import DynamicLeafletMap from "@/components/dynamic-leaflet-map";

export default function MapPage() {
  return (
    <div className="h-[calc(100vh-10rem)] -m-4 sm:-m-6 md:-m-8 rounded-2xl overflow-hidden">
      <DynamicLeafletMap />
    </div>
  );
}