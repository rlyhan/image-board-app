export async function fetchFromPexels(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`${process.env.NEXT_PUBLIC_PEXELS_API_URL}/${endpoint}`);
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const res = await fetch(url, {
    headers: {
      Authorization: process.env.PEXELS_API_KEY!,
    },
    // optional caching hints
    next: { revalidate: 3600 }, // revalidate every hour
  });

  if (!res.ok) throw new Error("Failed to fetch from Pexels API");

  return res.json();
}
