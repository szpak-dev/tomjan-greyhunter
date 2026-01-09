import type { Loader } from 'astro/loaders';
import fs from 'node:fs/promises';
import path from 'node:path';
import { parseJsonl, isValidProduct } from './utils/jsonlParser';
import {
  toBaseProduct,
  toProductTranslation,
  getTranslationId,
} from './utils/productTransformers';

export type MarttiiniLoaderType = 'base' | 'i18n';

export interface MarttiiniLoaderOptions {
  filePath: string;
  type: MarttiiniLoaderType;
  lang?: string;
}

export function marttiiniProductLoader(options: MarttiiniLoaderOptions): Loader {
  const { filePath, type, lang } = options;

  if (type === 'i18n' && !lang) {
    throw new Error('lang is required when type is "i18n"');
  }

  return {
    name: `marttiini-${type}${lang ? `-${lang}` : ''}`,
    
    load: async ({ store, logger, parseData }) => {
      const startTime = Date.now();
      logger.info(`Loading Marttiini ${type} products from ${filePath}${lang ? ` (${lang})` : ''}`);

      try {
        // Read and parse JSONL file
        const absolutePath = path.resolve(process.cwd(), filePath);
        const content = await fs.readFile(absolutePath, 'utf-8');
        const products = parseJsonl(content);

        // Validate and filter products
        const validProducts = products.filter(product => {
          if (!isValidProduct(product)) {
            logger.warn(`Invalid product found, skipping: ${JSON.stringify(product).slice(0, 100)}`);
            return false;
          }
          return true;
        });

        logger.info(`Found ${validProducts.length} valid Marttiini products`);

        // Load data based on type
        if (type === 'base') {
          loadBaseProducts(validProducts, store);
        } else if (type === 'i18n' && lang) {
          loadTranslations(validProducts, lang, store);
        }

        const duration = Date.now() - startTime;
        logger.info(`Loaded ${store.keys().length} entries in ${duration}ms`);
      } catch (error) {
        logger.error(`Failed to load products: ${error}`);
        throw error;
      }
    },
  };
}

function loadBaseProducts(products: any[], store: any): void {
  for (const product of products) {
    const baseProduct = toBaseProduct(product);
    store.set({
      id: baseProduct.sku,
      data: baseProduct,
    });
  }
}

function loadTranslations(products: any[], lang: string, store: any): void {
  for (const product of products) {
    const translation = toProductTranslation(product, lang);
    const id = getTranslationId(lang, product.sku);
    
    store.set({
      id,
      data: translation,
    });
  }
}

export function createMarttiiniLoader(
  type: MarttiiniLoaderType,
  lang?: string
): Loader {
  return marttiiniProductLoader({
    filePath: './raw/marttiini/products.jsonl',
    type,
    lang,
  });
}
