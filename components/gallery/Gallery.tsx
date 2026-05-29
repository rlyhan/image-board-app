"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { PexelImage } from "@/lib/types";
import { getCuratedPhotos, searchPhotos } from "@/lib/client/pexels";
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

    const loadMore = useCallback(async () => {
        if (loading || disableLoadMore) return;
        setLoading(true);
        try {
            const newPhotos = await getCuratedPhotos(page + 1, 12);
            setPhotos((prev) => {
                const seen = new Set(prev.map((p) => p.id));
                return [...prev, ...newPhotos.filter((p) => !seen.has(p.id))];
            });
            setPage((prev) => prev + 1);
        } finally {
            setLoading(false);
        }
    }, [loading, page, disableLoadMore]);

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
    }, [loadMore, disableLoadMore]);

    return (
        <div className="mb-10">
            {includeSearch && !disableLoadMore && (
                <GallerySearch onSearch={handleSearch} />
            )}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 auto-rows-[16px] sm:auto-rows-[12px]">
                {photos.map((photo) => (
                    <GalleryImage key={photo.id} photo={photo} />
                ))}
                {!disableLoadMore && <div ref={sentinelRef} className="h-10" />}
                {loading && (
                    <div className="col-span-full flex justify-center py-4">
                        <div role="status" aria-live="polite">
                            <span className="sr-only">Loading more images</span>
                            <div aria-hidden="true" className="w-10 h-10 border-4 border-foreground/20 border-t-foreground rounded-full animate-spin" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
