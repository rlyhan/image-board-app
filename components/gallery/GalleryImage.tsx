import Image from "next/image";
import { PexelImage } from "@/lib/types";

type GalleryImageProps = {
    photo: PexelImage
}

export default function GalleryImage({ photo }: GalleryImageProps) {
    const rowSpan = Math.ceil(((photo.height || 400) / (photo.width || 400)) * 10);

    return (
        <div
            className="overflow-hidden rounded-lg"
            style={{ gridRowEnd: `span ${rowSpan}` }}
        >
            <Image
                src={photo.src?.large2x || photo.src?.medium || ""}
                alt={photo.alt || ""}
                width={photo.width || 800}
                height={photo.height || 600}
                loading="lazy"
                className="w-full h-full object-cover"
            />
        </div>
    );
}
