"use client";

import { useCurrentUser } from "@/context/UserContext";
import { addToFavourites, removeFromFavourites } from "@/lib/client/favourites";
import { PexelImage } from "@/lib/types";
import { Button } from "@/components";
import { useFavouritesStore } from "@/context/FavouritesContext";
import Heart from "@/components/icons/Heart";

type FavouriteButtonProps = {
    image: PexelImage;
};

export default function FavouriteButton({ image }: FavouriteButtonProps) {
    const user = useCurrentUser();
    const isFav = useFavouritesStore((s) => s.isFavourite(image.id));
    const addFavourite = useFavouritesStore((s) => s.addFavourite);
    const removeFavourite = useFavouritesStore((s) => s.removeFavourite);

    async function toggleFavourite(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            alert("Please login.");
            return;
        }

        // Optimistic update
        if (isFav) {
            removeFavourite(image.id);
        } else {
            addFavourite(image);
        }

        try {
            if (isFav) {
                await removeFromFavourites(image.id);
            } else {
                await addToFavourites(image);
            }
        } catch (err) {
            console.error(err);
            // Revert on failure by re-fetching the source of truth
            const { getFavourites } = await import("@/lib/client/favourites");
            getFavourites()
                .then((favs) => useFavouritesStore.getState().setFavourites(favs))
                .catch(() => {});
            alert("Failed to update favourite.");
        }
    }

    return (
        <Button
            onClick={toggleFavourite}
            label={<Heart filled={isFav} />}
            variant="round"
            theme="light"
            additionalClasses="h-[42px] w-[42px] relative"
        />
    );
}
