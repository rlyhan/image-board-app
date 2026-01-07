"use client";

import Image from "next/image";
import { User } from "@auth0/nextjs-auth0/types";
import type { Profile } from "@/lib/types";

type DashboardHeaderProps = {
    user: User;
    profile: Profile | null;
};

function DashboardHeader({ user, profile }: DashboardHeaderProps) {
    const displayName = profile?.username?.trim() || user.name || "User";
    const displayPicture = profile?.avatarUrl?.trim() || user.picture || null;
    const bio = profile?.bio?.trim() || null;

    return (
        <div className="mb-4">
            {displayPicture && (
                <Image
                    src={displayPicture}
                    alt={displayName}
                    height={48}
                    width={48}
                    className="w-24 h-24 rounded-full border border-gray-300 dark:border-gray-700 mb-4"
                />
            )}
            <h2 className="text-2xl font-semibold mb-1">{displayName}</h2>
            <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
            {bio && <p className="mt-2 text-gray-700 dark:text-gray-400">{bio}</p>}
        </div>
    );
}

export default DashboardHeader;