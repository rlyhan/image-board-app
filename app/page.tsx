import { fetchFromPexels } from "@/lib/pexels";
import { Gallery } from "@/components";

export const revalidate = 3600; // ISR (revalidate every hour)

export default async function HomePage() {
  const data = await fetchFromPexels("curated", { per_page: "12" });
  const photos = data.photos;

  return (
    <main>
      {Array.isArray(photos) && photos.length > 0 && <Gallery initialPhotos={photos} includeSearch={true} />}
    </main>
  );
}
