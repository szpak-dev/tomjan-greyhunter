/**
 * Marttiini-specific product type definitions
 */

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface ProductAttributeGroup {
  name: string;
  properties: ProductAttribute[];
}

/**
 * Raw Marttiini product from JSONL file
 */
export interface MarttiiniRawProduct {
  active: boolean;
  url: string;
  sku: string;
  category: string;
  category_slug: string;
  name: string;
  slug: string;
  lead?: string;
  description: string;
  image_urls: string[];
  cdn_images: string[];
  attributes: ProductAttributeGroup[];
}

/**
 * Base product data (language-agnostic)
 */
export interface MarttiiniBaseProduct {
  sku: string;
  manufacturer: 'marttiini';
  category_slug: string;
  active: boolean;
  url: string;
  cdn_images: string[];
}

/**
 * Product translation (language-specific)
 */
export interface MarttiiniProductTranslation {
  sku: string;
  lang: string;
  slug: string;
  name: string;
  category: string;
  lead?: string;
  description: string;
  attributes?: ProductAttributeGroup[];
}
