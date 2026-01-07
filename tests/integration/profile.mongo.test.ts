import { describe, it, expect, beforeEach, afterAll } from "vitest";
import type { Collection } from "mongodb";
import { setupInMemoryMongo } from "../test-utils/mongo";
import type { ProfileDocument } from "@/lib/types";
import { ensureProfile, getOrCreateProfile, updateProfile } from "@/lib/api/profile";

let cleanup: () => Promise<void>;
let profiles: Collection<ProfileDocument>;

const user = {
    sub: "google-oauth2|123",
    email: "a@b.com",
    nickname: "nick",
    name: "Name",
    picture: "https://pic",
};

describe("profile mongo integration", async () => {
    const setup = await setupInMemoryMongo();
    cleanup = setup.cleanup;
    profiles = setup.db.collection<ProfileDocument>("profiles");

    // add unique index like prod
    await profiles.createIndex({ auth0Id: 1 }, { unique: true });

    beforeEach(async () => {
        await profiles.deleteMany({});
    });

    afterAll(async () => {
        await cleanup();
    });

    it("ensureProfile inserts defaults if missing", async () => {
        await ensureProfile(profiles, user);
        const doc = await profiles.findOne({ auth0Id: user.sub });

        expect(doc).toBeTruthy();
        expect(doc?.auth0Id).toBe(user.sub);
        expect(doc?.email).toBe("a@b.com");
        expect(doc?.username).toBe("nick");
        expect(doc?.createdAt).toBeInstanceOf(Date);
        expect(doc?.updatedAt).toBeInstanceOf(Date);
    });

    it("ensureProfile is idempotent (no duplicates)", async () => {
        await ensureProfile(profiles, user);
        await ensureProfile(profiles, user);

        const count = await profiles.countDocuments({ auth0Id: user.sub });
        expect(count).toBe(1);
    });

    it("getOrCreateProfile returns a profile", async () => {
        const doc = await getOrCreateProfile(profiles, user);
        expect(doc?.auth0Id).toBe(user.sub);
    });

    it("updateProfile updates allowed fields and preserves createdAt", async () => {
        // first ensure baseline
        const initial = await getOrCreateProfile(profiles, user);
        expect(initial).toBeTruthy();

        const createdAtBefore = initial!.createdAt;

        const result = await updateProfile(profiles, user, { username: "newname", bio: "new bio" });
        expect("data" in result).toBe(true);
        if (!("data" in result)) throw new Error("Expected data result");

        expect(result?.data?.username).toBe("newname");
        expect(result?.data?.bio).toBe("new bio");
        expect(result?.data?.createdAt.getTime()).toBe(createdAtBefore.getTime());
        expect(result?.data?.updatedAt?.getTime()).toBeGreaterThanOrEqual(createdAtBefore.getTime());
    });

    it("updateProfile rejects empty patch", async () => {
        const result = await updateProfile(profiles, user, {});
        expect("error" in result).toBe(true);
        if (!("error" in result)) throw new Error("Expected error result");
        expect(result.status).toBe(400);
    });
});
