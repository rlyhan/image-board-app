import { PexelImage } from "../types";

export async function getCuratedPhotos(page: number = 1, perPage: number = 12): Promise<PexelImage[]> {
  const res = await fetch(`/api/pexels?page=${page}&per_page=${perPage}`);
  if (!res.ok) throw new Error("Failed to fetch curated photos");
  const data = await res.json();
  return data.photos;
}

export async function searchPhotos(query: string, perPage: number = 12): Promise<PexelImage[]> {
  const res = await fetch(`/api/pexels?query=${encodeURIComponent(query)}&per_page=${perPage}`);
  if (!res.ok) throw new Error("Failed to search photos");
  const data = await res.json();
  return data.photos;
}