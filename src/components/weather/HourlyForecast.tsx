import type { ForecastItem } from "@/lib/weather-api";
import { getWeatherIconUrl } from "@/lib/weather-api";
import { useUnits } from "@/hooks/use-units";
import { Clock } from "lucide-react";

interface HourlyForecastProps {
  list: ForecastItem[];
}

export function HourlyForecast({ list }: HourlyForecastProps) {
  const hours = list.slice(0, 8);
  const { convertTemp, tempLabel } = useUnits();

  return (
    <div className="weather-glass rounded-2xl p-5 animate-fade-up" style={{ animationDelay: "0.1s" }}>
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Hourly Forecast
        </h3>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
        {hours.map((item, i) => {
          const time = new Date(item.dt * 1000);
          const label = i === 0 ? "Now" : time.toLocaleTimeString("en-US", { hour: "numeric" });
          return (
            <div key={item.dt} className="flex flex-col items-center gap-1 min-w-[3.5rem]">
              <span className="text-xs text-muted-foreground">{label}</span>
              <img
                src={getWeatherIconUrl(item.weather[0].icon)}
                alt={item.weather[0].description}
                className="w-8 h-8"
              />
              <span className="text-sm font-medium text-foreground tabular-nums">
                {Math.round(convertTemp(item.main.temp))}{tempLabel}
              </span>
              {item.pop > 0 && (
                <span className="text-[10px] text-weather-cool tabular-nums">
                  {Math.round(item.pop * 100)}%
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
