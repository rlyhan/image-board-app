import { NextRequest, NextResponse } from "next/server";
import { PaymentFormData } from "@/lib/types";
import { validatePayment, generatePaymentToken } from "@/lib/payment";

export async function POST(req: NextRequest) {
    try {
        const body: PaymentFormData = await req.json();
        const error = validatePayment(body);
        if (error) {
            return NextResponse.json({ error }, { status: 400 });
        }
        return NextResponse.json({ token: generatePaymentToken() });
    } catch {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}
