import { ObjectId } from "mongodb";

export type PexelImageSrc = {
    original?: string;
    large2x?: string;
    large?: string;
    medium?: string;
    small?: string;
    portrait?: string;
    landscape?: string;
    tiny?: string;
};

export type PexelImage = {
    id: number;
    alt?: string;
    src: PexelImageSrc;
    photographer?: string;
    photographer_url?: string;
    width?: number;
    height?: number;
    liked?: boolean;
    url?: string;
    avg_color?: string;
};

export type CartItem = {
    image: PexelImage;
    quantity: number;
};

export interface FavouriteDocument {
    _id?: string;            // MongoDB autogenerates this
    auth0Id: string;         // user.sub from Auth0
    images: PexelImage[];        // list of favourite images
}

export interface ProfileDocument {
    _id?: ObjectId;          // MongoDB autogenerates this
    auth0Id: string;         // user.sub from Auth0
    email: string;           // user's email from Auth0
    username: string;        // user's username
    avatarUrl?: string;      // URL to user's avatar image (uses Auth0 picture if available)
    bio?: string;            // user's bio
    createdAt: Date;
    updatedAt?: Date;
}

export interface OrderDocument {
    _id?: ObjectId;                 // MongoDB autogenerates this
    customerDetails: CheckoutFormData;
    cartItems: CartItem[];
    createdAt: Date;
    updatedAt?: Date;
}

export type Profile = {
    id: string;
    auth0Id: string;
    email: string;
    username: string;
    avatarUrl?: string;
    bio?: string;
    createdAt: string;
    updatedAt?: string;
};

export type ProfilePatchBody = {
    username?: string;
    avatarUrl?: string;
    bio?: string;
};

export type FindOneAndUpdateResult<T> =
    | { value: T | null }
    | T
    | null;

export type CheckoutFormData = {
    firstName: string;
    lastName: string;
    email: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    postcode: string;
};

export type PaymentFormData = {
    cardholderName: string;
    cardNumber: string;
    expiryDate: string;
    securityCode: string;
};