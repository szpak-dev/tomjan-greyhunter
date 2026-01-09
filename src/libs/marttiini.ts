import { getEntry, getCollection } from 'astro:content';
import type {
  MarttiiniBaseProduct,
  MarttiiniProductTranslation
} from '../types/marttiini/product';

/**
 * Combined Marttiini product with base data and translation
 */
export interface FullMarttiiniProduct 
  extends MarttiiniBaseProduct, 
  Omit<MarttiiniProductTranslation, 'sku'> {}

/**
 * Get full Marttiini product data by combining base and translation
 */
export async function getMarttiiniProduct(
  sku: string,
  lang: 'en' | 'pl'
): Promise<FullMarttiiniProduct | null> {
  try {
    // Get base product
    const baseProduct = await getEntry('marttiiniProducts', sku);
    if (!baseProduct) {
      console.warn(`Marttiini product not found: ${sku}`);
      return null;
    }

    // Get translation
    const collectionName = lang === 'en' 
      ? 'marttiiniProductsI18nEn' 
      : 'marttiiniProductsI18nPl';
    const translationId = `marttiini/${lang}/${sku}`;
    const translation = await getEntry(collectionName, translationId);
    
    if (!translation) {
      console.warn(`Translation not found: ${translationId}`);
      return null;
    }

    // Combine data
    return {
      ...baseProduct.data,
      ...translation.data,
    };
  } catch (error) {
    console.error(`Error loading Marttiini product ${sku}:`, error);
    return null;
  }
}

/**
 * Get all Marttiini products for a specific language
 */
export async function getAllMarttiiniProducts(
  lang: 'en' | 'pl'
): Promise<FullMarttiiniProduct[]> {
  // Get all base products
  const baseProducts = await getCollection('marttiiniProducts');
  
  // Get translations for the language
  const collectionName = lang === 'en' 
    ? 'marttiiniProductsI18nEn' 
    : 'marttiiniProductsI18nPl';
  const translations = await getCollection(collectionName);
  
  // Create a map of translations by SKU
  const translationMap = new Map(
    translations.map(t => [t.data.sku, t.data])
  );
  
  // Combine base products with their translations
  const products: FullMarttiiniProduct[] = [];
  
  for (const base of baseProducts) {
    const translation = translationMap.get(base.data.sku);
    if (translation) {
      products.push({
        ...base.data,
        ...translation,
      });
    }
  }
  
  return products;
}

/**
 * Get Marttiini products by category
 */
export async function getMarttiiniProductsByCategory(
  categorySlug: string,
  lang: 'en' | 'pl'
): Promise<FullMarttiiniProduct[]> {
  const allProducts = await getAllMarttiiniProducts(lang);
  return allProducts.filter(p => p.category_slug === categorySlug);
}

/**
 * Get single Marttiini product by slug
 */
export async function getMarttiiniProductBySlug(
  slug: string,
  lang: 'en' | 'pl'
): Promise<FullMarttiiniProduct | null> {
  const allProducts = await getAllMarttiiniProducts(lang);
  return allProducts.find(p => p.slug === slug) || null;
}

/**
 * Get active Marttiini products only
 */
export async function getActiveMarttiiniProducts(
  lang: 'en' | 'pl'
): Promise<FullMarttiiniProduct[]> {
  const allProducts = await getAllMarttiiniProducts(lang);
  return allProducts.filter(p => p.active);
}

/**
 * Category with image from first product
 */
export interface MarttiiniCategoryWithImage {
  slug: string;
  name: string;
  count: number;
  imageUrl: string | null;
  firstProduct: FullMarttiiniProduct | null;
}

/**
 * Get all unique Marttiini categories
 */
export async function getMarttiiniCategories(
  lang: 'en' | 'pl'
): Promise<Array<{ slug: string; name: string; count: number }>> {
  const products = await getAllMarttiiniProducts(lang);
  
  const categoryMap = new Map<string, { name: string; count: number }>();
  
  for (const product of products) {
    if (product.active) {
      const existing = categoryMap.get(product.category_slug);
      if (existing) {
        existing.count++;
      } else {
        categoryMap.set(product.category_slug, {
          name: product.category,
          count: 1
        });
      }
    }
  }
  
  return Array.from(categoryMap.entries()).map(([slug, data]) => ({
    slug,
    name: data.name,
    count: data.count
  }));
}

/**
 * Get all Marttiini categories with images from first product
 */
export async function getMarttiiniCategoriesWithImages(
  lang: 'en' | 'pl'
): Promise<MarttiiniCategoryWithImage[]> {
  const products = await getActiveMarttiiniProducts(lang);
  
  const categoryMap = new Map<string, {
    name: string;
    count: number;
    firstProduct: FullMarttiiniProduct;
  }>();
  
  for (const product of products) {
    const existing = categoryMap.get(product.category_slug);
    if (existing) {
      existing.count++;
    } else {
      categoryMap.set(product.category_slug, {
        name: product.category,
        count: 1,
        firstProduct: product
      });
    }
  }
  
  return Array.from(categoryMap.entries())
    .map(([slug, data]) => ({
      slug,
      name: data.name,
      count: data.count,
      imageUrl: data.firstProduct.cdn_images?.[0] || null,
      firstProduct: data.firstProduct
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Search Marttiini products by query
 */
export async function searchMarttiiniProducts(
  query: string,
  lang: 'en' | 'pl'
): Promise<FullMarttiiniProduct[]> {
  const allProducts = await getAllMarttiiniProducts(lang);
  const lowerQuery = query.toLowerCase();
  
  return allProducts.filter(product => 
    product.active && (
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery) ||
      product.sku.toLowerCase().includes(lowerQuery)
    )
  );
}
