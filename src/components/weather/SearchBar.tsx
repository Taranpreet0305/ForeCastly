import { useState, useEffect, useRef, type FormEvent } from "react";
import { Search, MapPin } from "lucide-react";
import { fetchCitySuggestions, type GeoResult } from "@/lib/geocoding-api";

interface SearchBarProps {
  onSearch: (city: string) => void;
  loading: boolean;
}

export function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeoResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      const results = await fetchCitySuggestions(query.trim());
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      setHighlightIndex(-1);
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (s: GeoResult) => {
    const label = s.state ? `${s.name}, ${s.state}, ${s.country}` : `${s.name}, ${s.country}`;
    setQuery(label);
    setShowSuggestions(false);
    onSearch(s.name);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => (i < suggestions.length - 1 ? i + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => (i > 0 ? i - 1 : suggestions.length - 1));
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[highlightIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search any city…"
            className="w-full h-14 pl-12 pr-14 rounded-lg bg-card border border-border shadow-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow text-base"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-md bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 active:scale-95 transition-all disabled:opacity-40"
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </button>
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-14 left-0 right-0 z-50 weather-glass rounded-2xl border border-border/50 shadow-xl overflow-hidden animate-fade-up">
          {suggestions.map((s, i) => (
            <button
              key={`${s.name}-${s.country}-${s.lat}`}
              onClick={() => selectSuggestion(s)}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                i === highlightIndex ? "bg-primary/10" : "hover:bg-muted/60"
              } ${i < suggestions.length - 1 ? "border-b border-border/30" : ""}`}
            >
              <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">{s.name}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {s.state ? `${s.state}, ` : ""}{s.country}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
