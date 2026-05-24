"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PexelImage } from "@/lib/types";
import FavouriteButton from "./FavouriteButton";
import AddCartButton from "../cart/AddCartButton";

type GalleryImageModalProps = {
    photo: PexelImage;
    onClose: () => void;
};

export default function GalleryImageModal({ photo, onClose }: GalleryImageModalProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const dialogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const previouslyFocused = document.activeElement as HTMLElement | null;
        dialogRef.current?.focus();

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKeyDown);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
            previouslyFocused?.focus();
        };
    }, [onClose]);

    return (
        <div
            ref={dialogRef}
            tabIndex={-1}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 focus:outline-none"
            role="dialog"
            aria-modal="true"
            aria-label={photo.alt || "Image preview"}
        >
            <button
                type="button"
                className="absolute inset-0 bg-black/80 cursor-default"
                aria-label="Close modal"
                onClick={onClose}
            />

            <div className="relative flex items-center justify-center max-h-[80vh] sm:max-h-[90vh] max-w-full">
                <Image
                    src={photo.src?.original || photo.src?.large2x || photo.src?.large || ""}
                    alt={photo.alt || ""}
                    width={photo.width || 1200}
                    height={photo.height || 800}
                    sizes="100vw"
                    onLoad={() => setImageLoaded(true)}
                    className={`w-auto h-auto max-h-[80vh] sm:max-h-[90vh] max-w-full object-contain rounded-lg transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                />
                {imageLoaded && (
                    <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10">
                        <AddCartButton image={photo} />
                        <FavouriteButton image={photo} />
                    </div>
                )}
            </div>

            {!imageLoaded && (
                <div
                    role="status"
                    aria-live="polite"
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                    <span className="sr-only">Loading image</span>
                    <div
                        aria-hidden="true"
                        className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin"
                    />
                </div>
            )}
        </div>
    );
}
