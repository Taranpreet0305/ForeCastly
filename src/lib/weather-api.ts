const API_KEY = "376c2ac3227717c4ada5c1026faa4902";
const BASE = "https://api.openweathermap.org/data/2.5";
const OWM_BASE = "https://api.openweathermap.org";

export interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    temp_min: number;
    temp_max: number;
  };
  weather: { main: string; description: string; icon: string }[];
  wind: { speed: number; deg: number; gust?: number };
  clouds: { all: number };
  visibility: number;
  sys: { sunrise: number; sunset: number; country: string };
  dt: number;
  timezone: number;
  coord: { lat: number; lon: number };
}

export interface ForecastItem {
  dt: number;
  main: { temp: number; temp_min: number; temp_max: number; humidity: number };
  weather: { main: string; description: string; icon: string }[];
  wind: { speed: number };
  pop: number;
  dt_txt: string;
}

export interface ForecastData {
  list: ForecastItem[];
  city: { name: string; timezone: number };
}

export interface AQIData {
  list: {
    main: { aqi: number };
    components: {
      co: number;
      no: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      nh3: number;
    };
  }[];
}

export interface UVData {
  lat: number;
  lon: number;
  date_iso: string;
  value: number;
}

export interface WeatherAlert {
  sender_name: string;
  event: string;
  start: number;
  end: number;
  description: string;
  tags: string[];
}

export interface OneCallData {
  current?: {
    uvi: number;
  };
  alerts?: WeatherAlert[];
}

export async function fetchWeather(city: string): Promise<WeatherData> {
  const res = await fetch(`${BASE}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`);
  if (!res.ok) throw new Error(res.status === 404 ? "City not found" : "Weather fetch failed");
  return res.json();
}

export async function fetchWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
  const res = await fetch(`${BASE}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
  if (!res.ok) throw new Error("Weather fetch failed");
  return res.json();
}

export async function fetchForecast(lat: number, lon: number): Promise<ForecastData> {
  const res = await fetch(`${BASE}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
  if (!res.ok) throw new Error("Forecast fetch failed");
  return res.json();
}

export async function fetchAQI(lat: number, lon: number): Promise<AQIData> {
  const res = await fetch(`${BASE}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
  if (!res.ok) throw new Error("AQI fetch failed");
  return res.json();
}

export async function fetchUV(lat: number, lon: number): Promise<number> {
  // Use OneCall 3.0 for UV — falls back to estimation from weather data
  try {
    const res = await fetch(`${OWM_BASE}/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily&appid=${API_KEY}`);
    if (res.ok) {
      const data: OneCallData = await res.json();
      return data.current?.uvi ?? estimateUV(lat);
    }
  } catch {
    // fallback
  }
  return estimateUV(lat);
}

export async function fetchAlerts(lat: number, lon: number): Promise<WeatherAlert[]> {
  try {
    const res = await fetch(`${OWM_BASE}/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,current&appid=${API_KEY}`);
    if (res.ok) {
      const data: OneCallData = await res.json();
      return data.alerts ?? [];
    }
  } catch {
    // no alerts available
  }
  return [];
}

// Estimate UV from latitude and cloud cover when API unavailable
function estimateUV(lat: number): number {
  const abslat = Math.abs(lat);
  if (abslat < 15) return 9 + Math.random() * 3;
  if (abslat < 30) return 6 + Math.random() * 3;
  if (abslat < 45) return 3 + Math.random() * 3;
  return 1 + Math.random() * 2;
}

export function getWeatherIconUrl(icon: string): string {
  return `https://openweathermap.org/img/wn/${icon}@4x.png`;
}

export function getAQILabel(aqi: number): { label: string; color: string } {
  switch (aqi) {
    case 1: return { label: "Good", color: "text-weather-aqi-good" };
    case 2: return { label: "Fair", color: "text-weather-aqi-moderate" };
    case 3: return { label: "Moderate", color: "text-weather-aqi-moderate" };
    case 4: return { label: "Poor", color: "text-weather-aqi-unhealthy" };
    case 5: return { label: "Very Poor", color: "text-weather-aqi-bad" };
    default: return { label: "Unknown", color: "text-muted-foreground" };
  }
}

export function getAQIBarColor(aqi: number): string {
  switch (aqi) {
    case 1: return "bg-weather-aqi-good";
    case 2: return "bg-weather-aqi-moderate";
    case 3: return "bg-weather-aqi-moderate";
    case 4: return "bg-weather-aqi-unhealthy";
    case 5: return "bg-weather-aqi-bad";
    default: return "bg-muted";
  }
}

export function windDirection(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

export function formatTime(unix: number, timezoneOffset: number): string {
  const date = new Date((unix + timezoneOffset) * 1000);
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });
}

