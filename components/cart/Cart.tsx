
import { CartItem, PexelImage } from "@/lib/types"
import Image from "next/image"
import { ITEM_PRICE } from "@/lib/config"

type CartProps = {
    cartItems: CartItem[];
    onClickUpdateQuantity: (imageId: number, quantity: number) => void;
    onClickRemove: (imageId: number) => void;
}

export default function Cart({ cartItems, onClickUpdateQuantity, onClickRemove }: CartProps) {
    const getTitle = (image: PexelImage) => image.alt ?? "Photograph"

    return (
        <ul className="divide-y divide-gray-100" aria-label="Shopping cart items">
            {cartItems.map((cartItem) => (
                <li key={`cart-item-${cartItem.image.id}`} className="py-6 flex gap-5 sm:gap-6 items-start">
                    {/* Thumbnail */}
                    <div className="w-24 sm:w-28 shrink-0 rounded-lg overflow-hidden bg-gray-100 aspect-[3/4]">
                        <Image
                            src={cartItem.image.src?.portrait || cartItem.image.src?.small || ""}
                            alt={cartItem.image.alt ?? ""}
                            width={112}
                            height={150}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Info + controls */}
                    <div className="flex-1 min-w-0 flex flex-col gap-4 pt-0.5">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
                                {getTitle(cartItem.image)}
                            </h3>
                            <p className="text-xs text-gray-400 mt-1">by {cartItem.image.photographer}</p>
                            <p className="text-xs text-gray-400 mt-0.5">Print · Digital download</p>
                        </div>

                        <div className="flex items-center justify-between flex-wrap gap-3">
                            {/* Quantity stepper */}
                            <div className="inline-flex items-center border border-gray-200 rounded-md overflow-hidden">
                                <button
                                    onClick={() => onClickUpdateQuantity(cartItem.image.id, cartItem.quantity - 1)}
                                    aria-label="Decrease quantity"
                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors text-base leading-none"
                                >
                                    −
                                </button>
                                <span className="w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-900 border-x border-gray-200">
                                    {cartItem.quantity}
                                </span>
                                <button
                                    onClick={() => onClickUpdateQuantity(cartItem.image.id, cartItem.quantity + 1)}
                                    aria-label="Increase quantity"
                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors text-base leading-none"
                                >
                                    +
                                </button>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => onClickRemove(cartItem.image.id)}
                                    className="text-xs text-gray-400 hover:text-red-500 transition-colors"
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
    )
}