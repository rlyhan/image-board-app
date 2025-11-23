"use client";

import { useState, useEffect } from "react";
import { addToFavourites, removeFromFavourites } from "@/lib/api/favourites";
import { PexelImage } from "@/lib/types";
import { Button } from "@/components";
import { useFavourites } from "@/context/FavouritesContext";

type FavouriteButtonProps = {
    image: PexelImage;
};

export default function FavouriteButton({ image }: FavouriteButtonProps) {
    const { setFavourites, isFavourite } = useFavourites();
    const [loading, setLoading] = useState(false);
    const [buttonLabel, setButtonLabel] = useState("");

    const currentlyFavourite = isFavourite(image.id);

    useEffect(() => {
        setButtonLabel(currentlyFavourite ? "Remove favourite" : "Favourite");
    }, [currentlyFavourite]);

    async function toggleFavourite() {
        setLoading(true);
        try {
            if (currentlyFavourite) {
                await removeFromFavourites(image.id);
                setFavourites(prev => prev.filter(img => img.id !== image.id));
            } else {
                await addToFavourites(image);
                setFavourites(prev => [...prev, image]);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to update favourite.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            onClick={toggleFavourite}
            label={loading ? "Updating..." : buttonLabel}
            disabled={loading}
            variant={currentlyFavourite ? "red" : "green"}
        />
    );
}
