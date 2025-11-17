import { PexelImage } from "./types";

const PEXELS_API_URL = "https://api.pexels.com/v1";
const API_KEY = process.env.PEXELS_API_KEY!;

async function fetchFromPexels(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`${PEXELS_API_URL}/${endpoint}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));

  const res = await fetch(url.toString(), {
    headers: { Authorization: API_KEY },
    next: { revalidate: 3600 }, // revalidate every hour
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Pexels API error: ${res.status} ${text}`);
  }

  return res.json();
}

export async function fetchPhotos(page: number = 1, perPage: number = 12): Promise<PexelImage[]> {
  const data = await fetchFromPexels("curated", { page: page.toString(), per_page: perPage.toString() });
  return data.photos;
}

export async function searchPhotos(query: string, perPage: number = 12): Promise<PexelImage[]> {
  const data = await fetchFromPexels("search", { query, per_page: perPage.toString() });
  return data.photos;
}
