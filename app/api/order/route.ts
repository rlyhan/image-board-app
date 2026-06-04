import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/app/actions/order";

export const runtime = "nodejs";

// Thin HTTP adapter over the createOrder server action.
// The app calls the action directly; this route exists as a test seam for
// Cypress e2e stubs, which cannot intercept RSC-formatted server action responses.
export async function POST(req: NextRequest) {
    const body = await req.json();
    const result = await createOrder(body);

    if (!result.success) {
        const status = result.error === "Unauthorized" ? 401 : 400;
        return NextResponse.json({ error: result.error }, { status });
    }

    return NextResponse.json(result);
}
