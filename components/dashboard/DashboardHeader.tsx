"use client";

import Image from "next/image";
import { User } from "@auth0/nextjs-auth0/types";

type DashboardHeaderProps = {
    user: User;
};

export default function DashboardHeader({ user }: DashboardHeaderProps) {
    return (
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
    )
}