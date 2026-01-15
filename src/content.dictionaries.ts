import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {
  sortKeys,
  buildAttributeGroupsDictionary,
  buildAttributesDictionary,
  buildVariantsDictionary,
  buildDescriptionsDictionary,
  buildCategoriesDictionary,
  buildAttributeValuesDictionary,
  synchronizeDictionaries,
  type Dictionary,
  type DescriptionsDictionary,
  type AttributeValuesDictionary,
  type Product
} from './libs/dictionaries.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

/**
 * Load and build attribute groups dictionary from all products in a given language
 */
async function loadAndBuildAttributeGroupsDictionary(manufacturer: string, language: string): Promise<Dictionary> {
  const productsDir = manufacturer
    ? path.join(projectRoot, 'src', 'content', 'products', manufacturer, language)
    : path.join(projectRoot, 'src', 'content', 'products', language);

  // Load existing dictionary if it exists
  let existingDictionary: Dictionary = {};
  const dictionaryPath = manufacturer
    ? path.join(projectRoot, 'src', 'content', 'dictionaries', manufacturer, language, 'attribute-groups.json')
    : path.join(projectRoot, 'src', 'content', 'dictionaries', language, 'attribute-groups.json');
  if (fs.existsSync(dictionaryPath)) {
    existingDictionary = JSON.parse(fs.readFileSync(dictionaryPath, 'utf-8'));
  }

  // Load products
  const products: Product[] = [];
  if (fs.existsSync(productsDir)) {
    const files = fs.readdirSync(productsDir).filter(file => file.endsWith('.json'));
    for (const file of files) {
      const filePath = path.join(productsDir, file);
      const product: Product = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      products.push(product);
    }
  }

  return buildAttributeGroupsDictionary(products, existingDictionary);
}

/**
 * Load and build attributes dictionary from all products in a given language
 */
async function loadAndBuildAttributesDictionary(manufacturer: string, language: string): Promise<Dictionary> {
  const productsDir = manufacturer
    ? path.join(projectRoot, 'src', 'content', 'products', manufacturer, language)
    : path.join(projectRoot, 'src', 'content', 'products', language);

  // Load existing dictionary if it exists
  let existingDictionary: Dictionary = {};
  const dictionaryPath = manufacturer
    ? path.join(projectRoot, 'src', 'content', 'dictionaries', manufacturer, language, 'attributes.json')
    : path.join(projectRoot, 'src', 'content', 'dictionaries', language, 'attributes.json');
  if (fs.existsSync(dictionaryPath)) {
    existingDictionary = JSON.parse(fs.readFileSync(dictionaryPath, 'utf-8'));
  }

  // Load products
  const products: Product[] = [];
  if (fs.existsSync(productsDir)) {
    const files = fs.readdirSync(productsDir).filter(file => file.endsWith('.json'));
    for (const file of files) {
      const filePath = path.join(productsDir, file);
      const product: Product = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      products.push(product);
    }
  }

  return buildAttributesDictionary(products, existingDictionary);
}

/**
 * Load and build variants dictionary from all products in a given language
 */
async function loadAndBuildVariantsDictionary(manufacturer: string, language: string): Promise<Dictionary> {
  const productsDir = manufacturer
    ? path.join(projectRoot, 'src', 'content', 'products', manufacturer, language)
    : path.join(projectRoot, 'src', 'content', 'products', language);

  // Load existing dictionary if it exists
  let existingDictionary: Dictionary = {};
  const dictionaryPath = manufacturer
    ? path.join(projectRoot, 'src', 'content', 'dictionaries', manufacturer, language, 'variants.json')
    : path.join(projectRoot, 'src', 'content', 'dictionaries', language, 'variants.json');
  if (fs.existsSync(dictionaryPath)) {
    existingDictionary = JSON.parse(fs.readFileSync(dictionaryPath, 'utf-8'));
  }

  // Load products
  const products: Product[] = [];
  if (fs.existsSync(productsDir)) {
    const files = fs.readdirSync(productsDir).filter(file => file.endsWith('.json'));
    for (const file of files) {
      const filePath = path.join(productsDir, file);
      const product: Product = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      products.push(product);
    }
  }

  return buildVariantsDictionary(products, existingDictionary);
}

