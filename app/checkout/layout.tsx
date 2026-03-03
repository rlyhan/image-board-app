import { OrderProvider } from "@/context/OrderContext";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
    return (
        <OrderProvider>
            {children}
        </OrderProvider>
    );
}