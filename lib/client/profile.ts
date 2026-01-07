import type { ProfileDocument, ProfilePatchBody } from "@/lib/types";

export async function fetchProfile(): Promise<ProfileDocument> {
    const res = await fetch("/api/profile", { method: "GET", credentials: "include" });

    if (!res.ok) {
        let message = "Failed to fetch profile";
        try {
            const error = await res.json();
            message = error.error || message;
        } catch { }
        throw new Error(message);
    }

    return res.json();
}

export async function updateProfile({ username, avatarUrl, bio }: ProfilePatchBody): Promise<ProfileDocument> {
    const payload: Record<string, string> = {};
    if (username?.trim()) payload.username = username.trim();
    if (avatarUrl?.trim()) payload.avatarUrl = avatarUrl.trim();
    if (bio) payload.bio = bio;

    const res = await fetch("/api/profile", {
        method: "PATCH", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const text = await res.text();
        let message = `Failed to update profile (${res.status})`;
        try {
            const json = JSON.parse(text);
            message = json?.error ?? message;
        } catch {
            if (text) message = text;
        }
        throw new Error(message);
    }

    return res.json();
}