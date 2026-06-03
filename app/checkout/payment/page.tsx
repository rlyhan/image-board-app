'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from "@/components";
import { useOrder } from '@/context/OrderContext';
import { useCartStore } from '@/context/CartContext';
import PaymentForm from "@/components/forms/PaymentForm";

export default function PaymentPage() {
    const { orderState } = useOrder();
    const cartItems = useCartStore((s) => s.items);
    const isHydrated = useCartStore((s) => s.isHydrated);
    const router = useRouter();

    useEffect(() => {
        if (orderState.status === 'success') return;
        if (isHydrated && cartItems.length === 0) router.replace('/cart');
        else if (isHydrated && !orderState.customerDetails) router.replace('/checkout');
    }, [isHydrated, cartItems.length, orderState.customerDetails, orderState.status, router]);

    if (orderState.status === 'success') return null;
    if (!isHydrated || cartItems.length === 0 || !orderState.customerDetails) return null;

    const handleSuccess = (orderId: string) => router.replace(`/checkout/success?orderId=${orderId}`);

    return (
        <Container containerSize="lg">
            <h2 className="text-xl font-semibold mb-8">Checkout</h2>
            <PaymentForm onSuccess={handleSuccess} />
        </Container>

    );

}
