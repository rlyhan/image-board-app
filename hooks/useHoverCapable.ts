import { useSyncExternalStore } from "react";

const mql = typeof window !== "undefined" ? window.matchMedia("(hover: hover)") : null;
const subscribe = (cb: () => void) => {
    mql?.addEventListener("change", cb);
    return () => mql?.removeEventListener("change", cb);
};

export function useHoverCapable(): boolean {
    return useSyncExternalStore(
        subscribe,
        () => mql?.matches ?? false,
        () => false,
    );
}
