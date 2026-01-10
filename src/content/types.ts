export type Manufacturer = {
    name: string;
    slug: string;
    logoUrl: string;
    imagesOrientation: 'landscape' | 'portrait';
}

export type Category = {
    manufacturer: string;
    url: string;
    name: string;
    slug: string;
}

export type AttributeProperty = {
    name: string;
    value: string;
}

export type Attribute = {
    name: string;
    properties: AttributeProperty[];
}

export type Product = {
    id: string;
    url: string;
    manufacturer: string;
    category_slug: string;
    sku: string;
    name: string;
    slug: string;
    lead?: string;
    description: string;
    cdn_images: string[];
    attributes: Attribute[];
}
