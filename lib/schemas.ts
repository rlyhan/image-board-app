import { z } from "zod";

const PexelImageSrcSchema = z.object({
    original: z.string().optional(),
    large2x: z.string().optional(),
    large: z.string().optional(),
    medium: z.string().optional(),
    small: z.string().optional(),
    portrait: z.string().optional(),
    landscape: z.string().optional(),
    tiny: z.string().optional(),
});

const PexelImageSchema = z.object({
    id: z.number().int().positive(),
    alt: z.string().optional(),
    src: PexelImageSrcSchema,
    photographer: z.string().optional(),
    photographer_url: z.string().optional(),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
    liked: z.boolean().optional(),
    url: z.string().optional(),
    avg_color: z.string().optional(),
});

export const CartItemSchema = z.object({
    image: PexelImageSchema,
    quantity: z.number().int().min(1),
});

export const CheckoutFormDataSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    addressLine1: z.string().min(1),
    addressLine2: z.string(),
    city: z.string().min(1),
    postcode: z.string().min(1),
});

export const OrderRequestSchema = z.object({
    customerDetails: CheckoutFormDataSchema,
    paymentToken: z.string().min(1),
    cartItems: z.array(CartItemSchema).min(1),
});
