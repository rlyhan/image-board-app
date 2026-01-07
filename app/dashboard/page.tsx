import { Dashboard } from "@/components";
import { auth0 } from "@/lib/auth0";
import { getOrCreateProfile, getProfilesCollection } from "@/lib/server/profile";
import { profileToDTO } from "@/lib/server/profile.mapper";
import { getFavourites } from "@/lib/server/favourites";

export default async function DashboardPage() {
    const session = await auth0.getSession();
    if (!session?.user?.sub) return null;

    const profiles = await getProfilesCollection();
    const profileDoc = await getOrCreateProfile(profiles, session.user);
    const profile = profileDoc ? profileToDTO(profileDoc) : null;

    const favourites = await getFavourites(session.user.sub);

    return (
        <Dashboard
            initialProfile={profile}
            initialFavourites={favourites}
        />
    );

}
