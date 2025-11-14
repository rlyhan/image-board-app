"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { Container, Gallery } from "@/components";

export default function DashboardPage() {
    const { user, error, isLoading } = useUser();

    if (isLoading) {
        return (
            <Container flex>
                <p className="text-gray-500">Loading your profile...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container flex>
                <p className="text-red-500">Error: {error.message}</p>
            </Container>
        );
    }

    if (!user) {
        return (
            <Container flex>
                <p className="text-gray-600">No user information available.</p>
            </Container>
        );
    }

    return (
        <Container flex>
            <div>
                {user.picture && (
                    <img
                        src={user.picture}
                        alt={user.name || "User profile"}
                        className="w-24 h-24 rounded-full border border-gray-300 dark:border-gray-700 mb-4"
                    />
                )}
                <h2 className="text-2xl font-semibold mb-1">{user.name}</h2>
                <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
            </div>
        </Container>
    );
}
