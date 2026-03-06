
import { CartItem, PexelImage } from "@/lib/types"
import Image from "next/image"
import { Button } from "../common"
import { ITEM_PRICE } from "@/lib/config"

type CartProps = {
    cartItems: CartItem[];
    onClickUpdateQuantity: (imageId: number, quantity: number) => void;
    onClickRemove: (imageId: number) => void;
}

export default function Cart({ cartItems, onClickUpdateQuantity }: CartProps) {
    const getProductDescription = (image: PexelImage) => `${image.alt ?? "Photograph"} by ${image.photographer}`

    return (
        <table className="text-left border-separate border-spacing-6 bg-neutral-100 rounded-md">
            <caption className="sr-only">Shopping Cart</caption>
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                </tr>
            </thead>
            <tbody>
                {cartItems.map((cartItem) =>
                    <tr key={`cart-item-${cartItem.image.id}`}>
                        <td className="w-full">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="max-h-[200px] overflow-hidden">
                                    <Image src={cartItem.image.src?.portrait || cartItem.image.src?.small || ""} alt={cartItem.image.alt ?? ""} width={200} height={150} />
                                </div>
                                <h3 className="text-sm max-w-[300px] mr-auto">{getProductDescription(cartItem.image)}</h3>
                            </div>
                        </td>
                        <td>{`£${ITEM_PRICE}.00`}</td>
                        <td>
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() => onClickUpdateQuantity(cartItem.image.id, cartItem.quantity - 1)}
                                    label="-"
                                    name="Decrease quantity"
                                    variant="quantity"
                                />
                                <span className="min-w-[2ch] text-center">{cartItem.quantity}</span>
                                <Button
                                    onClick={() => onClickUpdateQuantity(cartItem.image.id, cartItem.quantity + 1)}
                                    label="+"
                                    name="Increase quantity"
                                    variant="quantity"
                                />
                            </div>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    )
}