"use client";

import { lazy, Suspense, useCallback, useState } from "react"
import { CartItem, PexelImage } from "@/lib/types"
import Image from "next/image"
import { ITEM_PRICE } from "@/lib/config"

const GalleryImageModal = lazy(() => import("@/components/gallery/GalleryImageModal"))

type CartProps = {
    cartItems: CartItem[];
    onClickUpdateQuantity: (imageId: number, quantity: number) => void;
    onClickRemove: (imageId: number) => void;
}

export default function Cart({ cartItems, onClickUpdateQuantity, onClickRemove }: CartProps) {
    const [modalImage, setModalImage] = useState<PexelImage | null>(null)
    const closeModal = useCallback(() => setModalImage(null), [])
    const getTitle = (image: PexelImage) => image.alt ?? "Photograph"

    return (
        <>
        <ul className="divide-y divide-gray-100" aria-label="Shopping cart items">
            {cartItems.map((cartItem) => (
                <li key={`cart-item-${cartItem.image.id}`} className="py-6 flex gap-5 sm:gap-6 items-start">
                    {/* Thumbnail */}
                    <button
                        type="button"
                        onClick={() => setModalImage(cartItem.image)}
                        aria-label={cartItem.image.alt ? `View ${cartItem.image.alt} larger` : "View image larger"}
                        className="w-24 sm:w-28 shrink-0 rounded-lg overflow-hidden bg-gray-100 aspect-[3/4] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
                    >
                        <Image
                            src={cartItem.image.src?.portrait || cartItem.image.src?.small || ""}
                            alt={cartItem.image.alt ?? ""}
                            width={112}
                            height={150}
                            className="w-full h-full object-cover"
                        />
                    </button>

                    {/* Info + controls */}
                    <div className="flex-1 min-w-0 flex flex-col gap-4 pt-0.5">
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
                                {getTitle(cartItem.image)}
                            </h2>
                            <p className="text-xs text-gray-600 mt-1">by {cartItem.image.photographer}</p>
                            <p className="text-xs text-gray-600 mt-0.5">Print · Digital download</p>
                        </div>

                        <div className="flex items-center justify-between flex-wrap gap-3">
                            {/* Quantity stepper */}
                            <div className="inline-flex items-center border border-gray-200 rounded-md overflow-hidden">
                                <button
                                    onClick={() => onClickUpdateQuantity(cartItem.image.id, cartItem.quantity - 1)}
                                    aria-label="Decrease quantity"
                                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-base leading-none cursor-pointer"
                                >
                                    −
                                </button>
                                <span
                                    className="w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-900 border-x border-gray-200"
                                    aria-live="polite"
                                    aria-atomic="true"
                                    aria-label={`Quantity: ${cartItem.quantity}`}
                                >
                                    {cartItem.quantity}
                                </span>
                                <button
                                    onClick={() => onClickUpdateQuantity(cartItem.image.id, cartItem.quantity + 1)}
                                    aria-label="Increase quantity"
                                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-base leading-none cursor-pointer"
                                >
                                    +
                                </button>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setModalImage(cartItem.image)}
                                    aria-label={`View image: ${getTitle(cartItem.image)}`}
                                    className="text-xs text-gray-500 hover:text-gray-700 hover:underline transition-colors cursor-pointer"
                                >
                                    View image
                                </button>
                                <button
                                    onClick={() => onClickRemove(cartItem.image.id)}
                                    aria-label={`Remove ${getTitle(cartItem.image)}`}
                                    className="text-xs text-gray-500 hover:text-red-500 hover:underline transition-colors cursor-pointer"
                                >
                                    Remove
                                </button>
                                <p className="text-base font-bold text-gray-900 tabular-nums">
                                    £{(cartItem.quantity * ITEM_PRICE).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
        {modalImage && (
            <Suspense fallback={
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 cursor-default"
                    onClick={closeModal}
                >
                    <div aria-hidden="true" className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
            }>
                <GalleryImageModal photo={modalImage} onClose={closeModal} />
            </Suspense>
        )}
        </>
    )
}