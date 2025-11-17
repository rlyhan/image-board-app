import { NextRequest, NextResponse } from "next/server";
import { fetchPhotos, searchPhotos } from "@/lib/pexels";

export async function GET(req: NextRequest) {
    const page = Number(req.nextUrl.searchParams.get("page") || 1);
    const per_page = Number(req.nextUrl.searchParams.get("per_page") || 12);
    const query = req.nextUrl.searchParams.get("query") || undefined;

    let photos;
    try {
        photos = query
            ? await searchPhotos(query, per_page)
            : await fetchPhotos(page, per_page);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }

    return NextResponse.json({ photos });
}
