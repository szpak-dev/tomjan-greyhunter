export type Manufacturer = {
    name: string;
    slug: string;
    logoUrl: string;
    imagesOrientation: 'landscape' | 'portrait';
}

export type Category = {
    id?: string;
    manufacturer: string;
    name: string;
    slug: string;
    url?: string;
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
    category_name: string;
    name: string;
    slug: string;
    lead?: string | null;
    description: string[];
    images: string[];
    attributes: Attribute[];
}
