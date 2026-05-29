"use client";

import { useState } from "react";
import { Container, Gallery } from "@/components";
import type { PexelImage, Profile } from "@/lib/types";
import { useUser } from "@auth0/nextjs-auth0/client";
import DashboardHeader from "./DashboardHeader";

type DashboardProps = {
    initialProfile: Profile | null;
    initialFavourites: PexelImage[];
};

export default function Dashboard({
    initialProfile,
    initialFavourites,
}: DashboardProps) {
    const { user, isLoading, error } = useUser();
    const [profile, setProfile] = useState<Profile | null>(initialProfile);
    const [favourites] = useState<PexelImage[]>(initialFavourites);

    if (isLoading) return (
        <Container>
            <div className="flex justify-center py-12">
                <div role="status" aria-live="polite">
                    <span className="sr-only">Loading</span>
                    <div aria-hidden="true" className="w-10 h-10 border-4 border-foreground/20 border-t-foreground rounded-full animate-spin" />
                </div>
            </div>
        </Container>
    );
    if (error) return <Container>Error: {error.message}</Container>;
    if (!user) return <Container>Please log in.</Container>;

    return (
        <Container>
            <DashboardHeader user={user} profile={profile} onProfileUpdated={(p) => setProfile(p)} />

            {favourites.length ? <Gallery initialPhotos={favourites} disableLoadMore /> : null}
        </Container>
    );
}
