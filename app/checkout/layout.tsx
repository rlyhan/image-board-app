import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import { OrderProvider } from "@/context/OrderContext";

export default async function CheckoutLayout({ children }: { children: React.ReactNode }) {
    const session = await auth0.getSession();
    if (!session?.user?.sub) {
        redirect("/auth/login?returnTo=/checkout");
    }

    return (
        <OrderProvider>
            {children}
        </OrderProvider>
    );
}