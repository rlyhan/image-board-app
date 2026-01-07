"use client";

import Image from "next/image";
import { useState } from "react";
import { Container, Gallery } from "@/components";
import type { PexelImage, ProfileDTO } from "@/lib/types";
import { useUser } from "@auth0/nextjs-auth0/client";

type DashboardProps = {
    initialProfile: ProfileDTO | null;
    initialFavourites: PexelImage[];
};

export default function Dashboard({
    initialProfile,
    initialFavourites,
}: DashboardProps) {
    const { user, isLoading, error } = useUser();
    const [profile, setProfile] = useState<ProfileDTO | null>(initialProfile);
    const [favourites] = useState<PexelImage[]>(initialFavourites);

    if (isLoading) return <Container>Loading...</Container>;
    if (error) return <Container>Error: {error.message}</Container>;
    if (!user) return <Container>Please log in.</Container>;

    return (
        <Container>
            <div className="mb-4">
                {user.picture && (
                    <Image
                        src={user.picture}
                        alt={user.name || "User profile"}
                        height={48}
                        width={48}
                        className="w-24 h-24 rounded-full border border-gray-300 dark:border-gray-700 mb-4"
                    />
                )}
                <h2 className="text-2xl font-semibold mb-1">{user.name}</h2>
                <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
            </div>

            {favourites.length ? <Gallery initialPhotos={favourites} disableLoadMore /> : null}
        </Container>
    );
}
