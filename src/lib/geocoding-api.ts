const API_KEY = "376c2ac3227717c4ada5c1026faa4902";

export interface GeoResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export async function fetchCitySuggestions(query: string): Promise<GeoResult[]> {
  if (!query || query.length < 2) return [];
  try {
    const res = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((item: any) => ({
      name: item.name,
      country: item.country,
      state: item.state,
      lat: item.lat,
      lon: item.lon,
    }));
  } catch {
    return [];
  }
}
