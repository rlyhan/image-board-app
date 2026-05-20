import { NextRequest, NextResponse } from "next/server";
import { OrderDocument } from "@/lib/types";
import { OrderRequestSchema } from "@/lib/schemas";
import clientPromise from "@/lib/mongodb";
import { auth0 } from "@/lib/auth0";
import { ITEM_PRICE } from "@/lib/config";

export const runtime = "nodejs";

async function getOrdersCollection() {
    const client = await clientPromise;
    const db = client.db("imageboard");
    return db.collection<OrderDocument>("orders");
}

export async function POST(req: NextRequest) {
    const session = await auth0.getSession(req);
    if (!session?.user?.sub) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const parsed = OrderRequestSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid request", details: parsed.error.issues },
                { status: 400 }
            );
        }

        const { customerDetails, paymentToken, cartItems } = parsed.data;

        // Server-authoritative total — client-supplied prices are never trusted.
        const orderTotal = cartItems.reduce((sum, item) => sum + ITEM_PRICE * item.quantity, 0);

        // PRODUCTION: verify the payment with your gateway here, before writing to the DB.
        // With Stripe this would be:
        //   const intent = await stripe.paymentIntents.retrieve(paymentToken);
        //   if (intent.status !== "succeeded" || intent.amount !== orderTotal * 100) return 402;
        // The client sends the PaymentIntent ID (from stripe.confirmPayment) instead of a
        // self-generated token, so the server can independently confirm Stripe processed the charge.

        const orders = await getOrdersCollection();
        const result = await orders.insertOne({
            customerDetails,
            cartItems,
            paymentToken,
            orderTotal,
            createdAt: new Date(),
        });

        return NextResponse.json({ success: true, orderId: result.insertedId.toString() });
    } catch (err: unknown) {
        console.error("POST orders error:", err);
        return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
    }
}
