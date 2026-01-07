import type { ProfileDocument } from "@/lib/types";
import type { Profile } from "@/lib/types";

export function profileToDTO(doc: ProfileDocument): Profile {
    return {
        id: doc._id!.toString(),
        auth0Id: doc.auth0Id,
        email: doc.email,
        username: doc.username,
        avatarUrl: doc.avatarUrl,
        bio: doc.bio,
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt?.toISOString(),
    };
}
