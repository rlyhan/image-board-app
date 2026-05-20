import { Container, Gallery } from "@/components";
import { fetchPhotos } from "@/lib/server/pexels";

export const revalidate = 3600; // ISR (revalidate every hour)

export default async function HomePage() {
  const photos = await fetchPhotos();
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
