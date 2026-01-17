import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Favorite } from "../types";

interface FavoritesState {
  favorites: Favorite[];
  addFavorite: (favorite: Omit<Favorite, "id" | "createdAt">) => void;
  removeFavorite: (id: string) => void;
  updateNickname: (id: string, nickname: string) => void;
  isFavorite: (locationId: string) => boolean;
  getFavorite: (locationId: string) => Favorite | undefined;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (favorite) => {
        const { favorites } = get();
        if (favorites.length >= 6) {
          throw new Error("즐겨찾기는 최대 6개까지 추가할 수 있습니다.");
        }

        const newFavorite: Favorite = {
          ...favorite,
          id: `fav-${Date.now()}-${Math.random()}`,
          createdAt: Date.now(),
        };

        set({ favorites: [...favorites, newFavorite] });
      },

      removeFavorite: (id) => {
        set((state) => ({
          favorites: state.favorites.filter((fav) => fav.id !== id),
        }));
      },

      updateNickname: (id, nickname) => {
        set((state) => ({
          favorites: state.favorites.map((fav) =>
            fav.id === id ? { ...fav, nickname } : fav
          ),
        }));
      },

      isFavorite: (locationId) => {
        return get().favorites.some((fav) => fav.location.id === locationId);
      },

      getFavorite: (locationId) => {
        return get().favorites.find((fav) => fav.location.id === locationId);
      },
    }),
    {
      name: "favorites-storage",
    }
  )
);
