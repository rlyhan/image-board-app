"use client";

import { useEffect, ReactNode } from "react";
import { create } from "zustand";
import { useCurrentUser } from "@/context/UserContext";
import { getFavourites } from "@/lib/client/favourites";
import { PexelImage } from "@/lib/types";

type FavouritesStore = {
    favourites: PexelImage[];
    addFavourite: (image: PexelImage) => void;
    removeFavourite: (imageId: number) => void;
    setFavourites: (favs: PexelImage[]) => void;
    isFavourite: (imageId: number) => boolean;
};

export const useFavouritesStore = create<FavouritesStore>()((set, get) => ({
    favourites: [],

    addFavourite: (image) =>
        set((s) => ({ favourites: [...s.favourites, image] })),

    removeFavourite: (imageId) =>
        set((s) => ({ favourites: s.favourites.filter((img) => img.id !== imageId) })),

    setFavourites: (favs) => set({ favourites: favs }),

    isFavourite: (imageId) => get().favourites.some((img) => img.id === imageId),
}));

// Loads favourites from the API once on mount if the user is logged in.
export function FavouritesProvider({ children }: { children: ReactNode }) {
    const user = useCurrentUser();

    useEffect(() => {
        if (!user) return;
        getFavourites()
            .then((favs) => useFavouritesStore.getState().setFavourites(favs))
            .catch((err) => console.error("Failed to load favourites", err));
    }, [user]);

    return <>{children}</>;
}
