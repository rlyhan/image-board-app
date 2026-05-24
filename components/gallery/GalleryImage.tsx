import Image from "next/image";
import { PexelImage } from "@/lib/types";
import FavouriteButton from "./FavouriteButton";
import AddCartButton from "../cart/AddCartButton";

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
            <div className="flex items-center gap-2 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                <AddCartButton image={photo} />
                <FavouriteButton image={photo} />
            </div>
            <Image
                src={photo.src?.large2x || photo.src?.medium || ""}
                alt={photo.alt || ""}
                width={photo.width || 400}
                height={photo.height || 400}
                sizes="(max-width: 639px) calc(50vw - 8px), (max-width: 767px) calc(50vw - 16px), (max-width: 1023px) 33vw, 25vw"
                loading="lazy"
                className="w-full h-full object-cover"
            />
        </div>
    );
}
