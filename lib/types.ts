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