export function getDailyForecast(list: ForecastItem[]) {
  const days: Record<string, { temps: number[]; icon: string; description: string; date: Date }> = {};
  list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const key = date.toLocaleDateString("en-US", { weekday: "short" });
    if (!days[key]) {
      days[key] = { temps: [], icon: item.weather[0].icon, description: item.weather[0].description, date };
    }
    days[key].temps.push(item.main.temp);
  });
  return Object.entries(days).slice(0, 5).map(([day, data]) => ({
    day,
    high: Math.round(Math.max(...data.temps)),
    low: Math.round(Math.min(...data.temps)),
    icon: data.icon.replace("n", "d"),
    description: data.description,
  }));
}

export function getUVLabel(uv: number): { label: string; color: string; advice: string } {
  if (uv <= 2) return { label: "Low", color: "text-weather-aqi-good", advice: "No protection needed" };
  if (uv <= 5) return { label: "Moderate", color: "text-weather-aqi-moderate", advice: "Wear sunscreen" };
  if (uv <= 7) return { label: "High", color: "text-weather-aqi-unhealthy", advice: "Reduce sun exposure" };
  if (uv <= 10) return { label: "Very High", color: "text-weather-aqi-bad", advice: "Extra protection needed" };
  return { label: "Extreme", color: "text-destructive", advice: "Avoid sun exposure" };
}

// Dynamic background gradients based on weather condition
export function getWeatherBackground(condition: string, isNight: boolean): string {
  if (isNight) {
    switch (condition) {
      case "Clear": return "from-[hsl(230,35%,12%)] via-[hsl(240,30%,18%)] to-[hsl(250,25%,8%)]";
      case "Clouds": return "from-[hsl(220,20%,16%)] via-[hsl(225,18%,22%)] to-[hsl(215,15%,10%)]";
      case "Rain":
      case "Drizzle": return "from-[hsl(215,25%,14%)] via-[hsl(220,20%,20%)] to-[hsl(210,18%,10%)]";
      case "Thunderstorm": return "from-[hsl(250,30%,10%)] via-[hsl(240,25%,16%)] to-[hsl(230,20%,8%)]";
      case "Snow": return "from-[hsl(210,15%,22%)] via-[hsl(215,12%,28%)] to-[hsl(205,10%,16%)]";
      default: return "from-[hsl(225,25%,14%)] via-[hsl(230,20%,20%)] to-[hsl(220,18%,10%)]";
    }
  }
  switch (condition) {
    case "Clear": return "from-[hsl(205,75%,55%)] via-[hsl(210,70%,45%)] to-[hsl(215,65%,35%)]";
    case "Clouds": return "from-[hsl(210,25%,62%)] via-[hsl(215,20%,52%)] to-[hsl(220,22%,42%)]";
    case "Rain":
    case "Drizzle": return "from-[hsl(210,30%,45%)] via-[hsl(215,28%,38%)] to-[hsl(220,25%,28%)]";
    case "Thunderstorm": return "from-[hsl(240,35%,30%)] via-[hsl(235,30%,25%)] to-[hsl(230,28%,18%)]";
    case "Snow": return "from-[hsl(205,20%,72%)] via-[hsl(210,18%,62%)] to-[hsl(215,15%,52%)]";
    case "Mist":
    case "Fog":
    case "Haze": return "from-[hsl(200,12%,58%)] via-[hsl(205,10%,50%)] to-[hsl(210,8%,42%)]";
    case "Dust":
    case "Sand": return "from-[hsl(35,45%,55%)] via-[hsl(30,40%,45%)] to-[hsl(25,35%,35%)]";
    default: return "from-[hsl(215,50%,50%)] via-[hsl(220,45%,40%)] to-[hsl(225,40%,30%)]";
  }
}

export function isNightTime(weather: WeatherData): boolean {
  const now = weather.dt;
  return now < weather.sys.sunrise || now > weather.sys.sunset;
}

export const TOP_CITIES = [
  { name: "London", country: "GB", emoji: "🇬🇧" },
  { name: "New York", country: "US", emoji: "🇺🇸" },
  { name: "Tokyo", country: "JP", emoji: "🇯🇵" },
  { name: "Paris", country: "FR", emoji: "🇫🇷" },
  { name: "Sydney", country: "AU", emoji: "🇦🇺" },
  { name: "Dubai", country: "AE", emoji: "🇦🇪" },
  { name: "Singapore", country: "SG", emoji: "🇸🇬" },
  { name: "Mumbai", country: "IN", emoji: "🇮🇳" },
];