/**
 * Load and build descriptions dictionary from all products in a given language
 */
async function loadAndBuildDescriptionsDictionary(manufacturer: string, language: string): Promise<DescriptionsDictionary> {
  const productsDir = manufacturer
    ? path.join(projectRoot, 'src', 'content', 'products', manufacturer, language)
    : path.join(projectRoot, 'src', 'content', 'products', language);

  // Load existing dictionary if it exists
  let existingDictionary: DescriptionsDictionary = {};
  const dictionaryPath = manufacturer
    ? path.join(projectRoot, 'src', 'content', 'dictionaries', manufacturer, language, 'descriptions.json')
    : path.join(projectRoot, 'src', 'content', 'dictionaries', language, 'descriptions.json');
  if (fs.existsSync(dictionaryPath)) {
    existingDictionary = JSON.parse(fs.readFileSync(dictionaryPath, 'utf-8'));
  }

  // Load products
  const products: Product[] = [];
  if (fs.existsSync(productsDir)) {
    const files = fs.readdirSync(productsDir).filter(file => file.endsWith('.json'));
    for (const file of files) {
      const filePath = path.join(productsDir, file);
      const product: Product = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      products.push(product);
    }
  }

  return buildDescriptionsDictionary(products, existingDictionary);
}

/**
 * Load and build categories dictionary from scraped categories JSONL file
 */
async function loadAndBuildCategoriesDictionary(manufacturer: string, language: string): Promise<Dictionary> {
  const scrapedCategoriesPath = manufacturer
    ? path.join(projectRoot, 'scraped', manufacturer, 'categories.jsonl')
    : path.join(projectRoot, 'scraped', 'categories.jsonl');

  // Load existing dictionary if it exists
  let existingDictionary: Dictionary = {};
  const dictionaryPath = manufacturer
    ? path.join(projectRoot, 'src', 'content', 'dictionaries', manufacturer, language, 'categories.json')
    : path.join(projectRoot, 'src', 'content', 'dictionaries', language, 'categories.json');
  if (fs.existsSync(dictionaryPath)) {
    existingDictionary = JSON.parse(fs.readFileSync(dictionaryPath, 'utf-8'));
  }

  // Read categories from scraped JSONL file
  const categories: Array<{ id: string; name: string }> = [];
  if (fs.existsSync(scrapedCategoriesPath)) {
    const content = fs.readFileSync(scrapedCategoriesPath, 'utf-8');
    const lines = content.trim().split('\n');

    for (const line of lines) {
      if (line.trim()) {
        const category = JSON.parse(line);
        categories.push(category);
      }
    }
  }

  return buildCategoriesDictionary(categories, existingDictionary);
}

/**
 * Load and build attribute values dictionary from all products in a given language
 */
async function loadAndBuildAttributeValuesDictionary(manufacturer: string, language: string): Promise<AttributeValuesDictionary> {
  const productsDir = manufacturer
    ? path.join(projectRoot, 'src', 'content', 'products', manufacturer, language)
    : path.join(projectRoot, 'src', 'content', 'products', language);

  // Load existing dictionary if it exists
  let existingDictionary: AttributeValuesDictionary = {};
  const dictionaryPath = manufacturer
    ? path.join(projectRoot, 'src', 'content', 'dictionaries', manufacturer, language, 'attribute-values.json')
    : path.join(projectRoot, 'src', 'content', 'dictionaries', language, 'attribute-values.json');
  if (fs.existsSync(dictionaryPath)) {
    existingDictionary = JSON.parse(fs.readFileSync(dictionaryPath, 'utf-8'));
  }

  // Load products
  const products: Product[] = [];
  if (fs.existsSync(productsDir)) {
    const files = fs.readdirSync(productsDir).filter(file => file.endsWith('.json'));
    for (const file of files) {
      const filePath = path.join(productsDir, file);
      const product: Product = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      products.push(product);
    }
  }

  return buildAttributeValuesDictionary(products, existingDictionary);
}

/**
 * Generate and save all dictionaries for a given language
 */
