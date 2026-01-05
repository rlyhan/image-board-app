import { describe, it, expect } from "vitest";
import { makeProfileDefaults, buildProfilePatchSet } from "@/lib/api/profile";

describe("profile builders", () => {
    it("makeProfileDefaults uses fallbacks and sets timestamps", () => {
        const now = new Date("2026-01-04T12:00:00Z");

        const user = {
            sub: "google-oauth2|123",
            email: "a@b.com",
            nickname: "nick",
            name: "Name",
            picture: "https://pic",
        };

        const defaults = makeProfileDefaults(user, now);

        expect(defaults.auth0Id).toBe("google-oauth2|123");
        expect(defaults.email).toBe("a@b.com");
        expect(defaults.username).toBe("nick"); // prefers nickname
        expect(defaults.avatarUrl).toBe("https://pic");
        expect(defaults.bio).toBe("");
        expect(defaults.createdAt).toEqual(now);
        expect(defaults.updatedAt).toEqual(now);
    });

    it("buildProfilePatchSet includes only valid string fields + updatedAt", () => {
        const now = new Date("2026-01-04T12:00:00Z");

        const body = {
            username: "newname",
            avatarUrl: "https://new",
            bio: "hello",
            createdAt: "should be ignored",
            username2: "ignored",
            bio2: 123,
        };

        const $set = buildProfilePatchSet(body, now);

        expect($set).toEqual({
            updatedAt: now,
            username: "newname",
            avatarUrl: "https://new",
            bio: "hello",
        });
    });
});
