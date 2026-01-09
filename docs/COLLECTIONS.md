# Product Collections

This project uses a manufacturer-specific modular loader system for efficient product data management.

## Architecture

### Data Flow
```
raw/marttiini/products.jsonl (source)
         ↓
  Marttiini Loader (splits data)
    ↙              ↘
Base Products    Translations (EN/PL)
(images, URLs)   (names, descriptions)
```

### Collections

#### 1. `marttiiniProducts` (Base Products)
- **Data**: SKU, images, URLs, active status, category_slug
- **Purpose**: Language-agnostic Marttiini product data (no duplication)
- **Loader**: `marttiiniProductLoader` with `type: 'base'`

#### 2. `marttiiniProductsI18nEn` / `marttiiniProductsI18nPl` (Translations)
- **Data**: Names, descriptions, attributes, slugs
- **Purpose**: Language-specific content
- **Loader**: `marttiiniProductLoader` with `type: 'i18n'`, `lang: 'en'|'pl'`

## File Structure

```
src/
├── types/
│   └── marttiini/
│       └── product.ts                    # Marttiini-specific types
├── loaders/
│   └── marttiini/
│       ├── loader.ts                     # Main Marttiini loader
│       └── utils/
│           ├── jsonlParser.ts            # JSONL parsing
│           └── productTransformers.ts    # Data transformations
├── libs/
│   └── products.ts                       # Marttiini helper functions
├── content.config.ts                     # Collection definitions
└── raw/
    └── marttiini/
        └── products.jsonl                # Source data

```

## Usage

### Manufacturer-Specific (Recommended)

```typescript
// Direct import for Marttiini products
import {
  getMarttiiniProduct,
  getAllMarttiiniProducts,
  getMarttiiniProductsByCategory,
  getActiveMarttiiniProducts,
  getMarttiiniCategories,
  searchMarttiiniProducts
} from '@/libs/marttiini';

// Get single product
const product = await getMarttiiniProduct('131030', 'en');

// Get all products
const products = await getAllMarttiiniProducts('en');

// Get products by category
const outdoorKnives = await getMarttiiniProductsByCategory('outdoor', 'en');

// Get only active products
const activeProducts = await getActiveMarttiiniProducts('pl');

// Get categories with counts
const categories = await getMarttiiniCategories('en');

// Search products
const searchResults = await searchMarttiiniProducts('lynx', 'en');
```

### Generic Interface (Multi-Manufacturer)

```typescript
// Generic import for any manufacturer
import {
  getProduct,
  getAllProducts,
  getProductsByCategory,
  searchProducts
} from '@/libs/products';

// Works with any manufacturer
const product = await getProduct('marttiini', '131030', 'en');
const products = await getAllProducts('marttiini', 'en');
const search = await searchProducts('knife', 'en', 'marttiini');
```

### Direct Collection Access

```typescript
import { getEntry, getCollection } from 'astro:content';

// Get base product
const base = await getEntry('marttiiniProducts', '131030');

// Get translation
const translation = await getEntry('marttiiniProductsI18nEn', 'marttiini/en/131030');

// Combine manually
const product = { ...base.data, ...translation.data };
```

## Benefits

✅ **Manufacturer-Specific**: Each manufacturer has its own loader/types  
✅ **No Data Duplication**: Images and URLs stored once  
✅ **Automatic Updates**: Changes to JSONL reflected immediately  
✅ **Type Safety**: Full TypeScript support per manufacturer  
✅ **Scalable**: Easy to add new manufacturers  
✅ **Performance**: Efficient queries with Astro's content layer

## Adding New Manufacturers

1. Create manufacturer directory structure:
```
src/
├── types/
│   └── newbrand/
│       └── product.ts
└── loaders/
    └── newbrand/
        ├── loader.ts
        └── utils/
            ├── jsonlParser.ts
            └── productTransformers.ts
```

2. Add collections in `content.config.ts`:
```typescript
import { createNewBrandLoader } from './loaders/newbrand/loader';

const newbrandProducts = defineCollection({
    schema: z.object({...}),
    loader: createNewBrandLoader('base'),
});
```

3. Create helper functions in `src/libs/products.ts`:
```typescript
export async function getNewBrandProduct(sku: string, lang: string) {
  // Implementation
}
```
