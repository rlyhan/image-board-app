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

            {favourites.length ? <Gallery initialPhotos={favourites} disableLoadMore /> : null}
        </Container>
    );
}
