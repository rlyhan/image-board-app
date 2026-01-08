import "server-only";
import clientPromise from "@/lib/mongodb";
import type { Collection } from "mongodb";
import type { ProfileDocument, FavouriteDocument } from "@/lib/types";

export async function getProfilesCollection(): Promise<Collection<ProfileDocument>> {
    const client = await clientPromise;
    return client.db("imageboard").collection<ProfileDocument>("profiles");
}

export async function getFavouritesCollection(): Promise<Collection<FavouriteDocument>> {
    const client = await clientPromise;
    return client.db("imageboard").collection<FavouriteDocument>("favourites");
}