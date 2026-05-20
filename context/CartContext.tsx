'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { PexelImage, CartItem } from '@/lib/types';

type CartContextType = {
    cartItems: CartItem[];
    isHydrated: boolean;
    addToCart: (image: PexelImage) => void;
    removeFromCart: (imageId: number) => void;
    updateQuantity: (imageId: number, quantity: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getItemQuantity: (imageId: number) => number;
};

type CartAction =
    | { type: 'ADD_TO_CART'; payload: PexelImage }
    | { type: 'REMOVE_FROM_CART'; payload: number }
    | { type: 'UPDATE_QUANTITY'; payload: { imageId: number; quantity: number } }
    | { type: 'CLEAR_CART' }
    | { type: 'HYDRATE_CART'; payload: CartItem[] };

type CartState = {
    items: CartItem[];
    isHydrated: boolean;
};

const INITIAL_STATE: CartState = { items: [], isHydrated: false };

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'shopping-cart';

function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case 'ADD_TO_CART': {
            const existing = state.items.find((item) => item.image.id === action.payload.id);
            if (existing) {
                return {
                    ...state,
                    items: state.items.map((item) =>
                        item.image.id === action.payload.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                };
            }
            return { ...state, items: [...state.items, { image: action.payload, quantity: 1 }] };
        }

        case 'REMOVE_FROM_CART':
            return { ...state, items: state.items.filter((item) => item.image.id !== action.payload) };

        case 'UPDATE_QUANTITY': {
            const { imageId, quantity } = action.payload;
            if (quantity <= 0) {
                return { ...state, items: state.items.filter((item) => item.image.id !== imageId) };
            }
            return {
                ...state,
                items: state.items.map((item) =>
                    item.image.id === imageId ? { ...item, quantity } : item
                ),
            };
        }

        case 'CLEAR_CART':
            return { ...state, items: [] };

        case 'HYDRATE_CART':
            return { items: action.payload, isHydrated: true };

        default:
            return state;
    }
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [{ items: cartItems, isHydrated }, dispatch] = useReducer(cartReducer, INITIAL_STATE);

    // Load from localStorage on mount; dispatch also marks hydration complete.
    useEffect(() => {
        let parsed: CartItem[] = [];
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
            try {
                parsed = JSON.parse(stored);
            } catch (error) {
                console.error('Failed to parse cart from localStorage:', error);
            }
        }
        dispatch({ type: 'HYDRATE_CART', payload: parsed });
    }, []);

    // Skip until hydrated, otherwise the first commit overwrites localStorage
    // with the empty initial state before HYDRATE_CART has been applied.
    useEffect(() => {
        if (!isHydrated) return;
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }, [cartItems, isHydrated]);

    const addToCart = (image: PexelImage) => {
        dispatch({ type: 'ADD_TO_CART', payload: image });
    };

    const removeFromCart = (imageId: number) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: imageId });
    };

    const updateQuantity = (imageId: number, quantity: number) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { imageId, quantity } });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const getItemQuantity = (imageId: number) => {
        return cartItems.find((item) => item.image.id === imageId)?.quantity || 0;
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                isHydrated,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getCartTotal,
                getItemQuantity,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
}