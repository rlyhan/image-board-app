'use client';

import { useEffect, ReactNode } from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PexelImage, CartItem } from '@/lib/types';

type CartStore = {
    items: CartItem[];
    isHydrated: boolean;
    addToCart: (image: PexelImage) => void;
    removeFromCart: (imageId: number) => void;
    updateQuantity: (imageId: number, quantity: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getItemQuantity: (imageId: number) => number;
};

const CART_STORAGE_KEY = 'shopping-cart';

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isHydrated: false,

            addToCart: (image) =>
                set((state) => {
                    const existing = state.items.find((item) => item.image.id === image.id);
                    if (existing) {
                        return {
                            items: state.items.map((item) =>
                                item.image.id === image.id
                                    ? { ...item, quantity: item.quantity + 1 }
                                    : item
                            ),
                        };
                    }
                    return { items: [...state.items, { image, quantity: 1 }] };
                }),

            removeFromCart: (imageId) =>
                set((state) => ({
                    items: state.items.filter((item) => item.image.id !== imageId),
                })),

            updateQuantity: (imageId, quantity) =>
                set((state) => ({
                    items:
                        quantity <= 0
                            ? state.items.filter((item) => item.image.id !== imageId)
                            : state.items.map((item) =>
                                  item.image.id === imageId ? { ...item, quantity } : item
                              ),
                })),

            clearCart: () => set({ items: [] }),

            getCartTotal: () => get().items.reduce((total, item) => total + item.quantity, 0),

            getItemQuantity: (imageId) =>
                get().items.find((item) => item.image.id === imageId)?.quantity ?? 0,
        }),
        {
            name: CART_STORAGE_KEY,
            storage: createJSONStorage(() => localStorage),
            // Only the cart contents are persisted; isHydrated is runtime-only.
            partialize: (state) => ({ items: state.items }),
            // Defer reading localStorage until the client effect below runs, so server
            // and first client render both start from the empty initial state (no mismatch).
            skipHydration: true,
            onRehydrateStorage: () => () => {
                useCartStore.setState({ isHydrated: true });
            },
        }
    )
);

// Triggers client-side hydration from localStorage once, after mount.
export function CartProvider({ children }: { children: ReactNode }) {
    useEffect(() => {
        useCartStore.persist.rehydrate();
    }, []);

    return <>{children}</>;
}
