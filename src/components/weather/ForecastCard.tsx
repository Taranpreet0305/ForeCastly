import type { ForecastItem } from "@/lib/weather-api";
import { getDailyForecast, getWeatherIconUrl } from "@/lib/weather-api";
import { useUnits } from "@/hooks/use-units";
import { CalendarDays } from "lucide-react";

interface ForecastCardProps {
  list: ForecastItem[];
}

export function ForecastCard({ list }: ForecastCardProps) {
  const days = getDailyForecast(list);
  const { convertTemp, tempLabel } = useUnits();

  return (
    <div className="weather-glass rounded-2xl p-5 animate-fade-up" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          5-Day Forecast
        </h3>
      </div>

      <div className="space-y-0">
        {days.map((d, i) => (
          <div
            key={d.day}
            className={`flex items-center justify-between py-3 ${
              i < days.length - 1 ? "border-b border-border/50" : ""
            }`}
          >
            <span className="text-sm font-medium w-12 text-foreground">{d.day}</span>
            <img
              src={getWeatherIconUrl(d.icon)}
              alt={d.description}
              className="w-8 h-8"
            />
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground tabular-nums w-10 text-right">
                {Math.round(convertTemp(d.low))}{tempLabel}
              </span>
              <div className="w-20 h-1 rounded-full bg-muted relative overflow-hidden">
                <div
                  className="absolute inset-y-0 rounded-full bg-gradient-to-r from-weather-cool to-weather-warm"
                  style={{
                    left: `${((d.low + 10) / 60) * 100}%`,
                    right: `${100 - ((d.high + 10) / 60) * 100}%`,
                  }}
                />
              </div>
              <span className="text-sm font-medium tabular-nums w-10 text-foreground">
                {Math.round(convertTemp(d.high))}{tempLabel}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
