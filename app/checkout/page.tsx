'use client';

import { useRouter } from 'next/navigation';
import { Container } from "@/components";
import CheckoutForm from "@/components/forms/CheckoutForm";

export default function CheckoutPage() {
    const router = useRouter();
    const handleSuccess = () => router.push('/checkout/payment');

    return (
        <Container containerSize="lg">
            <h2 className="text-xl font-semibold mb-8">Checkout</h2>
            <CheckoutForm onSuccess={handleSuccess} />
        </Container>
    );

}
