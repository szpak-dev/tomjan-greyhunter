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
