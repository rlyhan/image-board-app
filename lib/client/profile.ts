import type { ProfileDocument } from "@/lib/types";

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
