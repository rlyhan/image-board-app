import { describe, it, expect, vi, beforeAll, beforeEach, afterAll } from "vitest";
import type { Collection, MongoClient } from "mongodb";
import { NextRequest } from "next/server";
import { setupInMemoryMongo } from "../test-utils/mongo";
import { POST } from "@/app/api/order/route";
import { ITEM_PRICE } from "@/lib/config";
import type { OrderDocument } from "@/lib/types";

// vi.mock is hoisted before variable declarations, so the promise must be
// created inside vi.hoisted to be available in the mock factory.
const { clientPromise, resolveClient } = vi.hoisted(() => {
    let resolveClient!: (client: MongoClient) => void;
    const clientPromise = new Promise<MongoClient>((r) => (resolveClient = r));
    return { clientPromise, resolveClient };
});
vi.mock("@/lib/mongodb", () => ({ default: clientPromise }));

const { mockGetSession } = vi.hoisted(() => ({ mockGetSession: vi.fn() }));
vi.mock("@/lib/auth0", () => ({ auth0: { getSession: mockGetSession } }));

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const validCustomerDetails = {
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@example.com",
    addressLine1: "1 Main St",
    addressLine2: "",
    city: "London",
    postcode: "SW1A 1AA",
};

const validImage = { id: 1234, src: {}, alt: "A photo" };
const validCartItem = { image: validImage, quantity: 2 };

function makeRequest(body: unknown) {
    return new NextRequest("http://localhost/api/order", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
    });
}

const validBody = {
    customerDetails: validCustomerDetails,
    paymentToken: "mock_tok_abc",
    cartItems: [validCartItem],
};

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------

let cleanup: () => Promise<void>;
let orders: Collection<OrderDocument>;

beforeAll(async () => {
    const setup = await setupInMemoryMongo();
    cleanup = setup.cleanup;
    resolveClient(setup.client);
    // Route writes to "imageboard", not the test default "imageboard_test"
    orders = setup.client.db("imageboard").collection<OrderDocument>("orders");
});

afterAll(async () => {
    await cleanup();
});

beforeEach(async () => {
    mockGetSession.mockReset();
    await orders.deleteMany({});
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("POST /api/order — authentication", () => {
    it("returns 401 when there is no session", async () => {
        mockGetSession.mockResolvedValue(null);
        const res = await POST(makeRequest(validBody));
        expect(res.status).toBe(401);
    });

    it("returns 401 when session has no sub", async () => {
        mockGetSession.mockResolvedValue({ user: {} });
        const res = await POST(makeRequest(validBody));
        expect(res.status).toBe(401);
    });
});

describe("POST /api/order — input validation", () => {
    beforeEach(() => {
        mockGetSession.mockResolvedValue({ user: { sub: "auth0|user123" } });
    });

    it("returns 400 when cartItems is an empty array", async () => {
        const res = await POST(makeRequest({ ...validBody, cartItems: [] }));
        expect(res.status).toBe(400);
    });

    it("returns 400 when cartItems is missing", async () => {
        const { cartItems: _, ...rest } = validBody;
        const res = await POST(makeRequest(rest));
        expect(res.status).toBe(400);
    });

    it("returns 400 when quantity is 0", async () => {
        const res = await POST(makeRequest({
            ...validBody,
            cartItems: [{ ...validCartItem, quantity: 0 }],
        }));
        expect(res.status).toBe(400);
    });

    it("returns 400 when quantity is negative", async () => {
        const res = await POST(makeRequest({
            ...validBody,
            cartItems: [{ ...validCartItem, quantity: -1 }],
        }));
        expect(res.status).toBe(400);
    });

    it("returns 400 when quantity is a float", async () => {
        const res = await POST(makeRequest({
            ...validBody,
            cartItems: [{ ...validCartItem, quantity: 1.5 }],
        }));
        expect(res.status).toBe(400);
    });

    it("returns 400 when image.id is missing", async () => {
        const res = await POST(makeRequest({
            ...validBody,
            cartItems: [{ image: { src: {} }, quantity: 1 }],
        }));
        expect(res.status).toBe(400);
    });

    it("returns 400 when email is malformed", async () => {
        const res = await POST(makeRequest({
            ...validBody,
            customerDetails: { ...validCustomerDetails, email: "not-an-email" },
        }));
        expect(res.status).toBe(400);
    });

    it("returns 400 when a required customer field is empty", async () => {
        const res = await POST(makeRequest({
            ...validBody,
            customerDetails: { ...validCustomerDetails, firstName: "" },
        }));
        expect(res.status).toBe(400);
    });

    it("returns 400 when paymentToken is an empty string", async () => {
        const res = await POST(makeRequest({ ...validBody, paymentToken: "" }));
        expect(res.status).toBe(400);
    });

    it("returns 400 when paymentToken is missing", async () => {
        const { paymentToken: _, ...rest } = validBody;
        const res = await POST(makeRequest(rest));
        expect(res.status).toBe(400);
    });

    it("returns 400 when customerDetails is missing", async () => {
        const { customerDetails: _, ...rest } = validBody;
        const res = await POST(makeRequest(rest));
        expect(res.status).toBe(400);
    });
});

describe("POST /api/order — order creation", () => {
    beforeEach(() => {
        mockGetSession.mockResolvedValue({ user: { sub: "auth0|user123" } });
    });

    it("returns 200 with orderId for a valid request", async () => {
        const res = await POST(makeRequest(validBody));
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.success).toBe(true);
        expect(typeof body.orderId).toBe("string");
        expect(body.orderId).toHaveLength(24); // MongoDB ObjectId hex string
    });

    it("persists the order document to the database", async () => {
        await POST(makeRequest(validBody));
        const doc = await orders.findOne({});
        expect(doc).toBeTruthy();
        expect(doc?.paymentToken).toBe("mock_tok_abc");
        expect(doc?.customerDetails.email).toBe("jane@example.com");
        expect(doc?.createdAt).toBeInstanceOf(Date);
    });

    it("computes orderTotal server-side from ITEM_PRICE × quantity", async () => {
        const res = await POST(makeRequest({
            ...validBody,
            cartItems: [{ image: validImage, quantity: 3 }],
        }));
        expect(res.status).toBe(200);
        const doc = await orders.findOne({});
        expect(doc?.orderTotal).toBe(ITEM_PRICE * 3);
    });

    it("computes orderTotal across multiple cart items", async () => {
        const res = await POST(makeRequest({
            ...validBody,
            cartItems: [
                { image: validImage, quantity: 2 },
                { image: { id: 5678, src: {} }, quantity: 1 },
            ],
        }));
        expect(res.status).toBe(200);
        const doc = await orders.findOne({});
        expect(doc?.orderTotal).toBe(ITEM_PRICE * 3);
    });

    it("orderTotal ignores any price field the client might send", async () => {
        const res = await POST(makeRequest({
            ...validBody,
            // Client tries to sneak in a price field — Zod strips unknown fields,
            // and the server recomputes total from ITEM_PRICE anyway.
            cartItems: [{ image: { ...validImage, price: 0.01 }, quantity: 1 }],
        }));
        expect(res.status).toBe(200);
        const doc = await orders.findOne({});
        expect(doc?.orderTotal).toBe(ITEM_PRICE);
    });
});
