'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from "@/components";
import CheckoutForm from "@/components/forms/CheckoutForm";
import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
    const router = useRouter();
    const { cartItems, isHydrated } = useCart();

    useEffect(() => {
        if (isHydrated && cartItems.length === 0) router.replace('/cart');
    }, [isHydrated, cartItems.length, router]);

    if (!isHydrated || cartItems.length === 0) return null;

    const handleSuccess = () => router.push('/checkout/payment');

    return (
        <Container containerSize="lg">
            <h2 className="text-xl font-semibold mb-8">Checkout</h2>
            <CheckoutForm onSuccess={handleSuccess} />
        </Container>
    );

}