export async function generateDictionaries(manufacturer: string, language: string): Promise<void> {
  const dictDir = manufacturer
    ? path.join(projectRoot, 'src', 'content', 'dictionaries', manufacturer, language)
    : path.join(projectRoot, 'src', 'content', 'dictionaries', language);

  // Ensure directory exists
  if (!fs.existsSync(dictDir)) {
    fs.mkdirSync(dictDir, { recursive: true });
  }

  // Build and save each dictionary
  const attributeGroups = await loadAndBuildAttributeGroupsDictionary(manufacturer, language);
  fs.writeFileSync(
    path.join(dictDir, 'attribute-groups.json'),
    JSON.stringify(sortKeys(attributeGroups), null, 4) + '\n'
  );

  const attributes = await loadAndBuildAttributesDictionary(manufacturer, language);
  fs.writeFileSync(
    path.join(dictDir, 'attributes.json'),
    JSON.stringify(sortKeys(attributes), null, 4) + '\n'
  );

  const variants = await loadAndBuildVariantsDictionary(manufacturer, language);
  fs.writeFileSync(
    path.join(dictDir, 'variants.json'),
    JSON.stringify(sortKeys(variants), null, 4) + '\n'
  );

  const descriptions = await loadAndBuildDescriptionsDictionary(manufacturer, language);
  fs.writeFileSync(
    path.join(dictDir, 'descriptions.json'),
    JSON.stringify(sortKeys(descriptions), null, 4) + '\n'
  );

  const categories = await loadAndBuildCategoriesDictionary(manufacturer, language);
  fs.writeFileSync(
    path.join(dictDir, 'categories.json'),
    JSON.stringify(sortKeys(categories), null, 4) + '\n'
  );

  const attributeValues = await loadAndBuildAttributeValuesDictionary(manufacturer, language);
  fs.writeFileSync(
    path.join(dictDir, 'attribute-values.json'),
    JSON.stringify(sortKeys(attributeValues), null, 4) + '\n'
  );

  if (manufacturer) {
    console.log(`✓ Dictionaries generated for manufacturer: ${manufacturer}, language: ${language}`);
  } else {
    console.log(`✓ Dictionaries generated for language: ${language}`);
  }
}

/**
 * Synchronize dictionaries from source language to target language
 * Only adds missing keys, does not overwrite existing ones
 */
export async function synchronize(manufacturer: string, sourceLang: string, targetLang: string): Promise<void> {
  const sourceDictDir = manufacturer
    ? path.join(projectRoot, 'src', 'content', 'dictionaries', manufacturer, sourceLang)
    : path.join(projectRoot, 'src', 'content', 'dictionaries', sourceLang);
  const targetDictDir = manufacturer
    ? path.join(projectRoot, 'src', 'content', 'dictionaries', manufacturer, targetLang)
    : path.join(projectRoot, 'src', 'content', 'dictionaries', targetLang);

  // Validate source directory exists
  if (!fs.existsSync(sourceDictDir)) {
    console.error(`❌ Error: Source dictionary directory not found: ${sourceDictDir}`);
    console.error(`   Expected path for manufacturer: "${manufacturer}" and language: "${sourceLang}"`);
    process.exit(1);
  }

  // Ensure target directory exists
  if (!fs.existsSync(targetDictDir)) {
    fs.mkdirSync(targetDictDir, { recursive: true });
  }

  // List of dictionary files to synchronize
  const dictionaryFiles = [
    'attribute-groups.json',
    'attributes.json',
    'variants.json',
    'descriptions.json',
    'categories.json',
    'attribute-values.json'
  ];

  if (manufacturer) {
    console.log(`Synchronizing ${manufacturer} dictionaries from ${sourceLang} to ${targetLang}...\n`);
  } else {
    console.log(`Synchronizing dictionaries from ${sourceLang} to ${targetLang}...\n`);
  }

  // Validate that all expected source files exist before starting sync
  const missingFiles: string[] = [];
  for (const fileName of dictionaryFiles) {
    const sourceFile = path.join(sourceDictDir, fileName);
    if (!fs.existsSync(sourceFile)) {
      missingFiles.push(fileName);
    }
  }

  if (missingFiles.length > 0) {
    console.error(`❌ Error: Missing source dictionary files:`);
    missingFiles.forEach(file => {
      console.error(`   - ${path.join(sourceDictDir, file)}`);
    });
    console.error(`\n   Please run 'make dictionaries-build' first to generate the source dictionaries.`);
    process.exit(1);
  }

  // Synchronize all files
  for (const fileName of dictionaryFiles) {
    const sourceFile = path.join(sourceDictDir, fileName);
    const targetFile = path.join(targetDictDir, fileName);

    // Load source dictionary
    const sourceDict = JSON.parse(fs.readFileSync(sourceFile, 'utf-8'));

    // Load target dictionary or create empty one
    let targetDict: any = {};
    if (fs.existsSync(targetFile)) {
      targetDict = JSON.parse(fs.readFileSync(targetFile, 'utf-8'));
    }

    // Synchronize using library function
    const { updated, addedCount } = synchronizeDictionaries(sourceDict, targetDict);

    // Save synchronized target dictionary
    fs.writeFileSync(
      targetFile,
      JSON.stringify(sortKeys(updated), null, 4) + '\n'
    );

    if (addedCount > 0) {
      console.log(`✓ ${fileName}: added ${addedCount} new key(s)`);
    } else {
      console.log(`✓ ${fileName}: up to date`);
    }
  }

  console.log(`\n✓ Synchronization complete: ${sourceLang} → ${targetLang}`);
}

