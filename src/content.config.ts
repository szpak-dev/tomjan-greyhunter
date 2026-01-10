import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders'; // Not available with legacy API

const manufacturers = defineCollection({
    schema: z.object({
        logoUrl: z.string(),
        name: z.string(),
        slug: z.string(),
        imagesOrientation: z.enum(['landscape', 'portrait']),
        link: z.object({
            url: z.string(),
            target: z.string(),
        }),
    }),
    loader: glob({pattern: './src/content/manufacturers/*.json'}),
});

const categories = defineCollection({
    schema: z.object({
        manufacturer: z.string(),
        url: z.string(),
        name: z.string(),
        slug: z.string(),
    }),
    loader: glob({pattern: './src/content/categories/**/*.json'}),
});

const products = defineCollection({
    schema: z.object({
        id: z.string(),
        url: z.string(),
        manufacturer: z.string(),
        category_slug: z.string(),
        sku: z.string(),
        name: z.string(),
        slug: z.string(),
        lead: z.string().nullable(),
        description: z.string().nullable(),
        cdn_images: z.array(z.string()),
        attributes: z.array(
            z.object({
                name: z.string(),
                properties: z.array(
                    z.object({
                        name: z.string(),
                        value: z.string(),
                    })
                ),
            })
        ),
    }),
    loader: glob({pattern: './src/content/products/**/*.json'}),
});

export const collections = {
    manufacturers,
    categories,
    products,
};