"use client";

import { useState } from "react";
import { Container, Gallery } from "@/components";
import type { PexelImage, Profile } from "@/lib/types";
import { useCurrentUser } from "@/context/UserContext";
import DashboardHeader from "./DashboardHeader";

type DashboardProps = {
    initialProfile: Profile | null;
    initialFavourites: PexelImage[];
};

export default function Dashboard({
    initialProfile,
    initialFavourites,
}: DashboardProps) {
    const user = useCurrentUser();
    const [profile, setProfile] = useState<Profile | null>(initialProfile);
    const [favourites] = useState<PexelImage[]>(initialFavourites);

    if (!user) return <Container>Please log in.</Container>;

    return (
        <Container>
            <DashboardHeader user={user} profile={profile} onProfileUpdated={(p) => setProfile(p)} />

            {favourites.length ? (
                <div>
                    <div className="flex items-baseline gap-2 mb-4">
                        <h3 className="text-sm font-semibold tracking-wide uppercase text-gray-500">Favourites</h3>
                        <span className="text-sm text-gray-500" aria-label={`${favourites.length} favourites`}>{favourites.length}</span>
                    </div>
                    <Gallery initialPhotos={favourites} disableLoadMore />
                </div>
            ) : (
                <p className="text-sm text-gray-400 mt-2">No favourites yet.</p>
            )}
        </Container>
    );
}
