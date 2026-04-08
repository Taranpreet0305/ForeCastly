import { useState, useCallback, useEffect } from "react";
import {
  fetchWeather,
  fetchWeatherByCoords,
  fetchForecast,
  fetchAQI,
  fetchUV,
  fetchAlerts,
  type WeatherData,
  type ForecastData,
  type AQIData,
  type WeatherAlert,
} from "@/lib/weather-api";

interface WeatherState {
  weather: WeatherData | null;
  forecast: ForecastData | null;
  aqi: AQIData | null;
  uvIndex: number | null;
  alerts: WeatherAlert[];
  loading: boolean;
  error: string | null;
  geoLoading: boolean;
}

export function useWeather() {
  const [state, setState] = useState<WeatherState>({
    weather: null,
    forecast: null,
    aqi: null,
    uvIndex: null,
    alerts: [],
    loading: false,
    error: null,
    geoLoading: false,
  });

  const loadAllData = useCallback(async (weatherData: WeatherData) => {
    const { lat, lon } = weatherData.coord;
    const [forecast, aqi, uv, alerts] = await Promise.all([
      fetchForecast(lat, lon),
      fetchAQI(lat, lon),
      fetchUV(lat, lon),
      fetchAlerts(lat, lon),
    ]);
    setState({
      weather: weatherData,
      forecast,
      aqi,
      uvIndex: uv,
      alerts,
      loading: false,
      error: null,
      geoLoading: false,
    });
  }, []);

  const search = useCallback(async (city: string) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const weather = await fetchWeather(city);
      await loadAllData(weather);
    } catch (err) {
      setState((s) => ({
        ...s,
        loading: false,
        error: err instanceof Error ? err.message : "Something went wrong",
      }));
    }
  }, [loadAllData]);

  const searchByCoords = useCallback(async (lat: number, lon: number) => {
    setState((s) => ({ ...s, loading: true, geoLoading: true, error: null }));
    try {
      const weather = await fetchWeatherByCoords(lat, lon);
      await loadAllData(weather);
    } catch (err) {
      setState((s) => ({
        ...s,
        loading: false,
        geoLoading: false,
        error: err instanceof Error ? err.message : "Something went wrong",
      }));
    }
  }, [loadAllData]);

  // Auto-detect location on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      setState((s) => ({ ...s, geoLoading: true }));
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          searchByCoords(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          // User denied or error — just stop loading
          setState((s) => ({ ...s, geoLoading: false }));
        },
        { timeout: 8000 }
      );
    }
  }, [searchByCoords]);

  return { ...state, search };
}
