import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Favorite } from "../types";

interface FavoritesState {
  favorites: Favorite[];
  addFavorite: (favorite: Omit<Favorite, "id" | "createdAt">) => void;
  removeFavorite: (id: string) => void;
  updateNickname: (id: string, nickname: string) => void;
  isFavorite: (locationId: string) => boolean;
  isFavoriteByAddress: (address: string) => boolean;
  getFavorite: (locationId: string) => Favorite | undefined;
  getFavoriteByAddress: (address: string) => Favorite | undefined;
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

        // 주소 기반 중복 체크
        const isDuplicate = favorites.some(
          (fav) => fav.location.address === favorite.location.address,
        );
        if (isDuplicate) {
          throw new Error("이미 즐겨찾기에 추가된 주소입니다.");
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
            fav.id === id ? { ...fav, nickname } : fav,
          ),
        }));
      },

      isFavorite: (locationId) => {
        return get().favorites.some((fav) => fav.location.id === locationId);
      },

      isFavoriteByAddress: (address) => {
        return get().favorites.some((fav) => fav.location.address === address);
      },

      getFavorite: (locationId) => {
        return get().favorites.find((fav) => fav.location.id === locationId);
      },

      getFavoriteByAddress: (address) => {
        return get().favorites.find((fav) => fav.location.address === address);
      },
    }),
    {
      name: "favorites-storage",
    },
  ),
);
