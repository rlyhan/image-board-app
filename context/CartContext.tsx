'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { PexelImage, CartItem } from '@/lib/types';

type CartContextType = {
    cartItems: CartItem[];
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

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'shopping-cart';

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
    switch (action.type) {
        case 'ADD_TO_CART': {
            const existing = state.find((item) => item.image.id === action.payload.id);
            if (existing) {
                return state.map((item) =>
                    item.image.id === action.payload.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...state, { image: action.payload, quantity: 1 }];
        }

        case 'REMOVE_FROM_CART':
            return state.filter((item) => item.image.id !== action.payload);

        case 'UPDATE_QUANTITY': {
            const { imageId, quantity } = action.payload;
            if (quantity <= 0) {
                return state.filter((item) => item.image.id !== imageId);
            }
            return state.map((item) =>
                item.image.id === imageId ? { ...item, quantity } : item
            );
        }

        case 'CLEAR_CART':
            return [];

        case 'HYDRATE_CART':
            return action.payload;

        default:
            return state;
    }
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, dispatch] = useReducer(cartReducer, []);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                dispatch({ type: 'HYDRATE_CART', payload: parsed });
            } catch (error) {
                console.error('Failed to parse cart from localStorage:', error);
            }
        }
    }, []);

    // Save to localStorage whenever cart changes
    useEffect(() => {
        if (cartItems.length > 0 || localStorage.getItem(CART_STORAGE_KEY)) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        }
    }, [cartItems]);

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