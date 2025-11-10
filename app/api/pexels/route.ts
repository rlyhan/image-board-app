import { NextRequest, NextResponse } from "next/server";
import { fetchFromPexels } from "@/lib/pexels";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const page = url.searchParams.get("page") || "1";
    const per_page = url.searchParams.get("per_page") || "12";

    const data = await fetchFromPexels("curated", { page, per_page });
    return NextResponse.json(data);
}
