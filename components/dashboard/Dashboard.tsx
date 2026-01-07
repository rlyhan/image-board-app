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

    if (isLoading) return <Container>Loading...</Container>;
    if (error) return <Container>Error: {error.message}</Container>;
    if (!user) return <Container>Please log in.</Container>;

    return (
        <Container>
            <DashboardHeader user={user} profile={profile} />

            {favourites.length ? <Gallery initialPhotos={favourites} disableLoadMore /> : null}
        </Container>
    );
}
