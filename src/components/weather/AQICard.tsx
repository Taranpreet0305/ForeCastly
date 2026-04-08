import type { AQIData } from "@/lib/weather-api";
import { getAQILabel, getAQIBarColor } from "@/lib/weather-api";
import { Wind } from "lucide-react";

interface AQICardProps {
  data: AQIData;
}

export function AQICard({ data }: AQICardProps) {
  const { aqi } = data.list[0].main;
  const components = data.list[0].components;
  const { label, color } = getAQILabel(aqi);
  const barColor = getAQIBarColor(aqi);

  const pollutants = [
    { name: "PM2.5", value: components.pm2_5, unit: "µg/m³" },
    { name: "PM10", value: components.pm10, unit: "µg/m³" },
    { name: "O₃", value: components.o3, unit: "µg/m³" },
    { name: "NO₂", value: components.no2, unit: "µg/m³" },
    { name: "SO₂", value: components.so2, unit: "µg/m³" },
    { name: "CO", value: components.co, unit: "µg/m³" },
  ];

  return (
    <div className="weather-glass rounded-2xl p-5 animate-fade-up" style={{ animationDelay: "0.15s" }}>
      <div className="flex items-center gap-2 mb-3">
        <Wind className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Air Quality
        </h3>
      </div>

      <div className="flex items-end gap-3 mb-3">
        <span className={`text-3xl font-semibold ${color}`}>{aqi}</span>
        <span className={`text-sm font-medium pb-1 ${color}`}>{label}</span>
      </div>

      {/* AQI bar */}
      <div className="h-1.5 rounded-full bg-muted mb-4 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${(aqi / 5) * 100}%` }}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {pollutants.map((p) => (
          <div key={p.name} className="text-center">
            <p className="text-xs text-muted-foreground">{p.name}</p>
            <p className="text-sm font-medium text-foreground tabular-nums">
              {p.value.toFixed(1)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
