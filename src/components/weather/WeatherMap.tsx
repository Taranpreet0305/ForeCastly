import { useEffect, useRef, useState } from "react";
import { Map as MapIcon, Layers } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const API_KEY = "376c2ac3227717c4ada5c1026faa4902";

type LayerType = "precipitation" | "clouds" | "temp" | "wind";

const LAYERS: { id: LayerType; label: string }[] = [
  { id: "precipitation", label: "Rain" },
  { id: "clouds", label: "Clouds" },
  { id: "temp", label: "Temp" },
  { id: "wind", label: "Wind" },
];

const TILE_URLS: Record<LayerType, string> = {
  precipitation: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
  clouds: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
  temp: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
  wind: `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
};

interface WeatherMapProps {
  lat: number;
  lon: number;
}

export function WeatherMap({ lat, lon }: WeatherMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const overlayRef = useRef<L.TileLayer | null>(null);
  const [activeLayer, setActiveLayer] = useState<LayerType>("precipitation");

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [lat, lon],
      zoom: 6,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 18,
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    overlayRef.current = L.tileLayer(TILE_URLS[activeLayer], {
      opacity: 0.6,
      maxZoom: 18,
    }).addTo(map);

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Update center when coords change
  useEffect(() => {
    mapInstance.current?.setView([lat, lon], 6);
  }, [lat, lon]);

  // Update overlay when layer changes
  useEffect(() => {
    if (!mapInstance.current) return;
    if (overlayRef.current) {
      overlayRef.current.remove();
    }
    overlayRef.current = L.tileLayer(TILE_URLS[activeLayer], {
      opacity: 0.6,
      maxZoom: 18,
    }).addTo(mapInstance.current);
  }, [activeLayer]);

  return (
    <div className="weather-glass rounded-2xl overflow-hidden animate-fade-up" style={{ animationDelay: "0.15s" }}>
      <div className="flex items-center justify-between p-4 pb-2">
        <div className="flex items-center gap-2">
          <MapIcon className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Weather Map
          </h3>
        </div>
        <div className="flex gap-1">
          {LAYERS.map((l) => (
            <button
              key={l.id}
              onClick={() => setActiveLayer(l.id)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all active:scale-95 ${
                activeLayer === l.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
      <div ref={mapRef} className="h-56 w-full" />
    </div>
  );
}
