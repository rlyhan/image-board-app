import "server-only";

import type { Collection } from "mongodb";
import type { FavouriteDocument } from "@/lib/types";

export async function getFavourites(
    favourites: Collection<FavouriteDocument>,
    auth0Id: string
) {
    const doc = await favourites.findOne({ auth0Id });
    return doc?.images ?? [];
}