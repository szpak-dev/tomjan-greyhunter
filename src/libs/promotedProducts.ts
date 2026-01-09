import { getCollection } from 'astro:content';
import type { PromotedProductWithDetails } from '../types/promotedProduct';

export async function getPromotedProductsForLanguage(
  lang: string
): Promise<PromotedProductWithDetails[]> {
  // Get all promoted products
  const promotedProducts = await getCollection('promotedProducts' as any);

  // Sort by order
  promotedProducts.sort((a: any, b: any) => a.data.order - b.data.order);

  // Resolve product details
  const productsWithDetails = await Promise.all(
    promotedProducts.map(async (promoted: any) => {
      const { manufacturer, productSku, imageOrientation, order, id } = promoted.data;

      // Fetch product details based on manufacturer
      if (manufacturer === 'marttiini') {
        return await resolveMarttiiniProduct(id, lang, manufacturer, productSku, imageOrientation, order);
      }

      // Fallback for unknown manufacturers
      return createFallbackProduct(id, lang, manufacturer, productSku, imageOrientation, order);
    })
  );

  return productsWithDetails;
}

async function resolveMarttiiniProduct(
  id: string,
  lang: string,
  manufacturer: string,
  productSku: string,
  imageOrientation: 'landscape' | 'portrait',
  order: number
): Promise<PromotedProductWithDetails> {
  const collectionName = lang === 'en' ? 'marttiiniProductsI18nEn' : 'marttiiniProductsI18nPl';
  
  // Fetch product translation
  const translations = await getCollection(collectionName, ({ data }) => {
    return data.sku === productSku;
  });
  const productTranslation = translations[0];

  // Get base product for images
  const baseProducts = await getCollection('marttiiniProducts', ({ data }) => {
    return data.sku === productSku;
  });
  const baseProduct = baseProducts[0];

  return {
    id,
    lang,
    manufacturer,
    productSku,
    imageOrientation,
    order,
    name: productTranslation?.data.name || '',
    slug: productTranslation?.data.slug || '',
    lead: productTranslation?.data.lead,
    imageUrl: baseProduct?.data.cdn_images?.[0],
  };
}

function createFallbackProduct(
  id: string,
  lang: string,
  manufacturer: string,
  productSku: string,
  imageOrientation: 'landscape' | 'portrait',
  order: number
): PromotedProductWithDetails {
  return {
    id,
    lang,
    manufacturer,
    productSku,
    imageOrientation,
    order,
    name: 'Unknown Product',
    slug: '',
    lead: undefined,
    imageUrl: undefined,
  };
}
