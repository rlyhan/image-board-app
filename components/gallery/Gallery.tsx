"use client";

import { useEffect, useRef, useState, useCallback, startTransition } from "react";
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
    const [, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [galleryVisible, setGalleryVisible] = useState(true);
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadingRef = useRef(false);
    const pageRef = useRef(1);
    const searchIdRef = useRef(0);

    const loadMore = useCallback(async () => {
        if (loadingRef.current || disableLoadMore || !hasMore) return;
        loadingRef.current = true;
        setLoading(true);
        try {
            const nextPage = pageRef.current + 1;
            const newPhotos = await getCuratedPhotos(nextPage, 12);
            if (newPhotos.length === 0) {
                setHasMore(false);
                return;
            }
            pageRef.current = nextPage;
            startTransition(() => {
                setPhotos((prev) => {
                    const seen = new Set(prev.map((p) => p.id));
                    return [...prev, ...newPhotos.filter((p) => !seen.has(p.id))];
                });
                setPage(nextPage);
            });
        } finally {
            loadingRef.current = false;
            setLoading(false);
            // Re-observe to force an intersection check — IO only fires on state
            // changes, so if the sentinel is still in view after adding images it
            // would silently stall without this.
            if (sentinelRef.current && observerRef.current) {
                observerRef.current.unobserve(sentinelRef.current);
                observerRef.current.observe(sentinelRef.current);
            }
        }
    }, [disableLoadMore, hasMore]);

    const handleQueryChange = useCallback(() => {
        setGalleryVisible(false);
    }, []);

    const handleSearch = useCallback(async (query: string) => {
        if (disableLoadMore) return;
        const id = ++searchIdRef.current;
        const results = await searchPhotos(query);
        if (id !== searchIdRef.current) return;
        setPhotos(results);
        requestAnimationFrame(() => setGalleryVisible(true));
    }, [disableLoadMore]);

    useEffect(() => {
        if (!sentinelRef.current || disableLoadMore) return;

        const observer = new IntersectionObserver((entries) => {
            const intersecting = entries[0].isIntersecting;
            setIsIntersecting(intersecting);
            if (intersecting) loadMore();
        });

        observerRef.current = observer;
        observer.observe(sentinelRef.current);

        return () => {
            observer.disconnect();
            observerRef.current = null;
        };
    }, [loadMore, disableLoadMore]);

    const showSpinner = !disableLoadMore && hasMore && (loading || isIntersecting);

    return (
        <div className="mb-10">
            {includeSearch && !disableLoadMore && (
                <GallerySearch onSearch={handleSearch} onQueryChange={handleQueryChange} />
            )}
            <div className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 auto-rows-[16px] sm:auto-rows-[12px] transition-opacity duration-200 ${galleryVisible ? "opacity-100" : "opacity-0"}`}>
                {photos.map((photo, index) => (
                    <GalleryImage key={photo.id} photo={photo} priority={index < 8} />
                ))}
                {!disableLoadMore && <div ref={sentinelRef} className="h-10" />}
            </div>
            {showSpinner && (
                <div className="flex justify-center mt-14">
                    <div role="status" aria-live="polite">
                        <span className="sr-only">Loading more images</span>
                        <div aria-hidden="true" className="w-10 h-10 border-4 border-foreground/20 border-t-foreground rounded-full animate-spin" />
                    </div>
                </div>
            )}
        </div>
    );
}
