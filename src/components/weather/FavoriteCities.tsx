import { Heart, HeartOff, Star } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";

interface FavoriteCitiesProps {
  onSelect: (city: string) => void;
}

export function FavoriteCities({ onSelect }: FavoriteCitiesProps) {
  const { favorites, removeFavorite } = useFavorites();

  if (favorites.length === 0) return null;

  return (
    <div className="animate-fade-up" style={{ animationDelay: "0.05s" }}>
      <div className="flex items-center gap-2 mb-3">
        <Star className="h-4 w-4 text-primary" />
        <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Favorites
        </h3>
      </div>

      <div className="flex gap-2 flex-wrap">
        {favorites.map((city) => (
          <div
            key={city.name}
            className="weather-glass rounded-xl pl-4 pr-2 py-2.5 flex items-center gap-2 group hover:shadow-md transition-all"
          >
            <button
              onClick={() => onSelect(city.name)}
              className="text-sm font-medium text-foreground group-hover:text-primary transition-colors"
            >
              {city.name}
              <span className="text-[10px] text-muted-foreground ml-1.5 uppercase">
                {city.country}
              </span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFavorite(city.name);
              }}
              className="h-6 w-6 rounded-md flex items-center justify-center hover:bg-destructive/10 transition-colors active:scale-90"
              aria-label={`Remove ${city.name} from favorites`}
            >
              <HeartOff className="h-3 w-3 text-muted-foreground hover:text-destructive transition-colors" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
