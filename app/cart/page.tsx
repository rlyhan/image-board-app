'use client';

import { Container } from "@/components";
import Cart from "@/components/cart/Cart";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
    const { cartItems, getCartTotal, updateQuantity, removeFromCart } = useCart();
    const cartTotal = getCartTotal()
    console.log("cartItems:", cartItems)

    return (
        <Container>
            <h1>Your Cart</h1>
            <div className="max-w-2xl mx-auto">
                <Cart cartItems={cartItems} onClickUpdateQuantity={updateQuantity} onClickRemove={removeFromCart} />
                <p className="text-3xl text-right">Total: {`£${cartTotal * 10}.00`}</p>
            </div>
        </Container>
    );

}
