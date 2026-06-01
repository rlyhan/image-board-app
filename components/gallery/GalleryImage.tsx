"use client";

import { lazy, memo, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { PexelImage } from "@/lib/types";
import { useHoverCapable } from "@/hooks/useHoverCapable";
import FavouriteButton from "./FavouriteButton";
import AddCartButton from "../cart/AddCartButton";

const GalleryImageModal = lazy(() => import("./GalleryImageModal"));

type GalleryImageProps = {
    photo: PexelImage;
    priority?: boolean;
}

function GalleryImage({ photo, priority = false }: GalleryImageProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const closeModal = useCallback(() => setModalOpen(false), []);
    const naturalRatio = (photo.height || 400) / (photo.width || 400);
    const rowSpan = Math.ceil(naturalRatio * 10);

    const isHoverCapable = useHoverCapable();

    const cardRef = useRef<HTMLDivElement>(null);
    const frameRef = useRef<HTMLDivElement>(null);

    const updateClipVar = useCallback(() => {
        if (!cardRef.current || !frameRef.current) return;
        const imgH = cardRef.current.offsetWidth * naturalRatio;
        const cardH = cardRef.current.offsetHeight;
        const pct = imgH > cardH ? (imgH - cardH) / (2 * imgH) * 100 : 0;
        const frame = frameRef.current;
        frame.style.transition = "none";
        frame.style.setProperty("--clip-pct", `${pct.toFixed(2)}%`);
        frame.offsetHeight; // flush style to prevent transition from firing
        frame.style.transition = "";
    }, [naturalRatio]);

    useLayoutEffect(() => {
        if (!isHoverCapable) return;
        updateClipVar();
    }, [isHoverCapable, updateClipVar]);

    useEffect(() => {
        if (!isHoverCapable || !cardRef.current) return;
        const el = cardRef.current;
        const ro = new ResizeObserver(updateClipVar);
        ro.observe(el);
        return () => ro.disconnect();
    }, [isHoverCapable, updateClipVar]);

    const imgProps = {
        src: photo.src?.large2x || photo.src?.medium || "",
        alt: photo.alt || "",
        width: photo.width || 400,
        height: photo.height || 400,
        sizes: "(max-width: 639px) calc(50vw - 8px), (max-width: 767px) calc(50vw - 16px), (max-width: 1023px) 33vw, 25vw",
        ...(priority ? { priority: true } : { loading: "lazy" as const }),
    };

    return (
        <>
            <div
                ref={cardRef}
                className={isHoverCapable
                    ? "rounded-lg relative group gallery-card"
                    : "overflow-hidden rounded-lg relative group gallery-card"
                }
                style={{ gridRowEnd: `span ${rowSpan}` }}
            >
                {isHoverCapable ? (
                    <div
                        ref={frameRef}
                        className="gallery-frame absolute left-0 top-1/2 -translate-y-1/2 w-full pointer-events-none z-10"
                    >
                        <Image {...imgProps} className="w-full h-auto pointer-events-none" />
                        {/* <div className="gallery-hover-overlay absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100" /> */}
                        <div className="gallery-hover-actions flex items-center gap-2 absolute top-2 right-2 opacity-0 group-hover:opacity-100 group-has-[*:focus-visible]:opacity-100 pointer-events-none group-hover:pointer-events-auto group-has-[*:focus-visible]:pointer-events-auto">
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
                    className={isHoverCapable
                        ? "absolute left-0 top-1/2 -translate-y-1/2 w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        : "absolute inset-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    }
                    style={isHoverCapable ? { aspectRatio: `${photo.width} / ${photo.height}` } : undefined}
                />
            </div>
            {modalOpen && (
                <Suspense fallback={
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 cursor-default"
                        onClick={closeModal}
                    >
                        <div aria-hidden="true" className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                }>
                    <GalleryImageModal photo={photo} onClose={closeModal} />
                </Suspense>
            )}
        </>
    );
}

export default memo(GalleryImage);
