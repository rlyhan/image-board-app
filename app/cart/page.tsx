'use client';

import { Container } from "@/components";
import Cart from "@/components/cart/Cart";
import { useCart } from "@/context/CartContext";
import { ITEM_PRICE } from "@/lib/config";

export default function CartPage() {
    const { cartItems, getCartTotal, updateQuantity, removeFromCart } = useCart();
    const formattedCartTotal = `Total: £${getCartTotal() * ITEM_PRICE}.00`

    return (
        <Container containerSize="medium">
            <h1 className="text-xl font-semibold mb-8">Your Cart</h1>
            {
                cartItems.length ?
                    (<div className="flex flex-col">
                        <Cart cartItems={cartItems} onClickUpdateQuantity={updateQuantity} onClickRemove={removeFromCart} />
                        <div className="mt-4 ml-auto p-6 bg-neutral-100 rounded-md">
                            <p className="text-2xl font-semibold">{formattedCartTotal}</p>
                        </div>
                    </div>) : (<p>Cart is empty</p>)}
        </Container>
    );

}
