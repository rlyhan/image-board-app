'use client';

import { useRouter } from 'next/navigation';
import { Container } from "@/components";
import PaymentForm from "@/components/forms/PaymentForm";

export default function PaymentPage() {
    const router = useRouter();
    const handleSuccess = (orderId: string) => router.push(`/checkout/success?orderId=${orderId}`);

    return (
        <Container containerSize="lg">
            <h2 className="text-xl font-semibold mb-8">Checkout</h2>
            <PaymentForm onSuccess={handleSuccess} />
        </Container>

    );

}
