"use client";

import { useEffect, useRef, useState } from "react";
import { PexelImage } from "@/lib/types";
import { getCuratedPhotos, searchPhotos } from "@/lib/api/pexels";
import GalleryImage from "./GalleryImage";
import GallerySearch from "./GallerySearch";

type GalleryProps = {
    initialPhotos: PexelImage[];
    includeSearch?: boolean;
    disableLoadMore?: boolean;
};

export default function Gallery({ initialPhotos, includeSearch, disableLoadMore }: GalleryProps) {
    const [photos, setPhotos] = useState<PexelImage[]>(initialPhotos);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    const loadMore = async () => {
        if (loading || disableLoadMore) return;
        setLoading(true);
        try {
            const newPhotos = await getCuratedPhotos(page + 1, 12);
            setPhotos((prev) => [...prev, ...newPhotos]);
            setPage((prev) => prev + 1);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (query: string) => {
        if (disableLoadMore) return;
        const results = await searchPhotos(query);
        setPhotos(results);
    };

    // Intersection Observer
    useEffect(() => {
        if (!sentinelRef.current || disableLoadMore) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) loadMore();
        });

        observer.observe(sentinelRef.current);

        return () => observer.disconnect();
    }, [sentinelRef.current, loading, disableLoadMore]);

    return (
        <div className="mb-10">
            {includeSearch && !disableLoadMore && (
                <GallerySearch onSearch={handleSearch} />
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[12px]">
                {photos.map((photo) => (
                    <GalleryImage key={photo.id} photo={photo} />
                ))}
                {!disableLoadMore && <div ref={sentinelRef} className="h-10" />}
                {loading && <p className="col-span-full text-center">Loading...</p>}
            </div>
        </div>
    );
}
