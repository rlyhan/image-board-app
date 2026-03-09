import { NextRequest, NextResponse } from "next/server";
import { CheckoutFormData, PaymentFormData, CartItem, OrderDocument } from "@/lib/types";
import clientPromise from "@/lib/mongodb";
import { validatePayment, generatePaymentToken } from "@/lib/payment";

export const runtime = "nodejs";

// Helper to get DB collection
async function getOrdersCollection() {
    const client = await clientPromise;
    const db = client.db("imageboard");
    return db.collection<OrderDocument>("orders");
}

export async function POST(req: NextRequest) {
    try {
        const { customerDetails, paymentDetails, cartItems }: { customerDetails: CheckoutFormData; paymentDetails: PaymentFormData; cartItems: CartItem[] } = await req.json();
        if (!cartItems || cartItems.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }
        if (!customerDetails || !paymentDetails) {
            return NextResponse.json({ error: "Missing customer or payment details" }, { status: 400 });
        }

        const paymentError = validatePayment(paymentDetails);
        if (paymentError) {
            return NextResponse.json({ error: paymentError }, { status: 400 });
        }
        const paymentToken = generatePaymentToken();

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
