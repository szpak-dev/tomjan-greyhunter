import { getCollection } from "astro:content";
import { getRelativeLocaleUrl } from "astro:i18n";
import { VISIBLE_CATEGORIES } from "./filters.config";

export type Category = {
    id: string;
    lang: string;
    link: string;
    manufacturer: string;
    name: string;
    slug: string;
    image: string;
}

export async function findCategories(lang: string): Promise<Category[]> {
    const categories = await getCollection("categories");
    const products = await getCollection("products");
    
    const result = categories
        .filter((c) => VISIBLE_CATEGORIES[c.data.manufacturer]?.includes(c.data.slug) && c.data.lang === lang)
        .map((c) => {
            const category = c.data as Category;
            category.link = getCategoryUrl(category, lang);
            
            const firstProduct = products.find(
                (p) => p.data.lang === lang && 
                       p.data.manufacturer === category.manufacturer &&
                       p.data.category_slug === category.slug
            );

            if (!firstProduct) {
                throw new Error(`No products found for category ${category.slug} in language ${lang}`);
            }
            
            category.image = firstProduct.data.images[0];
            
            return category;
        });

    return result;
}

export async function getCategoryBySlug(slug: string, lang: string): Promise<Category> {
    const categories = await findCategories(lang);
    const category = categories.find((category) => category.slug === slug);
        
    if (!category) {
        throw new Error(`Category with slug ${slug} not found`);
    }

    return category;
}

export function getCategoryUrl(category: Category, lang: string): string {
  return getRelativeLocaleUrl(lang, `/category/${category.slug}/`);
}
