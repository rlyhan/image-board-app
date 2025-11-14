import { fetchFromPexels } from "@/lib/pexels";
import { Container, Gallery } from "@/components";

export const revalidate = 3600; // ISR (revalidate every hour)

export default async function HomePage() {
  const data = await fetchFromPexels("curated", { per_page: "12" });
  const photos = data.photos;

  return (
    <main>
      {Array.isArray(photos) && photos.length > 0 ? (
        <Container>
          <Gallery initialPhotos={photos} includeSearch />
        </Container>
      ) : null}
    </main>

  );
}
