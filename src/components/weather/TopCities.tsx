import { MapPin } from "lucide-react";
import { TOP_CITIES } from "@/lib/weather-api";

interface TopCitiesProps {
  onSelect: (city: string) => void;
}

export function TopCities({ onSelect }: TopCitiesProps) {
  return (
    <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Popular Cities
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {TOP_CITIES.map((city) => (
          <button
            key={city.name}
            onClick={() => onSelect(city.name)}
            className="weather-glass rounded-xl px-4 py-3 text-left hover:shadow-md active:scale-[0.97] transition-all duration-200 group"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{city.emoji}</span>
              <div>
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {city.name}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {city.country}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
