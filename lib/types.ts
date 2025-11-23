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

export interface FavouriteDocument {
    _id?: string;            // MongoDB autogenerates this
    auth0Id: string;         // user.sub from Auth0
    images: PexelImage[];        // list of favourite images
}