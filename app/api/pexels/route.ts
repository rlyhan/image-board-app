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
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }

    const res = NextResponse.json({ photos });
    res.headers.set(
        "Access-Control-Allow-Origin",
        process.env.NEXT_PUBLIC_BASE_URL || "*"
    );
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return res;
}
