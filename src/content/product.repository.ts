import { getCollection } from 'astro:content';
import { getRelativeLocaleUrl } from "astro:i18n";

export type ContentProductImage = {
    url: string;
    altText?: string;
}

export type ContentProduct = {
    id: string;
    url: string;
    manufacturer: string;
    category_slug: string;
    sku: string;
    name: string;
    slug: string;
    lead: string | null;
    description: string | null;
    images: ContentProductImage[];
    attributes: {
        name: string;
        properties: {
            name: string;
            value: string;
        }[];
    }[];
}

export type PromotedContentProduct = {
    id: string;
    manufacturer: string;
    name: string;
    slug: string;
    image: ContentProductImage;
}

export type NewProduct = {
    product: ContentProduct;
    label: {
        text: string;
        color: string;
    }
}

export async function getProductById(id: string, lang: string = ''): Promise<ContentProduct> {
    const products = await getCollection('products', (entry) => entry.data.id === id);

    if (products.length === 0) {
        throw new Error(`Product with ID ${id} not found`);
    }

    return {
        ...products[0].data,
        images: products[0].data.cdn_images.map((url: string) => ({ 
            url, 
            altText: products[0].data.name 
        })),
    };
}

export async function findProducts(manufacturer: string, lang: string = ''): Promise<ContentProduct[]> {
    const products = await getCollection('products', (entry) => entry.data.manufacturer === manufacturer);
    
    const productsPromises = products.map(async (entry) => {
        const product = await getProductById(entry.data.id, lang);
        return product;
    });

    return Promise.all(productsPromises);
}

export async function findProductsByCategory(manufacturer: string, category: string, lang: string = ''): Promise<ContentProduct[]> {
    const products = await findProducts(manufacturer, lang);
    return products.filter((product) => product.category_slug === category);
}

export async function getPromotedProducts(productIds: string[], lang: string = ''): Promise<PromotedContentProduct[]> {
    const promotedProducts = productIds.map(async (id) => {
        const product = await getProductById(id, lang);
        return {
            id: product.id,
            manufacturer: product.manufacturer,
            name: product.name,
            slug: product.slug,
            image: product.images.length > 0 ? product.images[0] : { url: '', altText: product.name },
        };
    });

    return Promise.all(promotedProducts);
}

export async function getNewProducts(productIds: string[], lang: string = ''): Promise<NewProduct[]> {
    const newProducts = productIds.map(async (id) => {
        const product = await getProductById(id, lang);
        return {
            product,
            label: {
                text: 'New',
                color: 'success',
            },
        };
    });

    return Promise.all(newProducts);
}

export function makeProductUrl(product: ContentProduct, lang: string): string {
    return getRelativeLocaleUrl(lang, `${product.manufacturer}/${product.category_slug}/${product.slug}/`);
}