/**
 * Find all manufacturers (subdirectories) in the scraped folder
 */
function findManufacturers(): string[] {
  const scrapedPath = path.resolve(projectRoot, 'scraped');
  
  if (!fs.existsSync(scrapedPath)) {
    return [];
  }
  
  // Check if using legacy structure (files directly in scraped folder)
  const hasLegacyFiles = fs.readdirSync(scrapedPath)
    .some(item => item.endsWith('.jsonl'));
  
  if (hasLegacyFiles) {
    // Legacy structure: use empty string to represent no manufacturer subfolder
    return [''];
  }
  
  // New structure: return subdirectories as manufacturers
  return fs.readdirSync(scrapedPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}

// Main entry point for CLI execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'sync') {
    // Synchronize mode with two formats:
    // New: dictionaries:sync <manufacturer> <sourceLang> <targetLang>
    // Legacy: dictionaries:sync <sourceLang> <targetLang>
    if (args.length === 3) {
      // Legacy format: sourceLang targetLang
      const sourceLang = args[1];
      const targetLang = args[2];
      await synchronize('', sourceLang, targetLang);
    } else if (args.length === 4) {
      // New format: manufacturer sourceLang targetLang
      const manufacturer = args[1];
      const sourceLang = args[2];
      const targetLang = args[3];
      await synchronize(manufacturer, sourceLang, targetLang);
    } else {
      console.error('Error: Invalid arguments');
      console.error('Usage: npm run dictionaries:sync -- <manufacturer> <sourceLang> <targetLang>');
      console.error('   or: npm run dictionaries:sync -- <sourceLang> <targetLang> (legacy)');
      process.exit(1);
    }
  } else {
    // Generate mode: build dictionaries for manufacturers and languages found in scraped products
    const manufacturers = findManufacturers();
    
    if (manufacturers.length === 0) {
      console.error('Error: No manufacturer directories found in scraped folder');
      process.exit(1);
    }

    console.log(`Found manufacturers: ${manufacturers.join(', ')}\n`);

    for (const manufacturer of manufacturers) {
      const scrapedProductsPath = path.resolve(projectRoot, 'scraped', manufacturer, 'products.jsonl');
      const languages = new Set<string>();

      if (fs.existsSync(scrapedProductsPath)) {
        const content = fs.readFileSync(scrapedProductsPath, 'utf-8');
        const lines = content.trim().split('\n');

        for (const line of lines) {
          if (line.trim()) {
            const product = JSON.parse(line);
            if (product.lang) {
              languages.add(product.lang);
            }
          }
        }
      }

      if (languages.size === 0) {
        console.warn(`No languages found in scraped products${manufacturer ? ` for ${manufacturer}` : ''}`);
        continue;
      }

      if (manufacturer) {
        console.log(`Generating dictionaries for ${manufacturer}, languages: ${Array.from(languages).join(', ')}`);
      } else {
        console.log(`Generating dictionaries for languages: ${Array.from(languages).join(', ')}`);
      }

      for (const language of languages) {
        await generateDictionaries(manufacturer, language);
      }
    }

    console.log('\n✓ All dictionaries generated successfully');
  }
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
