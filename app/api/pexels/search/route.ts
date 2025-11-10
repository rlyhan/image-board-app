import { NextRequest, NextResponse } from "next/server";
import { fetchFromPexels } from "@/lib/pexels";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const query = url.searchParams.get("query");
    const page = url.searchParams.get("page") || "1";
    const per_page = url.searchParams.get("per_page") || "12";

    if (!query) {
        return NextResponse.json({ photos: [] });
    }

    try {
        const data = await fetchFromPexels("search", { query, page, per_page });
        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ photos: [] }, { status: 500 });
    }
}
