import { categoryRepository, productRepository } from ".";
import { NEW_PRODUCTS } from "./filters.config";
import type { Product } from "./product.repository";

export async function findNewProducts(manufacturer: string, lang: string): Promise<Product[]> {
    const products = await productRepository.findProducts(manufacturer, lang);
    const newProducts = products.filter((p) => NEW_PRODUCTS[manufacturer]?.includes(p.slug));
    const categories = await categoryRepository.findManufacturerCategories(manufacturer, lang);

    return newProducts.map((product) => {
        const category = categories.find((c) => c.slug === product.category_slug);
        
        if (!category) {
            throw new Error(`Category with slug '${product.category_slug}' not found for manufacturer '${manufacturer}' and lang '${lang}'`);
        }
        
        product.category_name = category.name;
        return product;
    });
}

export type MossaicPicture = {
    image_url: string;
};

export function getMossaic(): MossaicPicture[] {
    return [
        { image_url: 'tomjan/collage/m-0' },
        { image_url: 'tomjan/collage/m-1' },
        { image_url: 'tomjan/collage/m-2' },
        { image_url: 'tomjan/collage/m-3' },
        { image_url: 'tomjan/collage/m-4' },
        { image_url: 'tomjan/collage/m-5' },
        { image_url: 'tomjan/collage/m-6' },
        { image_url: 'tomjan/collage/m-7' },
        { image_url: 'tomjan/collage/m-8' },
        { image_url: 'tomjan/collage/m-9' },
        { image_url: 'tomjan/collage/m-10' },
        { image_url: 'tomjan/collage/m-11' },
    ]
}

export function getSliderItems(manufacturer: string): { image: string; altText: string; }[] {
    const mapping: Record<string, { image: string; altText: string; }[]> = {
        "marttiini": [
            { image: "greyhunter.com.pl/slider-0", altText: "Slider Item 0", },
            { image: "greyhunter.com.pl/slider-1", altText: "Slider Item 1", },
            { image: "greyhunter.com.pl/slider-2", altText: "Slider Item 2", },
            { image: "greyhunter.com.pl/slider-3", altText: "Slider Item 3", },
        ],
    }

    return mapping[manufacturer] || [];
}