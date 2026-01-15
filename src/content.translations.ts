import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {
  batchTranslateProducts,
  batchTranslateCategories
} from './libs/translate.auto.ts';
import type {
  Product,
  Category,
  TranslationDictionaries
} from './libs/translate.ts';
import {
  applyTranslationsToProduct,
  translateProduct,
  translateCategory
} from './libs/translate.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

/**
 * Progress tracking interface
 */
interface TranslationProgress {
  completed: string[];
  failed: { id: string; error: string }[];
}

/**
 * Get progress file path for a translation session
 */
function getProgressFilePath(
  type: 'product' | 'category',
  manufacturer: string,
  sourceLang: string,
  targetLang: string
): string {
  const progressDir = path.join(projectRoot, '.translations-progress');
  const fileName = `${type}-${manufacturer || 'default'}-${sourceLang}-${targetLang}.json`;
  return path.join(progressDir, fileName);
}

/**
 * Load existing progress or create new
 */
function loadProgress(progressPath: string): TranslationProgress {
  if (fs.existsSync(progressPath)) {
    const data = JSON.parse(fs.readFileSync(progressPath, 'utf-8'));
    console.log(
      `📋 Resuming previous translation: ${data.completed.length} completed, ${data.failed.length} failed`
    );
    return data;
  }

  return {
    completed: [],
    failed: []
  };
}

/**
 * Save progress to file
 */
function saveProgress(progressPath: string, progress: TranslationProgress): void {
  const dir = path.dirname(progressPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2) + '\n');
}

/**
 * Clear progress file on successful completion
 */
function clearProgress(progressPath: string): void {
  if (fs.existsSync(progressPath)) {
    fs.unlinkSync(progressPath);
  }
}

/**
 * Load dictionary from file (I/O operation)
 */
function loadDictionary<T = any>(manufacturer: string, language: string, fileName: string): T {
  const dictionaryPath = manufacturer
    ? path.join(projectRoot, 'src', 'content', 'dictionaries', manufacturer, language, fileName)
    : path.join(projectRoot, 'src', 'content', 'dictionaries', language, fileName);

  if (!fs.existsSync(dictionaryPath)) {
    throw new Error(`Dictionary file not found: ${dictionaryPath}`);
  }

  return JSON.parse(fs.readFileSync(dictionaryPath, 'utf-8'));
}

/**
 * Translate all products from source language to target language using dictionaries
 */
async function translateProducts(
  manufacturer: string,
  sourceLang: string,
  targetLang: string
): Promise<void> {
  console.log(`Translating ${manufacturer} products from ${sourceLang} to ${targetLang}...\n`);

  // Load all dictionaries for target language
  console.log('Loading dictionaries...');
  const dictionaries: TranslationDictionaries = {
    attributeGroups: loadDictionary<Record<string, string>>(manufacturer, targetLang, 'attribute-groups.json'),
    attributes: loadDictionary<Record<string, string>>(manufacturer, targetLang, 'attributes.json'),
    variants: loadDictionary<Record<string, string>>(manufacturer, targetLang, 'variants.json'),
    descriptions: loadDictionary<Record<string, string[]>>(manufacturer, targetLang, 'descriptions.json'),
    categories: loadDictionary<Record<string, string>>(manufacturer, targetLang, 'categories.json'),
    attributeValues: loadDictionary<Record<string, Record<string, string>>>(
      manufacturer,
      targetLang,
      'attribute-values.json'
    )
  };
  console.log('✓ Dictionaries loaded\n');

  // Get source products directory
  const sourceProductsDir = manufacturer
    ? path.join(projectRoot, 'src', 'content', 'products', manufacturer, sourceLang)
    : path.join(projectRoot, 'src', 'content', 'products', sourceLang);
  if (!fs.existsSync(sourceProductsDir)) {
    throw new Error(`Source products directory not found: ${sourceProductsDir}`);
  }

  // Get target products directory
  const targetProductsDir = manufacturer
    ? path.join(projectRoot, 'src', 'content', 'products', manufacturer, targetLang)
    : path.join(projectRoot, 'src', 'content', 'products', targetLang);
  if (!fs.existsSync(targetProductsDir)) {
    fs.mkdirSync(targetProductsDir, { recursive: true });
  }

  // Get all product files
  const productFiles = fs.readdirSync(sourceProductsDir).filter(file => file.endsWith('.json'));
  console.log(`Found ${productFiles.length} products to translate\n`);

  let successCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const file of productFiles) {
    try {
      const sourceFilePath = path.join(sourceProductsDir, file);
      const targetFilePath = path.join(targetProductsDir, file);

      // Check if target file already exists
      if (fs.existsSync(targetFilePath)) {
        console.log(`⊘ ${file} - already exists, skipping`);
        skippedCount++;
        continue;
      }

      // Load source product
      const sourceProduct: Product = JSON.parse(fs.readFileSync(sourceFilePath, 'utf-8'));

      // Translate product using library function
      const translatedProduct = translateProduct(sourceProduct, targetLang, dictionaries);

      // Save translated product
      fs.writeFileSync(targetFilePath, JSON.stringify(translatedProduct, null, 2) + '\n');

      console.log(`✓ ${file}`);
      successCount++;
    } catch (error) {
      console.error(`✗ ${file}: ${error instanceof Error ? error.message : String(error)}`);
      errorCount++;
      throw error;
    }
  }

  console.log(`\n✓ Translation complete: ${successCount} products translated, ${skippedCount} skipped`);

  if (errorCount > 0) {
    throw new Error(`Translation failed with ${errorCount} error(s)`);
  }
}

