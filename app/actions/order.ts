"use server";

import clientPromise from "@/lib/mongodb";
import { auth0 } from "@/lib/auth0";
import { ITEM_PRICE } from "@/lib/config";
import { OrderRequestSchema } from "@/lib/schemas";
import type { CartItem, CheckoutFormData } from "@/lib/types";

type CreateOrderInput = {
    customerDetails: CheckoutFormData;
    paymentToken: string;
    cartItems: CartItem[];
};

export type CreateOrderResult =
    | { success: true; orderId: string }
    | { success: false; error: string };

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
    const session = await auth0.getSession();
    if (!session?.user?.sub) {
        return { success: false, error: "Unauthorized" };
    }

    const parsed = OrderRequestSchema.safeParse(input);
    if (!parsed.success) {
        return { success: false, error: "Invalid request" };
    }

    const { customerDetails, paymentToken, cartItems } = parsed.data;

    // Server-authoritative total — client-supplied prices are never trusted.
    const orderTotal = cartItems.reduce((sum, item) => sum + ITEM_PRICE * item.quantity, 0);

    // PRODUCTION: verify the payment with your gateway here, before writing to the DB.
    // With Stripe this would be:
    //   const intent = await stripe.paymentIntents.retrieve(paymentToken);
    //   if (intent.status !== "succeeded" || intent.amount !== orderTotal * 100) throw new Error("Payment verification failed");

    try {
        const client = await clientPromise;
        const result = await client.db("imageboard").collection("orders").insertOne({
            customerDetails,
            cartItems,
            paymentToken,
            orderTotal,
            createdAt: new Date(),
        });

        return { success: true, orderId: result.insertedId.toString() };
    } catch (err: unknown) {
        console.error("createOrder error:", err);
        return { success: false, error: "Failed to save order" };
    }
}
