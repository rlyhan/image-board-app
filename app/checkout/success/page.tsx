import { Container } from "@/components";

type SuccessPageProps = {
    searchParams: Promise<{ orderId?: string }>;
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
    const { orderId } = await searchParams;

    return (
        <Container containerSize="lg">
            <h2 className="text-xl font-semibold mb-4">Your Order has been placed</h2>
            {orderId && (
                <p className="text-sm text-gray-500">Order ID: <span className="font-mono">{orderId}</span></p>
            )}
        </Container>
    );
}
