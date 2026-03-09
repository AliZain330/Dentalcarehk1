import React, { createContext, useContext, useState, useCallback } from "react";

interface FavoritesContextType {
  favorites: Set<string>;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  doctorFavorites: Set<string>;
  toggleDoctorFavorite: (id: string) => void;
  isDoctorFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("saved-institutions");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });

  const [doctorFavorites, setDoctorFavorites] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("saved-doctors");
      return saved ? new Set(JSON.parse(saved)) : new Set(["od1", "od3"]);
    } catch { return new Set(["od1", "od3"]); }
  });

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem("saved-institutions", JSON.stringify([...next]));
      return next;
    });
  }, []);

  const isFavorite = useCallback((id: string) => favorites.has(id), [favorites]);

  const toggleDoctorFavorite = useCallback((id: string) => {
    setDoctorFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem("saved-doctors", JSON.stringify([...next]));
      return next;
    });
  }, []);

  const isDoctorFavorite = useCallback((id: string) => doctorFavorites.has(id), [doctorFavorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, doctorFavorites, toggleDoctorFavorite, isDoctorFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used within FavoritesProvider");
  return context;
};
