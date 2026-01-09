# Marttiini Product Collections - Implementation Summary

## Overview

Marttiini-specific product data is now isolated in its own manufacturer directory with custom loaders that automatically split JSONL data into Astro collections.

## File Structure

```
src/
├── loaders/
│   └── marttiini/
│       ├── index.ts                      # Public exports
│       ├── loader.ts                     # Custom Astro loader
│       └── utils/
│           ├── jsonlParser.ts            # JSONL parsing & validation
│           └── productTransformers.ts    # Data transformations
├── types/
│   └── marttiini/
│       └── product.ts                    # TypeScript interfaces
├── libs/
│   ├── marttiini.ts                      # Marttiini-specific helpers
│   └── products.ts                       # Generic multi-manufacturer interface
└── raw/
    └── marttiini/
        └── products.jsonl                # Source data (166 products)
```

## Collections Created

### 1. `marttiiniProducts` (Base)
- **Content**: SKU, URLs, images, active status, category_slug
- **Count**: 166 products
- **No duplication**: Language-agnostic data stored once

### 2. `marttiiniProductsI18nEn` (English Translations)
- **Content**: Names, descriptions, slugs, categories, attributes
- **Count**: 166 translations
- **ID format**: `marttiini/en/{sku}`

### 3. `marttiiniProductsI18nPl` (Polish Translations)
- **Content**: Names, descriptions, slugs, categories, attributes
- **Count**: 166 translations
- **ID format**: `marttiini/pl/{sku}`

## Data Efficiency

### Before (single collection approach):
- 166 products × 2 languages × ~7 images = ~2,324 image URL entries
- All metadata duplicated per language

### After (split collections):
- 166 products × 7 images = ~1,162 image URL entries
- **50% reduction in duplicate data**
- URLs, active status, category_slugs stored once

## Usage Examples

### Marttiini-Specific API

```typescript
import {
  getMarttiiniProduct,
  getAllMarttiiniProducts,
  getMarttiiniProductsByCategory,
  getActiveMarttiiniProducts,
  getMarttiiniCategories,
  searchMarttiiniProducts,
  type FullMarttiiniProduct
} from '@/libs/marttiini';

// Single product
const knife = await getMarttiiniProduct('131030', 'en');
// Returns: FullMarttiiniProduct with base + translation merged

// All products
const products = await getAllMarttiiniProducts('pl');

// By category
const outdoor = await getMarttiiniProductsByCategory('outdoor', 'en');

// Only active
const active = await getActiveMarttiiniProducts('en');

// Categories with counts
const categories = await getMarttiiniCategories('en');
// Returns: [{ slug: 'outdoor', name: 'Outdoor', count: 45 }, ...]

// Search
const results = await searchMarttiiniProducts('lynx', 'en');
```

### Generic Multi-Manufacturer API

```typescript
import {
  getProduct,
  getAllProducts,
  getProductsByCategory,
  searchProducts
} from '@/libs/products';

// Works with any manufacturer
const product = await getProduct('marttiini', '131030', 'en');
const products = await getAllProducts('marttiini', 'pl');
const search = await searchProducts('knife', 'en', 'marttiini');
```

## How It Works

1. **Build Time**: Astro runs custom loader `marttiiniProductLoader`
2. **Read Source**: Loader reads `raw/marttiini/products.jsonl`
3. **Parse & Validate**: 166 products parsed and validated
4. **Split Data**: 
   - Base data → `marttiiniProducts` collection
   - EN translations → `marttiiniProductsI18nEn` collection  
   - PL translations → `marttiiniProductsI18nPl` collection
5. **Query Time**: Helper functions merge base + translation automatically

## Benefits

✅ **Zero Manual Sync**: Update JSONL, rebuild → collections updated  
✅ **50% Less Data**: Images & metadata stored once  
✅ **Type-Safe**: Full TypeScript coverage  
✅ **Manufacturer-Isolated**: Easy to add new brands  
✅ **Efficient Queries**: Fast lookups with Astro's content layer  
✅ **Search-Ready**: Full-text search across all fields  
✅ **Category Aggregation**: Auto-count products per category

## Adding Another Manufacturer

To add a new manufacturer (e.g., "Benchmade"):

1. **Create loader structure**:
   ```
   src/loaders/benchmade/
   ├── index.ts
   ├── loader.ts
   └── utils/
   ```

2. **Add types**:
   ```
   src/types/benchmade/product.ts
   ```

3. **Create helper lib**:
   ```
   src/libs/benchmade.ts
   ```

4. **Add source data**:
   ```
   raw/benchmade/products.jsonl
   ```

5. **Register collections** in `content.config.ts`:
   ```typescript
   import { createBenchmadeLoader } from './loaders/benchmade';
   
   const benchmadeProducts = defineCollection({
     schema: z.object({...}),
     loader: createBenchmadeLoader('base'),
   });
   ```

6. **Update generic router** in `src/libs/products.ts`:
   ```typescript
   case 'benchmade':
     const { getBenchmadeProduct } = await import('./benchmade');
     return getBenchmadeProduct(sku, lang);
   ```

Each manufacturer remains completely isolated with no conflicts!
