import { getCollection } from 'astro:content';
import type { PromotedProductWithDetails } from '../../types/promotedProduct';
import { getMarttiiniProduct } from './marttiini';

export async function getPromotedProductsForLanguage(
  lang: 'en' | 'pl'
): Promise<PromotedProductWithDetails[]> {
  const promotedProducts = await getCollection('promotedProducts' as any);
  promotedProducts.sort((a: any, b: any) => a.data.order - b.data.order);

  console.log(`[promotedProducts] Processing ${promotedProducts.length} promoted products for lang ${lang}`);

  const productsWithDetails = await Promise.all(
    promotedProducts.map(async (promoted: any) => {
      const { manufacturer, productSku, imageOrientation, order, id } = promoted.data;
      console.log(`[promotedProducts] Processing: id=${id}, sku=${productSku}, manufacturer=${manufacturer}`);

      if (manufacturer === 'marttiini') {
        const result = await resolveMarttiiniProduct(id, lang, manufacturer, productSku, imageOrientation, order);
        console.log(`[promotedProducts] Resolved ${id}:`, result.name, result.imageUrl ? 'has image' : 'NO IMAGE');
        return result;
      }

      return createFallbackProduct(id, lang, manufacturer, productSku, imageOrientation, order);
    })
  );

  console.log(`[promotedProducts] Returning ${productsWithDetails.length} products`);
  return productsWithDetails;
}

async function resolveMarttiiniProduct(
  id: string,
  lang: 'en' | 'pl',
  manufacturer: string,
  productSku: string,
  imageOrientation: 'landscape' | 'portrait',
  order: number
): Promise<PromotedProductWithDetails> {
  const product = await getMarttiiniProduct(productSku, lang);

  if (!product) {
    return createFallbackProduct(id, lang, manufacturer, productSku, imageOrientation, order);
  }

  return {
    id,
    manufacturer,
    productSku,
    imageOrientation,
    order,
    name: product.name,
    slug: product.slug,
    lead: product.lead,
    imageUrl: product.cdn_images?.[0],
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
