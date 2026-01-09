import type { MarttiiniRawProduct } from '../types';

/**
 * Parse JSONL file content into Marttiini product objects
 */
export function parseJsonl(content: string): MarttiiniRawProduct[] {
  return content
    .trim()
    .split('\n')
    .filter(line => line.trim())
    .map(line => {
      try {
        return JSON.parse(line);
      } catch (error) {
        console.error('Failed to parse line:', line);
        throw error;
      }
    });
}

/**
 * Validate product object has required fields
 */
export function isValidProduct(product: unknown): product is MarttiiniRawProduct {
  const p = product as Partial<MarttiiniRawProduct>;
  return !!(
    p.sku &&
    p.name &&
    p.slug &&
    p.category_slug &&
    typeof p.active === 'boolean'
  );
}
