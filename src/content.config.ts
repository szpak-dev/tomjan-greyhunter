import { defineCollection, z } from 'astro:content';
import { createMarttiiniLoader } from './loaders/marttiini';

const manufacturers = defineCollection({
    schema: z.object({
        lang: z.string(),
        name: z.string(),
        slug: z.string(),
        imagesOrientation: z.enum(['landscape', 'portrait']),
    }),
    loader: {
        name: 'manufacturers-loader',
        load: async ({ store, logger }) => {
            const fs = await import('node:fs/promises');
            const path = await import('node:path');
            
            const filePath = path.resolve(process.cwd(), './src/content/manufacturers.json');
            const content = await fs.readFile(filePath, 'utf-8');
            const manufacturers = JSON.parse(content);
            
            for (const manufacturer of manufacturers) {
                store.set({
                    id: `${manufacturer.slug}-${manufacturer.lang}`,
                    data: manufacturer,
                });
            }
            
            logger.info(`Loaded ${manufacturers.length} manufacturers`);
        }
    }
});

const marttiiniProducts = defineCollection({
    schema: z.object({
        sku: z.string(),
        manufacturer: z.literal('marttiini'),
        category_slug: z.string(),
        active: z.boolean(),
        url: z.string().url(),
        cdn_images: z.array(z.string().url()),
    }),
    loader: createMarttiiniLoader('base'),
});

const productI18nSchema = z.object({
    sku: z.string(),
    lang: z.string(),
    slug: z.string(),
    name: z.string(),
    category: z.string(),
    lead: z.string().optional(),
    description: z.string(),
    attributes: z.array(z.object({
        name: z.string(),
        properties: z.array(z.object({
            name: z.string(),
            value: z.string()
        }))
    })).optional(),
});

const marttiiniProductsI18nEn = defineCollection({
    schema: productI18nSchema,
    loader: createMarttiiniLoader('i18n', 'en'),
});

const marttiiniProductsI18nPl = defineCollection({
    schema: productI18nSchema,
    loader: createMarttiiniLoader('i18n', 'pl'),
});

const promotedProducts = defineCollection({
    schema: z.object({
        id: z.string(),
        manufacturer: z.string(),
        productSku: z.string(),
        imageOrientation: z.enum(['landscape', 'portrait']),
        order: z.number(),
    }),
    loader: {
        name: 'promoted-products-loader',
        load: async ({ store, logger }) => {
            const fs = await import('node:fs/promises');
            const path = await import('node:path');
            
            const filePath = path.resolve(process.cwd(), './src/content/promoted-products.json');
            const content = await fs.readFile(filePath, 'utf-8');
            const products = JSON.parse(content);
            
            for (const product of products) {
                store.set({
                    id: product.id,
                    data: product,
                });
            }
            
            logger.info(`Loaded ${products.length} promoted products`);
        }
    }
});

export const collections = {
    manufacturers,
    marttiiniProducts,
    marttiiniProductsI18nEn,
    marttiiniProductsI18nPl,
    promotedProducts,
};