import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import type { WeatherData } from "@/lib/weather-api";

interface FavoriteButtonProps {
  weather: WeatherData;
}

export function FavoriteButton({ weather }: FavoriteButtonProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const fav = isFavorite(weather.name);

  const toggle = () => {
    if (fav) {
      removeFavorite(weather.name);
    } else {
      addFavorite({ name: weather.name, country: weather.sys.country });
    }
  };

  return (
    <button
      onClick={toggle}
      className={`h-11 w-11 rounded-md flex items-center justify-center transition-all active:scale-90 ${
        fav
          ? "bg-primary/15 text-primary"
          : "bg-card border border-border text-muted-foreground hover:text-primary hover:shadow-md"
      }`}
      aria-label={fav ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart className={`h-5 w-5 transition-all ${fav ? "fill-primary" : ""}`} />
    </button>
  );
}
