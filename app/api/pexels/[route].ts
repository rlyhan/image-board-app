import { NextRequest, NextResponse } from "next/server";
import { fetchFromPexels } from "@/lib/pexels";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "nature";
  const per_page = searchParams.get("per_page") || "15";

  try {
    const data = await fetchFromPexels("search", { query, per_page });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}