/**
 * Translate all categories from source language to target language using dictionaries
 */
async function translateCategories(
  manufacturer: string,
  sourceLang: string,
  targetLang: string
): Promise<void> {
  console.log(`\nTranslating ${manufacturer} categories from ${sourceLang} to ${targetLang}...\n`);

  // Load categories dictionary for target language
  console.log('Loading categories dictionary...');
  const categoriesDict = loadDictionary<Record<string, string>>(
    manufacturer,
    targetLang,
    'categories.json'
  );
  console.log('✓ Dictionary loaded\n');

  // Get source categories directory
  const sourceCategoriesDir = manufacturer
    ? path.join(projectRoot, 'src', 'content', 'categories', manufacturer, sourceLang)
    : path.join(projectRoot, 'src', 'content', 'categories', sourceLang);
  if (!fs.existsSync(sourceCategoriesDir)) {
    console.log(`Source categories directory not found: ${sourceCategoriesDir}, skipping categories`);
    return;
  }

  // Get target categories directory
  const targetCategoriesDir = manufacturer
    ? path.join(projectRoot, 'src', 'content', 'categories', manufacturer, targetLang)
    : path.join(projectRoot, 'src', 'content', 'categories', targetLang);
  if (!fs.existsSync(targetCategoriesDir)) {
    fs.mkdirSync(targetCategoriesDir, { recursive: true });
  }

  // Get all category files
  const categoryFiles = fs.readdirSync(sourceCategoriesDir).filter(file => file.endsWith('.json'));
  console.log(`Found ${categoryFiles.length} categories to translate\n`);

  let successCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const file of categoryFiles) {
    try {
      const sourceFilePath = path.join(sourceCategoriesDir, file);
      const targetFilePath = path.join(targetCategoriesDir, file);

      // Check if target file already exists
      if (fs.existsSync(targetFilePath)) {
        console.log(`⊘ ${file} - already exists, skipping`);
        skippedCount++;
        continue;
      }

      // Load source category
      const sourceCategory: Category = JSON.parse(fs.readFileSync(sourceFilePath, 'utf-8'));

      // Translate category using library function
      const translatedCategory = translateCategory(sourceCategory, targetLang, categoriesDict);

      // Save translated category
      fs.writeFileSync(targetFilePath, JSON.stringify(translatedCategory, null, 2) + '\n');

      console.log(`✓ ${file}`);
      successCount++;
    } catch (error) {
      console.error(`✗ ${file}: ${error instanceof Error ? error.message : String(error)}`);
      errorCount++;
      throw error;
    }
  }

  console.log(
    `\n✓ Categories translation complete: ${successCount} categories translated, ${skippedCount} skipped`
  );

  if (errorCount > 0) {
    throw new Error(`Categories translation failed with ${errorCount} error(s)`);
  }
}

/**
 * Update existing product translations with new dictionary entries
 */
