
import { CartItem } from "@/lib/types"
import Image from "next/image"
import { Button } from "../common"

type CartProps = {
    cartItems: CartItem[];
    onClickUpdateQuantity: (imageId: number, quantity: number) => void;
    onClickRemove: (imageId: number) => void;
}

export default function Cart({ cartItems, onClickUpdateQuantity, onClickRemove }: CartProps) {
    return (
        <table className="text-left border-separate border-spacing-2">
            <caption className="sr-only">Shopping Cart</caption>
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Quantity</th>
                </tr>
            </thead>
            <tbody>
                {cartItems.map((cartItem, index) =>
                    <tr key={`cart-item-${cartItem.image.id}`}>
                        <td>
                            <div className="max-h-[200px] overflow-hidden">
                                <Image src={cartItem.image.src?.portrait || cartItem.image.src?.small || ""} alt={cartItem.image.alt ?? ""} width={200} height={150} />
                            </div>
                        </td>
                        <td>
                            <h3>{cartItem.image.alt ?? `Cart Item ${index + 1}`}</h3>
                            <h4>By {cartItem.image.photographer}</h4>
                        </td>
                        <td>£10.00</td>
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