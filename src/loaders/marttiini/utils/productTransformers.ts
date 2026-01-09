import type {
  MarttiiniRawProduct,
  MarttiiniBaseProduct,
  MarttiiniProductTranslation
} from '../../../types/marttiini/product';

/**
 * Transform raw Marttiini product to base product (language-agnostic data)
 */
export function toBaseProduct(raw: MarttiiniRawProduct): MarttiiniBaseProduct {
  return {
    sku: raw.sku,
    manufacturer: 'marttiini',
    category_slug: raw.category_slug,
    active: raw.active,
    url: raw.url,
    cdn_images: raw.cdn_images,
  };
}

/**
 * Transform raw Marttiini product to translation (language-specific data)
 */
export function toProductTranslation(
  raw: MarttiiniRawProduct,
  lang: string
): MarttiiniProductTranslation {
  return {
    sku: raw.sku,
    lang,
    slug: raw.slug,
    name: raw.name,
    category: raw.category,
    lead: raw.lead,
    description: raw.description,
    attributes: raw.attributes,
  };
}

/**
 * Generate collection ID for Marttiini translation
 */
export function getTranslationId(lang: string, sku: string): string {
  return `marttiini/${lang}/${sku}`;
}
