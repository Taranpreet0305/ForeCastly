import { Sun, ShieldAlert } from "lucide-react";
import { getUVLabel } from "@/lib/weather-api";

interface UVIndexCardProps {
  uvIndex: number;
}

export function UVIndexCard({ uvIndex }: UVIndexCardProps) {
  const uv = Math.round(uvIndex * 10) / 10;
  const { label, color, advice } = getUVLabel(uv);

  // Position marker on gradient bar (0-12 scale)
  const pct = Math.min((uv / 12) * 100, 100);

  return (
    <div className="weather-glass rounded-2xl p-5 animate-fade-up" style={{ animationDelay: "0.18s" }}>
      <div className="flex items-center gap-2 mb-3">
        <Sun className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          UV Index
        </h3>
      </div>

      <div className="flex items-end gap-3 mb-3">
        <span className={`text-3xl font-semibold ${color}`}>{uv}</span>
        <span className={`text-sm font-medium pb-1 ${color}`}>{label}</span>
      </div>

      {/* UV gradient bar */}
      <div className="relative h-2 rounded-full overflow-hidden mb-2 bg-gradient-to-r from-green-400 via-yellow-400 via-orange-500 to-red-600">
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-foreground/40 shadow-md transition-all duration-500"
          style={{ left: `calc(${pct}% - 6px)` }}
        />
      </div>

      <div className="flex justify-between text-[10px] text-muted-foreground mb-3">
        <span>0</span>
        <span>3</span>
        <span>6</span>
        <span>9</span>
        <span>12+</span>
      </div>

      <div className="flex items-center gap-1.5">
        <ShieldAlert className="h-3.5 w-3.5 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">{advice}</p>
      </div>
    </div>
  );
}
