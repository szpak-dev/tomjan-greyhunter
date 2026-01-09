/**
 * Generic product helpers and utilities
 * For manufacturer-specific functions, see:
 * - @/libs/marttiini for Marttiini products
 */

/**
 * Base product interface (extend for specific manufacturers)
 */
export interface BaseProduct {
  sku: string;
  manufacturer: string;
  category_slug: string;
  active: boolean;
  url: string;
  cdn_images: string[];
}

/**
 * Product translation interface (extend for specific manufacturers)
 */
export interface ProductTranslation {
  sku: string;
  lang: string;
  slug: string;
  name: string;
  category: string;
  lead?: string;
  description: string;
}

/**
 * Get product by manufacturer
 */
export async function getProduct(
  manufacturer: string,
  sku: string,
  lang: string
): Promise<any> {
  switch (manufacturer) {
    case 'marttiini':
      const { getMarttiiniProduct } = await import('./marttiini');
      return getMarttiiniProduct(sku, lang as 'en' | 'pl');
    default:
      console.warn(`Unknown manufacturer: ${manufacturer}`);
      return null;
  }
}

/**
 * Get all products by manufacturer
 */
export async function getAllProducts(
  manufacturer: string,
  lang: string
): Promise<any[]> {
  switch (manufacturer) {
    case 'marttiini':
      const { getAllMarttiiniProducts } = await import('./marttiini');
      return getAllMarttiiniProducts(lang as 'en' | 'pl');
    default:
      console.warn(`Unknown manufacturer: ${manufacturer}`);
      return [];
  }
}

/**
 * Get products by category and manufacturer
 */
export async function getProductsByCategory(
  manufacturer: string,
  categorySlug: string,
  lang: string
): Promise<any[]> {
  switch (manufacturer) {
    case 'marttiini':
      const { getMarttiiniProductsByCategory } = await import('./marttiini');
      return getMarttiiniProductsByCategory(categorySlug, lang as 'en' | 'pl');
    default:
      console.warn(`Unknown manufacturer: ${manufacturer}`);
      return [];
  }
}

/**
 * Search products across manufacturers
 */
export async function searchProducts(
  query: string,
  lang: string,
  manufacturer?: string
): Promise<any[]> {
  if (manufacturer) {
    switch (manufacturer) {
      case 'marttiini':
        const { searchMarttiiniProducts } = await import('./marttiini');
        return searchMarttiiniProducts(query, lang as 'en' | 'pl');
      default:
        return [];
    }
  }
  
  // Search across all manufacturers
  const results: any[] = [];
  
  // Add Marttiini results
  const { searchMarttiiniProducts } = await import('./marttiini');
  results.push(...await searchMarttiiniProducts(query, lang as 'en' | 'pl'));
  
  return results;
}
