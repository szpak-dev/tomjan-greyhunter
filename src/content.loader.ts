import * as fs from 'node:fs/promises';
import { createReadStream, existsSync } from 'node:fs';
import * as path from 'node:path';
import * as readline from 'node:readline';

/**
 * Task: Implement content loading functionality.
 * 
 * First you read subfolders of raw folder. Every subfolder name represents manufacturer slug.
 * Then you read JSON files inside each subfolder representing products and categories. They are JSONL files.
 * For every category and product you create a corresponding JSON file in the content folder dedicated to a given manufacturer.
 * Files are called using slug value from JSON objects.
 */

const RAW_DIR = path.resolve('raw');
const CONTENT_DIR = path.resolve('src/content');

async function processJsonl(filePath: string, onEntry: (data: any) => Promise<void>) {
    const fileStream = createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        if (line.trim()) {
            try {
                const data = JSON.parse(line);
                await onEntry(data);
            } catch (error) {
                console.error(`Error parsing JSON in ${filePath}:`, error);
            }
        }
    }
}

async function loadContent() {
    if (!existsSync(RAW_DIR)) {
        console.error(`Raw directory not found: ${RAW_DIR}`);
        return;
    }

    const manufacturers = await fs.readdir(RAW_DIR, { withFileTypes: true });

    for (const manufacturer of manufacturers) {
        if (!manufacturer.isDirectory()) continue;

        const manufacturerSlug = manufacturer.name;
        const manufacturerRawPath = path.join(RAW_DIR, manufacturerSlug);

        // Process Categories
        const categoriesJsonlPath = path.join(manufacturerRawPath, 'categories.jsonl');
        if (existsSync(categoriesJsonlPath)) {
            const categoryDestDir = path.join(CONTENT_DIR, 'categories', manufacturerSlug);
            await fs.mkdir(categoryDestDir, { recursive: true });
            
            await processJsonl(categoriesJsonlPath, async (category) => {
                if (category.slug) {
                    const destPath = path.join(categoryDestDir, `${category.slug}.json`);
                    await fs.writeFile(destPath, JSON.stringify(category, null, 2));
                }
            });
            console.log(`Processed categories for ${manufacturerSlug}`);
        }

        // Process Products
        const productsJsonlPath = path.join(manufacturerRawPath, 'products.jsonl');
        if (existsSync(productsJsonlPath)) {
            const productDestDir = path.join(CONTENT_DIR, 'products', manufacturerSlug);
            await fs.mkdir(productDestDir, { recursive: true });

            await processJsonl(productsJsonlPath, async (product) => {
                if (product.slug) {
                    const destPath = path.join(productDestDir, `${product.slug}.json`);
                    await fs.writeFile(destPath, JSON.stringify(product, null, 2));
                }
            });
            console.log(`Processed products for ${manufacturerSlug}`);
        }
    }
}

// Execute if run via CLI
loadContent().catch((err) => {
    console.error('Failed to load content:', err);
    process.exit(1);
});
