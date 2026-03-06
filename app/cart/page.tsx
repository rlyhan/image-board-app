'use client';

import { ButtonLink, Container } from "@/components";
import Cart from "@/components/cart/Cart";
import { useCart } from "@/context/CartContext";
import { ITEM_PRICE } from "@/lib/config";

export default function CartPage() {
    const { cartItems, getCartTotal, updateQuantity, removeFromCart } = useCart();
    const formattedCartTotal = `Total: £${getCartTotal() * ITEM_PRICE}.00`

    return (
        <Container>
            <h2 className="text-xl font-semibold mb-8">Your Cart</h2>
            {
                cartItems.length ?
                    (<div className="flex flex-col">
                        <Cart cartItems={cartItems} onClickUpdateQuantity={updateQuantity} onClickRemove={removeFromCart} />
                        <div className="flex gap-2 ml-auto mt-4">
                            <div className="ml-auto p-6 bg-neutral-100 rounded-md">
                                <p className="text-2xl font-semibold">{formattedCartTotal}</p>
                            </div>
                            <ButtonLink href="/checkout" label="Checkout" className="p-6 bg-neutral-100 hover:bg-gray-800 hover:text-neutral-100 rounded-md text-2xl font-semibold" />
                        </div>
                    </div>) : (<p>Cart is empty</p>)}
        </Container>
    );

}
