import { getCollection } from 'astro:content';
import { getRelativeLocaleUrl } from 'astro:i18n';

const EXCLUDED_CATEGORIES: Record<string, string[]> = {
    'marttiini': [
        'business-gifts', 
        'novelties', 
        'service-and-commemorative-knives'
    ]
}

export type ContentCategory = {
    id: string;
    name: string;
    slug: string;
    manufacturer: string;
    link: string;
}

export type ContentCategoryWithImage = ContentCategory & {
    imageUrl: string;
    altText?: string;
}

export async function findCategories(manufacturer: string, lang: string): Promise<ContentCategory[]> {
    const categories = await getCollection('categories', (entry) => entry.data.manufacturer === manufacturer);
    const exludedCategories = EXCLUDED_CATEGORIES[manufacturer] || [];
    const filteredCategories = categories.filter((entry) => !exludedCategories.includes(entry.data.slug));
    
    return filteredCategories.map((entry) => {
        const category = entry.data as ContentCategory;
        category.link = getRelativeLocaleUrl(lang, `${manufacturer}/${category.slug}/`);
        return category;
    });
}

export async function getCategoryBySlug(manufacturer: string, slug: string, lang: string): Promise<ContentCategory> {
    const categories = await findCategories(manufacturer, lang);
    const category = categories.find((entry) => entry.slug === slug);

    if (!category) {
        throw new Error(`Category with slug "${slug}" not found for manufacturer "${manufacturer}"`);
    }

    return category;
}

async function getFirstCategoryProductImage(manufacturer: string, category_slug: string): Promise<string | null> {
    const products = await getCollection('products', (entry) => entry.data.manufacturer === manufacturer && entry.data.category_slug === category_slug);
    
    if (products.length > 0 && products[0].data.images.length > 0) {
        return products[0].data.images[0];
    }

    return null;
}


export async function findCategoriesWithImages(manufacturer: string, lang: string): Promise<ContentCategoryWithImage[]> {
    const categories = await findCategories(manufacturer, lang);
    const categoriesWithImages: ContentCategoryWithImage[] = [];

    for (const category of categories) {
        const imageUrl = await getFirstCategoryProductImage(manufacturer, category.slug);
        categoriesWithImages.push({
            ...category,
            imageUrl: imageUrl || '',
            altText: category.name,
        });
    }

    return categoriesWithImages;
}

export async function getCategoryBySlugWithImage(manufacturer: string, slug: string, lang: string): Promise<ContentCategoryWithImage> {
    const categories = await findCategories(manufacturer, lang);
    const category = categories.find((entry) => entry.slug === slug);
    
    if (!category) {
        throw new Error(`Category with slug "${slug}" not found for manufacturer "${manufacturer}"`);
    }

    const imageUrl = await getFirstCategoryProductImage(
        manufacturer, 
        category.slug
    );
    
    return {
        ...category,
        imageUrl: imageUrl || '',
        altText: category.name,
    };
}