async function updateProductTranslations(
  manufacturer: string,
  targetLang: string
): Promise<void> {
  console.log(
    `Updating ${manufacturer} ${targetLang} products with dictionary translations...\n`
  );

  // Load all dictionaries for target language
  console.log('Loading dictionaries...');
  const dictionaries: TranslationDictionaries = {
    attributeGroups: loadDictionary<Record<string, string>>(manufacturer, targetLang, 'attribute-groups.json'),
    attributes: loadDictionary<Record<string, string>>(manufacturer, targetLang, 'attributes.json'),
    variants: loadDictionary<Record<string, string>>(manufacturer, targetLang, 'variants.json'),
    descriptions: loadDictionary<Record<string, string[]>>(manufacturer, targetLang, 'descriptions.json'),
    categories: loadDictionary<Record<string, string>>(manufacturer, targetLang, 'categories.json'),
    attributeValues: loadDictionary<Record<string, Record<string, string>>>(
      manufacturer,
      targetLang,
      'attribute-values.json'
    )
  };
  console.log('✓ Dictionaries loaded\n');

  // Get target products directory
  const targetProductsDir = manufacturer
    ? path.join(projectRoot, 'src', 'content', 'products', manufacturer, targetLang)
    : path.join(projectRoot, 'src', 'content', 'products', targetLang);
  if (!fs.existsSync(targetProductsDir)) {
    throw new Error(`Target products directory not found: ${targetProductsDir}`);
  }

  // Get all product files
  const productFiles = fs.readdirSync(targetProductsDir).filter(file => file.endsWith('.json'));
  console.log(`Found ${productFiles.length} products to update\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const file of productFiles) {
    try {
      console.log(`Processing ${file}...`);
      const filePath = path.join(targetProductsDir, file);

      // Load existing product
      const existingProduct: Product = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      // Apply translations using library function
      const updatedProduct = applyTranslationsToProduct(existingProduct, dictionaries);

      // Save updated product
      fs.writeFileSync(filePath, JSON.stringify(updatedProduct, null, 2) + '\n');

      console.log(`✓ ${file} updated\n`);
      successCount++;
    } catch (error) {
      console.error(`✗ ${file}: ${error instanceof Error ? error.message : String(error)}\n`);
      errorCount++;
    }
  }

  console.log(`\n✓ Update complete: ${successCount} products updated`);

  if (errorCount > 0) {
    console.log(`⚠ ${errorCount} product(s) had errors`);
  }
}

/**
 * Auto-translate products using LLM with batching
 */
async function autoTranslateProducts(
  manufacturer: string,
  sourceLang: string,
  targetLang: string
): Promise<void> {
  console.log(
    `\n🚀 Auto-translating ${manufacturer} products from ${sourceLang} to ${targetLang} using Gondor...\n`
  );

  const progressPath = getProgressFilePath('product', manufacturer, sourceLang, targetLang);
  const progress = loadProgress(progressPath);

  // Get source products directory
  const sourceProductsDir = manufacturer
    ? path.join(projectRoot, 'src', 'content', 'products', manufacturer, sourceLang)
    : path.join(projectRoot, 'src', 'content', 'products', sourceLang);

  if (!fs.existsSync(sourceProductsDir)) {
    throw new Error(`Source products directory not found: ${sourceProductsDir}`);
  }

  // Get target products directory
  const targetProductsDir = manufacturer
    ? path.join(projectRoot, 'src', 'content', 'products', manufacturer, targetLang)
    : path.join(projectRoot, 'src', 'content', 'products', targetLang);

  if (!fs.existsSync(targetProductsDir)) {
    fs.mkdirSync(targetProductsDir, { recursive: true });
  }

  // Get all product files
  const productFiles = fs.readdirSync(sourceProductsDir).filter(file => file.endsWith('.json'));
  console.log(`Found ${productFiles.length} products to translate\n`);

  // Filter out already completed/failed items
  const filesToProcess = productFiles.filter(file => {
    const data = JSON.parse(fs.readFileSync(path.join(sourceProductsDir, file), 'utf-8'));
    const id = data.id;
    return !progress.completed.includes(id) && !progress.failed.some(f => f.id === id);
  });

  console.log(`${filesToProcess.length} products need translation\n`);

  // Process products one at a time to save progress incrementally
  let processedCount = 0;

  for (const file of filesToProcess) {
    const product: Product = JSON.parse(fs.readFileSync(path.join(sourceProductsDir, file), 'utf-8'));
    
    console.log(`\nTranslating product ${processedCount + 1}/${filesToProcess.length}: ${product.name || product.id}...`);

    try {
      // Translate single product
      const translatedProduct = (await batchTranslateProducts([product], targetLang, sourceLang))[0];
      
      // Save translated product
      const targetFilePath = path.join(targetProductsDir, file);
      fs.writeFileSync(targetFilePath, JSON.stringify(translatedProduct, null, 2) + '\n');

      // Mark as completed and save progress immediately
      progress.completed.push(translatedProduct.id);
      saveProgress(progressPath, progress);
      processedCount++;
      
      console.log(`✓ Completed (${processedCount}/${filesToProcess.length})`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`✗ Error translating product: ${errorMsg}`);

      // Mark as failed
      if (!progress.failed.some(f => f.id === product.id)) {
        progress.failed.push({ id: product.id, error: errorMsg });
      }
      saveProgress(progressPath, progress);
      
      // Continue with next product instead of failing entire batch
      console.log(`Skipping to next product...`);
    }
  }

  console.log(
    `\n✓ Auto-translation complete: ${processedCount} products translated, ${progress.completed.length} total`
  );

  if (progress.failed.length === 0) {
    clearProgress(progressPath);
  } else {
    console.log(`\n⚠ ${progress.failed.length} product(s) failed. To retry, run the command again.`);
  }
}

/**
 * Auto-translate categories using LLM with batching
 */
async function autoTranslateCategories(
  manufacturer: string,
  sourceLang: string,
  targetLang: string
): Promise<void> {
  console.log(
    `\nAuto-translating ${manufacturer} categories from ${sourceLang} to ${targetLang}...\n`
  );

  const progressPath = getProgressFilePath('category', manufacturer, sourceLang, targetLang);
  const progress = loadProgress(progressPath);

  // Get source categories directory
  const sourceCategoriesDir = manufacturer
    ? path.join(projectRoot, 'src', 'content', 'categories', manufacturer, sourceLang)
    : path.join(projectRoot, 'src', 'content', 'categories', sourceLang);

  if (!fs.existsSync(sourceCategoriesDir)) {
    console.log(`Source categories directory not found: ${sourceCategoriesDir}, skipping categories`);
    return;
  }

  // Get target categories directory
  const targetCategoriesDir = manufacturer
    ? path.join(projectRoot, 'src', 'content', 'categories', manufacturer, targetLang)
    : path.join(projectRoot, 'src', 'content', 'categories', targetLang);

  if (!fs.existsSync(targetCategoriesDir)) {
    fs.mkdirSync(targetCategoriesDir, { recursive: true });
  }

  // Get all category files
  const categoryFiles = fs.readdirSync(sourceCategoriesDir).filter(file => file.endsWith('.json'));
  console.log(`Found ${categoryFiles.length} categories to translate\n`);

  // Filter out already completed/failed items
  const filesToProcess = categoryFiles.filter(file => {
    const data = JSON.parse(fs.readFileSync(path.join(sourceCategoriesDir, file), 'utf-8'));
    const id = data.id;
    return !progress.completed.includes(id) && !progress.failed.some(f => f.id === id);
  });

  console.log(`${filesToProcess.length} categories need translation\n`);

  // Process in batches of 100 categories per API call
  const BATCH_SIZE = 100;
  let processedCount = 0;

  for (let batchStart = 0; batchStart < filesToProcess.length; batchStart += BATCH_SIZE) {
    const batchFiles = filesToProcess.slice(batchStart, batchStart + BATCH_SIZE);
    const batchCategories: Array<Category & { __filename: string }> = batchFiles.map(file => ({
      ...JSON.parse(fs.readFileSync(path.join(sourceCategoriesDir, file), 'utf-8')),
      __filename: file
    }));

    console.log(`\nProcessing batch ${Math.floor(batchStart / BATCH_SIZE) + 1} (${batchCategories.length} categories)...`);

    try {
      // Translate entire batch in one API call
      const translatedBatch = await batchTranslateCategories(
        batchCategories.map(c => {
          const { __filename, ...cat } = c;
          return cat;
        }),
        targetLang,
        sourceLang
      );

      // Save each translated category and update progress
      for (let i = 0; i < translatedBatch.length; i++) {
        const translated = translatedBatch[i];
        const filename = batchCategories[i].__filename;
        const targetFilePath = path.join(targetCategoriesDir, filename);

        fs.writeFileSync(targetFilePath, JSON.stringify(translated, null, 2) + '\n');

        // Mark as completed
        progress.completed.push(translated.id);
        saveProgress(progressPath, progress);
        processedCount++;
      }

      console.log(`✓ Batch complete. Saved ${translatedBatch.length} categories`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`✗ Error translating batch: ${errorMsg}`);

      // Mark all categories in batch as failed
      for (const category of batchCategories) {
        if (!progress.failed.some(f => f.id === category.id)) {
          progress.failed.push({ id: category.id, error: errorMsg });
        }
      }
      saveProgress(progressPath, progress);

      // Don't continue on batch error
      throw error;
    }
  }

  console.log(
    `\n✓ Auto-translation complete: ${processedCount} categories translated, ${progress.completed.length} total`
  );

  if (progress.failed.length === 0) {
    clearProgress(progressPath);
  } else {
    console.log(`\n⚠ ${progress.failed.length} category(ies) failed. To retry, run the command again.`);
  }
}

/**
 * CLI handler for translation commands
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'update') {
    const manufacturer = args[1];
    const targetLang = args[2] || args[1] || 'pl';

    // If only one arg after 'update', treat it as targetLang (legacy)
    if (args.length === 2) {
      await updateProductTranslations('', args[1]);
    } else {
      if (!manufacturer) {
        console.error('Error: Manufacturer is required');
        console.error('Usage: npm run translations:update -- <manufacturer> <targetLang>');
        console.error('   or: npm run translations:update -- <targetLang> (legacy)');
        process.exit(1);
      }
      await updateProductTranslations(manufacturer, targetLang);
    }
  } else if (command === 'auto') {
    // Auto-translate using LLM
    if (args.length === 3) {
      // Legacy format: sourceLang targetLang
      const sourceLang = args[1];
      const targetLang = args[2];
      await autoTranslateProducts('', sourceLang, targetLang);
      await autoTranslateCategories('', sourceLang, targetLang);
    } else if (args.length === 4) {
      // New format: manufacturer sourceLang targetLang
      const manufacturer = args[1];
      const sourceLang = args[2];
      const targetLang = args[3];
      await autoTranslateProducts(manufacturer, sourceLang, targetLang);
      await autoTranslateCategories(manufacturer, sourceLang, targetLang);
    } else {
      console.error('Error: Invalid arguments');
      console.error('Usage: npm run translations:auto -- <manufacturer> <sourceLang> <targetLang>');
      console.error('   or: npm run translations:auto -- <sourceLang> <targetLang> (legacy)');
      process.exit(1);
    }
  } else {
    // Check if args match old format: <sourceLang> <targetLang>
    // or new format: <manufacturer> <sourceLang> <targetLang>
    if (args.length === 2) {
      // Legacy format: sourceLang targetLang
      const sourceLang = args[0];
      const targetLang = args[1];
      await translateProducts('', sourceLang, targetLang);
      await translateCategories('', sourceLang, targetLang);
    } else if (args.length === 3) {
      // New format: manufacturer sourceLang targetLang
      const manufacturer = args[0];
      const sourceLang = args[1];
      const targetLang = args[2];
      await translateProducts(manufacturer, sourceLang, targetLang);
      await translateCategories(manufacturer, sourceLang, targetLang);
    } else {
      console.error('Error: Invalid arguments');
      console.error('Usage: npm run translations:init -- <manufacturer> <sourceLang> <targetLang>');
      console.error('   or: npm run translations:init -- <sourceLang> <targetLang> (legacy)');
      console.error('   or: npm run translations:update -- <manufacturer> <targetLang>');
      console.error('   or: npm run translations:update -- <targetLang> (legacy)');
      console.error('   or: npm run translations:auto -- <manufacturer> <sourceLang> <targetLang>');
      console.error('   or: npm run translations:auto -- <sourceLang> <targetLang> (legacy)');
      process.exit(1);
    }
  }
}

main().catch((error) => {
  console.error('\nError:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
