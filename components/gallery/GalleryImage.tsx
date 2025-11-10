import Image from "next/image";
import { PexelImage } from "@/lib/types";

type GalleryImageProps = {
    photo: PexelImage
}

export default function GalleryImage({ photo }: GalleryImageProps) {
    return (
        <div className="overflow-hidden rounded-lg">
            <Image
                src={photo.src?.large2x || photo.src?.medium || ""}
                alt={photo.alt || ""}
                width={800}
                height={600}
                loading="lazy"
                className="object-cover w-full h-auto"
            />
        </div>
    );
}
