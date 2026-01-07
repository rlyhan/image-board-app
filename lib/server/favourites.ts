import "server-only";

import clientPromise from "@/lib/mongodb";
import type { FavouriteDocument } from "@/lib/types";

export async function getFavourites(auth0Id: string) {
    const client = await clientPromise;
    const db = client.db("imageboard");
    const favourites = db.collection<FavouriteDocument>("favourites");

    const doc = await favourites.findOne({ auth0Id });
    return doc?.images ?? [];
}
