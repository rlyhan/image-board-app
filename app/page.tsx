import Image from "next/image";
import { fetchFromPexels } from "@/lib/pexels";

export const revalidate = 3600; // ISR (revalidate every hour)

export default async function HomePage() {
  const data = await fetchFromPexels("curated", { per_page: "12" });
  const photos = data.photos;

  return (
    <main className="p-8 grid grid-cols-2 md:grid-cols-3 gap-4">
      {photos.map((photo: any) => (
        <div key={photo.id} className="relative aspect-square">
          <Image
            src={photo.src.large2x}
            alt={photo.alt}
            fill
            className="object-cover rounded-xl"
            sizes="(max-width: 768px) 100vw, 33vw"
            placeholder="blur"
            blurDataURL={photo.src.tiny}
          />
        </div>
      ))}
    </main>
  );
}
