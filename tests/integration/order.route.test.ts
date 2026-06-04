import { describe, it, expect, vi, beforeAll, beforeEach, afterAll } from "vitest";
import type { Collection, MongoClient } from "mongodb";
import { setupInMemoryMongo } from "../test-utils/mongo";
import { createOrder } from "@/app/actions/order";
import { ITEM_PRICE } from "@/lib/config";
import type { OrderDocument } from "@/lib/types";

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

const validInput = {
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

describe("createOrder — authentication", () => {
    it("returns error when there is no session", async () => {
        mockGetSession.mockResolvedValue(null);
        const result = await createOrder(validInput);
        expect(result.success).toBe(false);
        if (!result.success) expect(result.error).toBe("Unauthorized");
    });

    it("returns error when session has no sub", async () => {
        mockGetSession.mockResolvedValue({ user: {} });
        const result = await createOrder(validInput);
        expect(result.success).toBe(false);
        if (!result.success) expect(result.error).toBe("Unauthorized");
    });
});

describe("createOrder — input validation", () => {
    beforeEach(() => {
        mockGetSession.mockResolvedValue({ user: { sub: "auth0|user123" } });
    });

    it("returns error when cartItems is an empty array", async () => {
        const result = await createOrder({ ...validInput, cartItems: [] });
        expect(result.success).toBe(false);
    });

    it("returns error when quantity is 0", async () => {
        const result = await createOrder({
            ...validInput,
            cartItems: [{ ...validCartItem, quantity: 0 }],
        });
        expect(result.success).toBe(false);
    });

    it("returns error when quantity is negative", async () => {
        const result = await createOrder({
            ...validInput,
            cartItems: [{ ...validCartItem, quantity: -1 }],
        });
        expect(result.success).toBe(false);
    });

    it("returns error when quantity is a float", async () => {
        const result = await createOrder({
            ...validInput,
            cartItems: [{ ...validCartItem, quantity: 1.5 }],
        });
        expect(result.success).toBe(false);
    });

    it("returns error when image.id is missing", async () => {
        const result = await createOrder({
            ...validInput,
            cartItems: [{ image: { src: {} } as never, quantity: 1 }],
        });
        expect(result.success).toBe(false);
    });

    it("returns error when email is malformed", async () => {
        const result = await createOrder({
            ...validInput,
            customerDetails: { ...validCustomerDetails, email: "not-an-email" },
        });
        expect(result.success).toBe(false);
    });

    it("returns error when a required customer field is empty", async () => {
        const result = await createOrder({
            ...validInput,
            customerDetails: { ...validCustomerDetails, firstName: "" },
        });
        expect(result.success).toBe(false);
    });

    it("returns error when paymentToken is an empty string", async () => {
        const result = await createOrder({ ...validInput, paymentToken: "" });
        expect(result.success).toBe(false);
    });
});

describe("createOrder — order creation", () => {
    beforeEach(() => {
        mockGetSession.mockResolvedValue({ user: { sub: "auth0|user123" } });
    });

    it("returns success with orderId for a valid input", async () => {
        const result = await createOrder(validInput);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(typeof result.orderId).toBe("string");
            expect(result.orderId).toHaveLength(24); // MongoDB ObjectId hex string
        }
    });

    it("persists the order document to the database", async () => {
        await createOrder(validInput);
        const doc = await orders.findOne({});
        expect(doc).toBeTruthy();
        expect(doc?.paymentToken).toBe("mock_tok_abc");
        expect(doc?.customerDetails.email).toBe("jane@example.com");
        expect(doc?.createdAt).toBeInstanceOf(Date);
    });

    it("computes orderTotal server-side from ITEM_PRICE × quantity", async () => {
        await createOrder({
            ...validInput,
            cartItems: [{ image: validImage, quantity: 3 }],
        });
        const doc = await orders.findOne({});
        expect(doc?.orderTotal).toBe(ITEM_PRICE * 3);
    });

    it("computes orderTotal across multiple cart items", async () => {
        await createOrder({
            ...validInput,
            cartItems: [
                { image: validImage, quantity: 2 },
                { image: { id: 5678, src: {} }, quantity: 1 },
            ],
        });
        const doc = await orders.findOne({});
        expect(doc?.orderTotal).toBe(ITEM_PRICE * 3);
    });

    it("orderTotal ignores any price field the client might send", async () => {
        await createOrder({
            ...validInput,
            cartItems: [{ image: { ...validImage, price: 0.01 } as never, quantity: 1 }],
        });
        const doc = await orders.findOne({});
        expect(doc?.orderTotal).toBe(ITEM_PRICE);
    });
});
