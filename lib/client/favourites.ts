import { PexelImage } from "../types";

export async function getFavourites() {
    const res = await fetch("/api/favourites", {
        method: "GET",
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to fetch favourites");
    }

    return await res.json();
}

export async function addToFavourites(image: PexelImage) {
    const res = await fetch("/api/favourites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
    });

    if (!res.ok) {
        const error = await res.json();
        console.error('error:', error)
        throw new Error(error.error || "Failed to add favourite");
    }

    return res.json();
}

export async function removeFromFavourites(imageId: number) {
    const res = await fetch("/api/favourites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to remove favourite");
    }

    return res.json();
}
