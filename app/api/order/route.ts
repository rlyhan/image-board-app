import { NextRequest, NextResponse } from "next/server";
import { CheckoutFormData, CartItem, OrderDocument } from "@/lib/types";
import clientPromise from "@/lib/mongodb";
import { auth0 } from "@/lib/auth0";

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
        const { customerDetails, paymentToken, cartItems }: {
            customerDetails: CheckoutFormData;
            paymentToken: string;
            cartItems: CartItem[];
        } = await req.json();

        if (!cartItems || cartItems.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }
        if (!customerDetails) {
            return NextResponse.json({ error: "Missing customer details" }, { status: 400 });
        }
        if (!paymentToken || typeof paymentToken !== "string") {
            return NextResponse.json({ error: "Missing payment token" }, { status: 400 });
        }

        // PRODUCTION: verify the payment with your gateway here, before writing to the DB.
        // With Stripe this would be:
        //   const intent = await stripe.paymentIntents.retrieve(paymentToken);
        //   if (intent.status !== "succeeded") return 402;
        // The client sends the PaymentIntent ID (from stripe.confirmPayment) instead of a
        // self-generated token, so the server can independently confirm Stripe processed the charge.

        const orders = await getOrdersCollection();
        const result = await orders.insertOne({
            customerDetails,
            cartItems,
            paymentToken,
            createdAt: new Date(),
        });

        return NextResponse.json({ success: true, orderId: result.insertedId.toString() });
    } catch (err: unknown) {
        console.error("POST orders error:", err);
        return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
    }
}
