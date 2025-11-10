"use client";

import { useEffect, useRef, useState } from "react";
import { PexelImage } from "@/lib/types";
import GalleryImage from "./GalleryImage";

type GalleryProps = {
    initialPhotos: PexelImage[];
};

export default function Gallery({ initialPhotos }: GalleryProps) {
    const [photos, setPhotos] = useState<PexelImage[]>(initialPhotos);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    // Fetch next page
    const loadMore = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/pexels?page=${page + 1}&per_page=12`);
            const data = await res.json();
            setPhotos((prev) => [...prev, ...data.photos]);
            setPage((prev) => prev + 1);
        } finally {
            setLoading(false);
        }
    };

    // Intersection Observer
    useEffect(() => {
        if (!sentinelRef.current) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) loadMore();
        });

        observer.observe(sentinelRef.current);

        return () => observer.disconnect();
    }, [sentinelRef.current, loading]);

    return (
        <div className="p-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[12px] max-w-[1500px] mx-auto">
            {photos.map((photo) => (
                <GalleryImage key={photo.id} photo={photo} />
            ))}
            <div ref={sentinelRef} className="h-10" />
            {loading && <p className="col-span-full text-center">Loading...</p>}
        </div>
    );
}
