/**
 * Promoted product type definitions for homepage slider
 */

export interface PromotedProduct {
  id: string;
  manufacturer: string;
  productSku: string;
  imageOrientation: 'landscape' | 'portrait';
  order: number;
}

/**
 * Promoted product with resolved product details
 * Used when displaying the product with full information
 */
export interface PromotedProductWithDetails extends PromotedProduct {
  name: string;
  slug: string;
  lead?: string;
  imageUrl?: string;
}
