import { useWeather } from "@/hooks/use-weather";
import { SearchBar } from "@/components/weather/SearchBar";
import { CurrentWeather } from "@/components/weather/CurrentWeather";
import { HourlyForecast } from "@/components/weather/HourlyForecast";
import { ForecastCard } from "@/components/weather/ForecastCard";
import { AQICard } from "@/components/weather/AQICard";
import { UVIndexCard } from "@/components/weather/UVIndexCard";
import { AlertsCard } from "@/components/weather/AlertsCard";
import { DetailsGrid } from "@/components/weather/DetailsGrid";
import { TopCities } from "@/components/weather/TopCities";
import { WeatherMap } from "@/components/weather/WeatherMap";
import { SettingsPanel } from "@/components/weather/SettingsPanel";
import { FavoriteCities } from "@/components/weather/FavoriteCities";
import { FavoriteButton } from "@/components/weather/FavoriteButton";
import { CloudSun, Navigation } from "lucide-react";

const Index = () => {
  const { weather, forecast, aqi, uvIndex, alerts, loading, error, geoLoading, search } = useWeather();

  const showEmpty = !weather && !loading && !error && !geoLoading;

  return (
    <div className="min-h-screen bg-background transition-colors duration-500">
      {/* Header */}
      <header className="pt-10 pb-6 px-4">
        <div className="max-w-lg mx-auto flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <img src="/mainlogo1.png" alt="SkyCast Logo" className="h-12 w-12 object-contain" />
            <h1 className="text-4xl font-bold text-foreground tracking-tight">SkyCast</h1>
          </div>
          <div className="flex items-center gap-3">
            {weather && !loading && <FavoriteButton weather={weather} />}
            <SettingsPanel />
          </div>
        </div>
        <SearchBar onSearch={search} loading={loading} />
      </header>

      <main className="max-w-lg mx-auto px-4 pb-16 space-y-3">
        {/* Error */}
        {error && (
          <div className="weather-glass rounded-2xl p-5 text-center animate-fade-up">
            <p className="text-destructive font-medium">{error}</p>
            <p className="text-sm text-muted-foreground mt-1">Try searching for another city</p>
          </div>
        )}

        {/* Geo loading */}
        {geoLoading && !weather && (
          <div className="text-center pt-16 animate-fade-up">
            <Navigation className="h-10 w-10 mx-auto text-primary animate-pulse mb-3" />
            <p className="text-sm text-muted-foreground">Detecting your location…</p>
          </div>
        )}

        {/* Empty state with favorites + top cities */}
        {showEmpty && (
          <div className="space-y-6">
            <div className="text-center pt-8 animate-fade-up">
              <img src="/mainlogo1.png" alt="SkyCast" className="h-20 w-20 mx-auto opacity-20 grayscale mb-4" />
              <p className="text-lg font-medium text-foreground">Welcome to SkyCast</p>
              <p className="text-sm text-muted-foreground mt-1">
                Search for a city or pick one below
              </p>
            </div>
            <FavoriteCities onSelect={search} />
            <TopCities onSelect={search} />
          </div>
        )}

        {/* Loading skeleton */}
        {loading && !geoLoading && (
          <div className="space-y-3 animate-pulse-gentle">
            <div className="bg-gradient-to-br from-muted to-muted/60 rounded-2xl h-64" />
            <div className="weather-glass rounded-2xl h-32" />
            <div className="weather-glass rounded-2xl h-48" />
          </div>
        )}

        {/* Results */}
        {weather && !loading && (
          <>
            {alerts.length > 0 && (
              <AlertsCard alerts={alerts} timezone={weather.timezone} />
            )}
            <CurrentWeather data={weather} />
            {forecast && <HourlyForecast list={forecast.list} />}
            <WeatherMap lat={weather.coord.lat} lon={weather.coord.lon} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {aqi && <AQICard data={aqi} />}
              {uvIndex !== null && <UVIndexCard uvIndex={uvIndex} />}
            </div>
            {forecast && <ForecastCard list={forecast.list} />}
            <DetailsGrid data={weather} />
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
