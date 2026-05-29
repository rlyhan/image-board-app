"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { PexelImage } from "@/lib/types";
import FavouriteButton from "./FavouriteButton";
import AddCartButton from "../cart/AddCartButton";
import GalleryImageModal from "./GalleryImageModal";

type GalleryImageProps = {
    photo: PexelImage;
}

export default function GalleryImage({ photo }: GalleryImageProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const closeModal = useCallback(() => setModalOpen(false), []);
    const naturalRatio = (photo.height || 400) / (photo.width || 400);
    const rowSpan = Math.ceil(naturalRatio * 10);

    const [isHoverCapable, setIsHoverCapable] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const [clipPct, setClipPct] = useState(0);

    // useLayoutEffect runs before paint — sets both flags in one batched update to avoid a flash
    useLayoutEffect(() => {
        const hover = window.matchMedia("(hover: hover)").matches;
        if (hover) {
            const el = cardRef.current!;
            const imgH = el.offsetWidth * naturalRatio;
            const cardH = el.offsetHeight;
            setClipPct(imgH > cardH ? (imgH - cardH) / (2 * imgH) * 100 : 0);
        }
        setIsHoverCapable(hover);
    }, [naturalRatio]);

    useEffect(() => {
        if (!isHoverCapable) return;
        const el = cardRef.current;
        if (!el) return;
        const update = () => {
            const imgH = el.offsetWidth * naturalRatio;
            const cardH = el.offsetHeight;
            setClipPct(imgH > cardH ? (imgH - cardH) / (2 * imgH) * 100 : 0);
        };
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, [isHoverCapable, naturalRatio]);

    const imgProps = {
        src: photo.src?.large2x || photo.src?.medium || "",
        alt: photo.alt || "",
        width: photo.width || 400,
        height: photo.height || 400,
        sizes: "(max-width: 639px) calc(50vw - 8px), (max-width: 767px) calc(50vw - 16px), (max-width: 1023px) 33vw, 25vw",
        loading: "lazy" as const,
    };

    return (
        <>
            <div
                ref={cardRef}
                className={isHoverCapable
                    ? "rounded-lg relative group gallery-card"
                    : "overflow-hidden rounded-lg relative group"
                }
                style={{ gridRowEnd: `span ${rowSpan}` }}
            >
                {isHoverCapable ? (
                    <div
                        className="gallery-frame absolute left-0 top-1/2 -translate-y-1/2 w-full pointer-events-none z-10"
                        style={{ "--clip-pct": `${clipPct.toFixed(2)}%` } as React.CSSProperties}
                    >
                        <Image {...imgProps} className="w-full h-auto pointer-events-none" />
                        <div className="gallery-hover-overlay absolute inset-0 bg-black/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <div className="gallery-hover-actions flex items-center gap-2 absolute top-2 right-2 opacity-0 group-hover:opacity-100 group-has-[*:focus-visible]:opacity-100 pointer-events-none group-hover:pointer-events-auto group-has-[*:focus-visible]:pointer-events-auto transition-opacity duration-200">
                            <AddCartButton image={photo} />
                            <FavouriteButton image={photo} />
                        </div>
                    </div>
                ) : (
                    <>
                        <Image {...imgProps} className="w-full h-full object-cover" />
                        <div className="flex items-center gap-2 absolute top-2 right-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-opacity duration-200 z-10">
                            <AddCartButton image={photo} />
                            <FavouriteButton image={photo} />
                        </div>
                    </>
                )}
                <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    aria-label={photo.alt ? `View ${photo.alt} larger` : "View image larger"}
                    className="absolute inset-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                />
            </div>
            {modalOpen && <GalleryImageModal photo={photo} onClose={closeModal} />}
        </>
    );
}
