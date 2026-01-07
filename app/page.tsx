import { Container, Gallery } from "@/components";
import { getCuratedPhotos } from "@/lib/client/pexels";

export const revalidate = 3600; // ISR (revalidate every hour)

export default async function HomePage() {
  const photos = await getCuratedPhotos();
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
