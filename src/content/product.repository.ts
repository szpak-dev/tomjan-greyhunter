import { getCollection } from 'astro:content';
import { getRelativeLocaleUrl } from "astro:i18n";

export type AttributeGroup = {
    name: string;
    properties: {
        name: string;
        value: string;
    }[];
}

export type ContentProduct = {
    id: string;
    url: string;
    link: string;
    manufacturer: string;
    category_slug: string;
    category_name: string;
    name: string;
    slug: string;
    lead: string | null;
    description: string[];
    images: string[];
    attributes: AttributeGroup[];
}

export type PromotedContentProduct = {
    id: string;
    manufacturer: string;
    name: string;
    slug: string;
    image: string;
    link: string;
}

export type NewProduct = {
    product: ContentProduct;
    label: {
        text: string;
        color: string;
    }
}

export async function getProductById(id: string, lang: string): Promise<ContentProduct> {
    const products = await getCollection('products', (entry) => entry.data.id === id);

    if (products.length === 0) {
        throw new Error(`Product with ID ${id} not found`);
    }

    const product = products[0].data as ContentProduct;
    const {manufacturer, category_slug, slug} = product;

    product.link = getRelativeLocaleUrl(lang, `${manufacturer}/${category_slug}/${slug}/`);
    return product;
}

export async function findProducts(manufacturer: string, lang: string): Promise<ContentProduct[]> {
    const products = await getCollection('products', (entry) => entry.data.manufacturer === manufacturer);
    
    const productsPromises = products.map(async (entry) => {
        const product = await getProductById(entry.data.id, lang);
        return product;
    });

    return Promise.all(productsPromises);
}

export async function findProductsByCategory(manufacturer: string, category: string, lang: string): Promise<ContentProduct[]> {
    const products = await findProducts(manufacturer, lang);
    return products.filter((product) => product.category_slug === category);
}

export async function getPromotedProducts(productIds: string[], lang: string): Promise<PromotedContentProduct[]> {
    const promotedProducts = productIds.map(async (id) => {
        const product = await getProductById(id, lang);
        return {
            id: product.id,
            manufacturer: product.manufacturer,
            name: product.name,
            slug: product.slug,
            image: product.images.length > 0 ? product.images[0] : '',
            link: product.link,
        };
    });

    return Promise.all(promotedProducts);
}

export async function getNewProducts(productIds: string[], lang: string): Promise<NewProduct[]> {
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