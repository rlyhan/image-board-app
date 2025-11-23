"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { getFavourites } from "@/lib/api/favourites";
import { PexelImage } from "@/lib/types";

type FavouritesContextType = {
    favourites: PexelImage[];
    setFavourites: React.Dispatch<React.SetStateAction<PexelImage[]>>;
    isFavourite: (imageId: number) => boolean;
};

const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined);

export function FavouritesProvider({ children }: { children: ReactNode }) {
    const { user } = useUser();
    const [favourites, setFavourites] = useState<PexelImage[]>([]);

    useEffect(() => {
        async function loadFavourites() {
            try {
                if (!user) return;
                const favs = await getFavourites();
                setFavourites(favs);
            } catch (err) {
                console.error("Failed to load favourites", err);
            }
        }

        loadFavourites();
    }, []);

    const isFavourite = (imageId: number) => favourites.some((img) => img.id === imageId);

    return (
        <FavouritesContext.Provider value={{ favourites, setFavourites, isFavourite }}>
            {children}
        </FavouritesContext.Provider>
    );
}

export function useFavourites() {
    const context = useContext(FavouritesContext);
    if (!context) {
        throw new Error("useFavourites must be used within a FavouritesProvider");
    }
    return context;
}
