"use client";

import { useState } from "react";
import Image from "next/image";
import { User } from "@auth0/nextjs-auth0/types";
import type { Profile } from "@/lib/types";
import DashboardProfileForm from "./DashboardProfileForm";
import { ButtonLink } from "../common";

type DashboardHeaderProps = {
    user: User;
    profile: Profile | null;
    onProfileUpdated: (profile: Profile) => void;
};

function DashboardHeader({ user, profile, onProfileUpdated }: DashboardHeaderProps) {
    const [isEditing, setIsEditing] = useState(false);

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
                    className="w-24 h-24 rounded-full border border-gray-300 mb-4"
                />
            )}

            <h2 className="text-2xl font-semibold mb-1">{displayName}</h2>

            <div className="flex flex-col md:flex-row justify-between gap-4">
                {bio && <p className="mt-2 text-gray-700">{bio}</p>}

                <div className="flex gap-2">
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
                        aria-label="Edit profile"
                        onClick={() => setIsEditing(true)}
                    >
                        Edit Profile
                    </button>

                    <div className="flex md:hidden">
                        <ButtonLink href="/auth/logout" label="Log Out" />
                    </div>
                </div>
            </div>

            <DashboardProfileForm
                open={isEditing}
                initial={{
                    username: profile?.username ?? "",
                    avatarUrl: profile?.avatarUrl ?? user.picture ?? "",
                    bio: profile?.bio ?? "",
                }}
                onClose={() => setIsEditing(false)}
                onSaved={(updated) => {
                    onProfileUpdated(updated);
                    setIsEditing(false);
                }}
            />
        </div>
    );
}

export default DashboardHeader;