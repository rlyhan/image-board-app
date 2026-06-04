"use server";

import { auth0 } from "@/lib/auth0";
import { getProfilesCollection } from "@/lib/server/db";
import { updateProfile as updateProfileDoc } from "@/lib/server/profile";
import { profileToDTO } from "@/lib/server/profile.mapper";
import type { Profile, ProfilePatchBody } from "@/lib/types";

export type UpdateProfileResult =
    | { success: true; profile: Profile }
    | { success: false; error: string };

export async function updateProfile(body: ProfilePatchBody): Promise<UpdateProfileResult> {
    const session = await auth0.getSession();
    if (!session?.user?.sub) {
        return { success: false, error: "Unauthorized" };
    }

    const profiles = await getProfilesCollection();
    const result = await updateProfileDoc(profiles, session.user, body);

    if ("error" in result) {
        return { success: false, error: result.error ?? "Failed to update profile" };
    }

    return { success: true, profile: profileToDTO(result.data) };
}
