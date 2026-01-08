import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import type { ProfilePatchBody } from "@/lib/types";
import { getOrCreateProfile, updateProfile } from "@/lib/server/profile";
import { getProfilesCollection } from "@/lib/server/db";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
    const session = await auth0.getSession(req);
    if (!session?.user?.sub) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profiles = await getProfilesCollection();
    const profile = await getOrCreateProfile(profiles, session.user);

    if (!profile) {
        return NextResponse.json({ error: "Failed to create or fetch profile" }, { status: 500 });
    }

    return NextResponse.json(profile, { status: 200 });
}

export async function PATCH(req: NextRequest) {
    const session = await auth0.getSession(req);
    if (!session?.user?.sub) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: ProfilePatchBody;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const profiles = await getProfilesCollection();
    const result = await updateProfile(profiles, session.user, body);

    if ("error" in result) {
        return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data, { status: result.status });
}
