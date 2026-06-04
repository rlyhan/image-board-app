"use client";

import { useState } from "react";
import Image from "next/image";
import { User } from "@auth0/nextjs-auth0/types";
import type { Profile } from "@/lib/types";
import DashboardProfileForm from "./DashboardProfileForm";

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
        <div className="mb-8">
            <div className="flex items-center gap-4 p-4 sm:p-5 rounded-xl border border-gray-200 bg-gray-50/70 shadow-sm">
                {displayPicture ? (
                    <Image
                        src={displayPicture}
                        alt={displayName}
                        height={64}
                        width={64}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-white shadow-sm shrink-0 object-cover"
                    />
                ) : (
                    <div
                        role="img"
                        aria-label={displayName}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-white shadow-sm shrink-0 bg-gray-200 flex items-center justify-center text-xl font-semibold text-gray-500 select-none"
                    >
                        {displayName.charAt(0).toUpperCase()}
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <h2 className="text-base font-semibold truncate">{displayName}</h2>
                    {bio && <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{bio}</p>}
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                    <button
                        className="text-sm px-3 py-1.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition-colors font-medium cursor-pointer"
                        aria-label="Edit profile"
                        onClick={() => setIsEditing(true)}
                    >
                        Edit Profile
                    </button>
                    {/* Plain anchor: /auth/logout redirects to Auth0, so a full
                        browser navigation is required (a Next.js <Link> would
                        fetch the RSC payload and hit a cross-origin CORS block). */}
                    <a
                        href="/auth/logout"
                        className="text-sm px-3 py-1.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition-colors font-medium text-center md:hidden"
                    >
                        Log Out
                    </a>
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