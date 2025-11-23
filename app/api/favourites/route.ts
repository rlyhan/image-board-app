import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { auth0 } from "@/lib/auth0";
import { FavouriteDocument, PexelImage } from "@/lib/types";

export const runtime = "nodejs";

// Helper to get DB collection
async function getFavouritesCollection() {
    const client = await clientPromise;
    const db = client.db("imageboard");
    return db.collection<FavouriteDocument>("favourites");
}

export async function GET(req: NextRequest) {
    try {
        const session = await auth0.getSession(req);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const favourites = await getFavouritesCollection();
        const doc = await favourites.findOne({ auth0Id: session.user.sub });

        return NextResponse.json(doc?.images || []);
    } catch (error: any) {
        console.error("GET favourites error:", error);
        return NextResponse.json({ error: error.message || "Failed to fetch favourites" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth0.getSession(req);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { image }: { image: PexelImage } = await req.json();
        if (!image || !image.id) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

        const favourites = await getFavouritesCollection();
        await favourites.updateOne(
            { auth0Id: session.user.sub },
            { $addToSet: { images: image } },
            { upsert: true }
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("POST favourites error:", error);
        return NextResponse.json({ error: error.message || "Failed to save favourite" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await auth0.getSession(req);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { imageId }: { imageId: number } = await req.json();
        if (!imageId) return NextResponse.json({ error: "Missing imageId" }, { status: 400 });

        const favourites = await getFavouritesCollection();
        await favourites.updateOne(
            { auth0Id: session.user.sub },
            { $pull: { images: { id: imageId } } } // match by image.id
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("DELETE favourites error:", error);
        return NextResponse.json({ error: error.message || "Failed to remove favourite" }, { status: 500 });
    }
}
