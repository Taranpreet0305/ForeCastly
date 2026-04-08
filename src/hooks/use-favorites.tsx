import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

export interface FavoriteCity {
  name: string;
  country: string;
}

interface FavoritesContextType {
  favorites: FavoriteCity[];
  addFavorite: (city: FavoriteCity) => void;
  removeFavorite: (name: string) => void;
  isFavorite: (name: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

const STORAGE_KEY = "skycast-favorites";

function loadFavorites(): FavoriteCity[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteCity[]>(loadFavorites);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = useCallback((city: FavoriteCity) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.name === city.name)) return prev;
      return [...prev, city];
    });
  }, []);

  const removeFavorite = useCallback((name: string) => {
    setFavorites((prev) => prev.filter((f) => f.name !== name));
  }, []);

  const isFavorite = useCallback(
    (name: string) => favorites.some((f) => f.name === name),
    [favorites]
  );

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
