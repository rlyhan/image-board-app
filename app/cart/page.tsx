'use client';

import Link from "next/link";
import { Container } from "@/components";
import Cart from "@/components/cart/Cart";
import { useCartStore, selectCartTotal } from "@/context/cartStore";
import { ITEM_PRICE } from "@/lib/config";

export default function CartPage() {
    const cartItems = useCartStore((s) => s.items);
    const updateQuantity = useCartStore((s) => s.updateQuantity);
    const removeFromCart = useCartStore((s) => s.removeFromCart);
    const itemCount = useCartStore(selectCartTotal);
    const subtotal = itemCount * ITEM_PRICE;
    const itemLabel = `${itemCount} ${itemCount === 1 ? "item" : "items"}`;

    if (!cartItems.length) {
        return (
            <Container>
                <div className="py-24 flex flex-col items-center text-center gap-4">
                    <h1 className="text-2xl font-semibold text-gray-900">Your cart is empty</h1>
                    <p className="text-sm text-gray-400">Browse the gallery to find prints you love.</p>
                    <Link
                        href="/"
                        className="mt-4 inline-block bg-gray-900 text-white text-sm font-medium px-6 py-3 rounded-md hover:bg-gray-700 transition-colors"
                    >
                        Browse gallery
                    </Link>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <div className="py-6 md:py-10">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Your Cart</h1>
                <p className="text-sm text-gray-400 mb-8" aria-hidden="true">
                    {itemLabel}
                </p>

                <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
                    {/* Item list */}
                    <div className="flex-1 min-w-0">
                        <Cart
                            cartItems={cartItems}
                            onClickUpdateQuantity={updateQuantity}
                            onClickRemove={removeFromCart}
                        />
                        <Link
                            href="/"
                            className="inline-block mt-6 text-sm text-gray-400 hover:text-gray-700 transition-colors"
                        >
                            <span aria-hidden="true">← </span>Continue shopping
                        </Link>
                    </div>

                    {/* Order summary */}
                    <div className="w-full lg:w-[340px] shrink-0">
                        <div className="border border-gray-100 rounded-xl p-6 bg-gray-50 sticky top-6">
                            <h2 className="text-base font-semibold text-gray-900 mb-5">Order Summary</h2>

                            <div className="flex flex-col gap-3 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal ({itemLabel})</span>
                                    <span className="font-medium text-gray-900">£{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-gray-400">Calculated at checkout</span>
                                </div>
                            </div>

                            <div className="mt-5 pt-5 border-t border-gray-200 flex justify-between items-center">
                                <span className="text-base font-bold text-gray-900">Total</span>
                                <span className="text-xl font-bold text-gray-900">£{subtotal.toFixed(2)}</span>
                            </div>

                            <Link
                                href="/checkout"
                                className="mt-5 w-full flex items-center justify-center gap-2 bg-gray-900 text-white text-sm font-semibold py-3.5 rounded-md hover:bg-gray-700 active:bg-gray-800 transition-colors"
                            >
                                Proceed to checkout
                                <span aria-hidden="true">→</span>
                            </Link>

                            <p className="text-center text-xs text-gray-400 mt-3">Secure checkout · SSL encrypted</p>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}
