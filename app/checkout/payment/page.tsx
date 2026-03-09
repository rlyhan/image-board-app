'use client';

import { useRouter } from 'next/navigation';
import { Container } from "@/components";
import { useOrder } from '@/context/OrderContext';
import PaymentForm from "@/components/forms/PaymentForm";

export default function PaymentPage() {
    const { orderState } = useOrder();

    const router = useRouter();

    if (!orderState.customerDetails) {
        router.replace('/checkout');
        return null;
    }

    const handleSuccess = (orderId: string) => router.push(`/checkout/success?orderId=${orderId}`);

    return (
        <Container containerSize="lg">
            <h2 className="text-xl font-semibold mb-8">Checkout</h2>
            <PaymentForm onSuccess={handleSuccess} />
        </Container>

    );

}
