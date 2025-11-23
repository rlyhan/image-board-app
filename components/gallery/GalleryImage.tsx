import Image from "next/image";
import { PexelImage } from "@/lib/types";
import FavouriteButton from "./FavouriteButton";

type GalleryImageProps = {
    photo: PexelImage;
}

export default function GalleryImage({ photo }: GalleryImageProps) {
    const rowSpan = Math.ceil(((photo.height || 400) / (photo.width || 400)) * 10);

    return (
        <div
            className="overflow-hidden rounded-lg relative group"
            style={{ gridRowEnd: `span ${rowSpan}` }}
        >
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                <FavouriteButton image={photo} />
            </div>
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
