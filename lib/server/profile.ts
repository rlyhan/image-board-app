import "server-only";

import type { Collection } from "mongodb";
import clientPromise from "@/lib/mongodb";
import type { ProfileDocument, ProfilePatchBody, FindOneAndUpdateResult } from "@/lib/types";

type SessionUser = {
    sub: string;
    email?: string;
    nickname?: string;
    name?: string;
    picture?: string;
};

export async function getProfilesCollection() {
    const client = await clientPromise;
    return client.db("imageboard").collection<ProfileDocument>("profiles");
}

export function makeProfileDefaults(user: SessionUser, now: Date): Omit<ProfileDocument, "_id"> {
    return {
        auth0Id: user.sub,
        email: user.email ?? "",
        username: user.nickname ?? user.name ?? "",
        avatarUrl: user.picture ?? "",
        bio: "",
        createdAt: now,
        updatedAt: now,
    };
}

export function buildProfilePatchSet(body: ProfilePatchBody, now: Date) {
    const $set: Record<string, unknown> = { updatedAt: now };

    if (typeof body.username === "string") $set.username = body.username;
    if (typeof body.avatarUrl === "string") $set.avatarUrl = body.avatarUrl;
    if (typeof body.bio === "string") $set.bio = body.bio;

    return $set;
}

/** Create-if-missing (no read) */
export async function ensureProfile(profiles: Collection<ProfileDocument>, user: SessionUser) {
    const now = new Date();
    await profiles.updateOne(
        { auth0Id: user.sub },
        { $setOnInsert: makeProfileDefaults(user, now) },
        { upsert: true }
    );
}

/** GET use-case (2 calls: ensure + read) */
export async function getOrCreateProfile(profiles: Collection<ProfileDocument>, user: SessionUser) {
    await ensureProfile(profiles, user);
    return profiles.findOne({ auth0Id: user.sub });
}

/** PATCH use-case (2 calls: ensure + update+return) */
export async function updateProfile(
    profiles: Collection<ProfileDocument>,
    user: SessionUser,
    body: ProfilePatchBody
) {
    const now = new Date();
    const $set = buildProfilePatchSet(body, now);

    // only updatedAt means nothing else was provided
    if (Object.keys($set).length === 1) {
        return { error: "No updatable fields provided", status: 400 as const };
    }

    await ensureProfile(profiles, user);

    const result = await profiles.findOneAndUpdate(
        { auth0Id: user.sub },
        { $set },
        { returnDocument: "after" }
    );

    const raw = result as FindOneAndUpdateResult<ProfileDocument>;
    const updated = raw && "value" in raw ? raw.value : raw;
    if (!updated) {
        return { error: "Failed to update profile", status: 500 as const };
    }

    return { data: updated, status: 200 as const };
}