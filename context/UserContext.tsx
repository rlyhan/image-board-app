"use client";

import { createContext, useContext } from "react";
import type { User } from "@auth0/nextjs-auth0/types";

const UserContext = createContext<User | undefined>(undefined);

export function UserProvider({ user, children }: { user?: User; children: React.ReactNode }) {
    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useCurrentUser() {
    return useContext(UserContext);
}
