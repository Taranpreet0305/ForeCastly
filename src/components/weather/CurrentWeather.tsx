import type { WeatherData } from "@/lib/weather-api";
import { getWeatherIconUrl, getWeatherBackground, isNightTime } from "@/lib/weather-api";
import { useUnits } from "@/hooks/use-units";

interface CurrentWeatherProps {
  data: WeatherData;
}

export function CurrentWeather({ data }: CurrentWeatherProps) {
  const icon = data.weather[0].icon;
  const description = data.weather[0].description;
  const condition = data.weather[0].main;
  const night = isNightTime(data);
  const bgGradient = getWeatherBackground(condition, night);
  const { convertTemp, tempLabel } = useUnits();

  return (
    <div
      className={`bg-gradient-to-br ${bgGradient} rounded-2xl p-8 text-center relative overflow-hidden animate-fade-up transition-all duration-700`}
    >
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 blur-3xl -translate-y-1/2 translate-x-1/2" />
      {night && (
        <div className="absolute top-4 left-6 w-2 h-2 rounded-full bg-white/30 animate-pulse" />
      )}

      <p className="text-sm font-medium tracking-wide uppercase text-white/70 mb-1">
        {data.name}, {data.sys.country}
      </p>

      <img
        src={getWeatherIconUrl(icon)}
        alt={description}
        className="w-28 h-28 mx-auto -my-2 drop-shadow-lg"
      />

      <p className="text-7xl font-light text-white tracking-tight" style={{ lineHeight: "1" }}>
        {Math.round(convertTemp(data.main.temp))}{tempLabel}
      </p>

      <p className="text-white/80 capitalize text-base mt-2 mb-1">{description}</p>

      <div className="flex items-center justify-center gap-4 text-sm text-white/60">
        <span>H: {Math.round(convertTemp(data.main.temp_max))}{tempLabel}</span>
        <span>L: {Math.round(convertTemp(data.main.temp_min))}{tempLabel}</span>
        <span>Feels {Math.round(convertTemp(data.main.feels_like))}{tempLabel}</span>
      </div>
    </div>
  );
}
