import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FavoriteContextType {
  favorites: string[];
  addFavorite: (dish: string) => void;
  removeFavorite: (dish: string) => void;
}

interface FavoritesProviderProps {
  children: ReactNode;
}

const FavoritesContext = createContext<FavoriteContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  const addFavorite = (dish: string) => {
    setFavorites((prevFavorites) => [...prevFavorites, dish]);
  };

  const removeFavorite = (dish: string) => {
    setFavorites((prevFavorites) => prevFavorites.filter((item) => item !== dish));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoriteContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

