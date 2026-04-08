import type { WeatherData } from "@/lib/weather-api";
import { formatTime, windDirection } from "@/lib/weather-api";
import { useUnits } from "@/hooks/use-units";
import { Droplets, Eye, Gauge, Sunrise, Sunset, Wind, Compass, CloudRain } from "lucide-react";

interface DetailsGridProps {
  data: WeatherData;
}

const DetailTile = ({
  icon: Icon,
  label,
  value,
  sub,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  delay: string;
}) => (
  <div className="weather-glass rounded-2xl p-4 animate-fade-up" style={{ animationDelay: delay }}>
    <div className="flex items-center gap-1.5 mb-2">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </div>
    <p className="text-xl font-semibold text-foreground tabular-nums">{value}</p>
    {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
  </div>
);

export function DetailsGrid({ data }: DetailsGridProps) {
  const { convertWind, windLabel } = useUnits();

  return (
    <div className="grid grid-cols-2 gap-3">
      <DetailTile
        icon={Droplets}
        label="Humidity"
        value={`${data.main.humidity}%`}
        sub={data.main.humidity > 60 ? "Quite humid" : "Comfortable"}
        delay="0.25s"
      />
      <DetailTile
        icon={Wind}
        label="Wind"
        value={`${convertWind(data.wind.speed).toFixed(1)} ${windLabel}`}
        sub={`${windDirection(data.wind.deg)}${data.wind.gust ? ` · Gusts ${convertWind(data.wind.gust).toFixed(1)} ${windLabel}` : ""}`}
        delay="0.3s"
      />
      <DetailTile
        icon={Gauge}
        label="Pressure"
        value={`${data.main.pressure} hPa`}
        delay="0.35s"
      />
      <DetailTile
        icon={Eye}
        label="Visibility"
        value={`${(data.visibility / 1000).toFixed(1)} km`}
        delay="0.4s"
      />
      <DetailTile
        icon={Sunrise}
        label="Sunrise"
        value={formatTime(data.sys.sunrise, data.timezone)}
        delay="0.45s"
      />
      <DetailTile
        icon={Sunset}
        label="Sunset"
        value={formatTime(data.sys.sunset, data.timezone)}
        delay="0.5s"
      />
      <DetailTile
        icon={Compass}
        label="Wind Dir"
        value={`${data.wind.deg}°`}
        sub={windDirection(data.wind.deg)}
        delay="0.55s"
      />
      <DetailTile
        icon={CloudRain}
        label="Cloudiness"
        value={`${data.clouds.all}%`}
        delay="0.6s"
      />
    </div>
  );
}
