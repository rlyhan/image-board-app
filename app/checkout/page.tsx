'use client';

import { Container } from "@/components";
import CheckoutForm from "@/components/forms/CheckoutForm";
import { useCart } from "@/context/CartContext";
import { ITEM_PRICE } from "@/lib/config";

export default function CheckoutPage() {
    const { cartItems, getCartTotal, updateQuantity, removeFromCart } = useCart();
    const formattedCartTotal = `Total: £${getCartTotal() * ITEM_PRICE}.00`

    return (
        <Container containerSize="lg">
            <h2 className="text-xl font-semibold mb-8">Checkout</h2>
            <CheckoutForm />
        </Container>
    );

}
