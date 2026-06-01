"use client";

import { useCurrentUser } from "@/context/UserContext";
import { addToFavourites, removeFromFavourites } from "@/lib/client/favourites";
import { PexelImage } from "@/lib/types";
import { Button } from "@/components";
import { useFavourites } from "@/context/FavouritesContext";
import Heart from "@/components/icons/Heart";

type FavouriteButtonProps = {
    image: PexelImage;
};

export default function FavouriteButton({ image }: FavouriteButtonProps) {
    const user = useCurrentUser();
    const { setFavourites, isFavourite } = useFavourites();

    const currentlyFavourite = isFavourite(image.id);

    async function toggleFavourite(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            alert("Please login.");
            return;
        }

        // Optimistic update — flip state immediately
        if (currentlyFavourite) {
            setFavourites(prev => prev.filter(img => img.id !== image.id));
        } else {
            setFavourites(prev => [...prev, image]);
        }

        try {
            if (currentlyFavourite) {
                await removeFromFavourites(image.id);
            } else {
                await addToFavourites(image);
            }
        } catch (err) {
            console.error(err);
            // Revert on failure
            if (currentlyFavourite) {
                setFavourites(prev => [...prev, image]);
            } else {
                setFavourites(prev => prev.filter(img => img.id !== image.id));
            }
            alert("Failed to update favourite.");
        }
    }

    return (
        <Button
            onClick={toggleFavourite}
            label={<Heart filled={currentlyFavourite} />}
            variant="round"
            theme="light"
            additionalClasses="h-[42px] w-[42px] relative"
        />
    );
}
