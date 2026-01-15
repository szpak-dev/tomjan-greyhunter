# Content Workflow Guide

This document explains the content pipeline for managing products, categories, dictionaries, and translations.

## Overview

The content system consists of three layers:

1. **Scraped Data** (`scraped/marttiini/`) - Raw JSONL files from web scraping
2. **Products** (`src/content/products/`) - Processed JSON products for each language
3. **Dictionaries** (`src/content/dictionaries/`) - Translation lookup tables for attributes, categories, and descriptions

## Workflow Commands

### 1. `make copy-scraped-data`
**Purpose**: Copy raw JSONL files from the scraping directory

- Copies `final_products.jsonl` → `scraped/marttiini/products.jsonl`
- Copies `final_categories.jsonl` → `scraped/marttiini/categories.jsonl`
- **Use when**: You have new/updated scraped data to process

### 2. `make load-contents`
**Purpose**: Transform and load products from scraped JSONL

- Reads raw JSONL from `scraped/marttiini/`
- Transforms and validates product data
- Creates `src/content/products/marttiini/en/` (English products)
- Creates `src/content/categories/marttiini/en/` (English categories)
- **Use when**: You have updated scraped data
- **Note**: Run after `make copy-scraped-data`

### 3. `make dictionaries-build`
**Purpose**: Extract dictionaries from source language products

- Analyzes all English products
- Extracts unique values for:
  - Attribute groups
  - Attributes
  - Variants
  - Product descriptions
  - Categories
  - Attribute values (per category)
- Creates `src/content/dictionaries/marttiini/en/`
- **Use when**: You have new products that need translation support
- **Note**: Run after `make load-contents`

### 4. `make dictionaries-sync`
**Purpose**: Synchronize dictionaries from source to target language

- Takes English dictionaries (`en`) as source
- Creates Polish dictionaries (`pl`) with same structure
- Adds new keys from English to Polish while preserving existing Polish translations
- Creates `src/content/dictionaries/marttiini/pl/`
- **Use when**: You need to prepare Polish dictionaries for new English content
- **Note**: Run after `make dictionaries-build`

### 5. `make translations-apply`
**Purpose**: Apply Polish dictionary translations to create Polish product files

- Reads Polish dictionaries with translations
- Creates Polish product files by applying those translations
- Creates `src/content/products/marttiini/pl/` (Polish products)
- Creates `src/content/categories/marttiini/pl/` (Polish categories)
- **✅ SAFE**: Skips existing files - won't overwrite your manual edits
- **Use when**: You need to create Polish products from existing translations or add new translations
- **Note**: Run after `make dictionaries-sync` and optionally `make translations:auto`
- **Behavior**: 
  - Only creates files that don't exist
  - Existing Polish files are preserved untouched
  - Can be run multiple times safely

### 6. `make translations-update`
**Purpose**: Update existing Polish products with new dictionary translations

- Reads existing Polish products (does NOT delete them)
- Applies latest Polish dictionary translations
- Updates changed fields while preserving manual edits
- **Use when**: Dictionaries were updated and you want to refresh Polish products
- **Note**: Safer than `translations-apply` for repeated updates

## Complete Workflow

For a complete fresh setup from scraped data:

```bash
make copy-scraped-data        # 1. Copy raw JSONL files
make load-contents            # 2. Transform to English products
make dictionaries-build       # 3. Extract English dictionaries
make dictionaries-sync        # 4. Sync dictionaries to Polish
make translations-apply       # 5. Apply translations to create Polish products
```

## Update Workflow

When you have new scraped data but Polish products already exist:

```bash
make copy-scraped-data        # 1. Copy updated JSONL files
make load-contents            # 2. Update English products
make dictionaries-build       # 3. Rebuild English dictionaries
make dictionaries-sync        # 4. Sync to Polish dictionaries
make translations-update      # 5. Update Polish products (safer than translations-init)
```

## Key Differences

### `dictionaries-build` vs `dictionaries-sync`

| Operation | Input | Output | Purpose |
|-----------|-------|--------|---------|
| **build** | English products (JSON) | English dictionaries | Extract translation source material from products |
| **sync** | English dictionaries | Polish dictionaries | Prepare Polish translation structure |

### `translations-init` vs `translations-update`

| Operation | Creates Files | Preserves Existing | Use Case |
|-----------|---------------|-------------------|----------|
| **init** | ✅ Creates new only | ✅ Preserves all | Create Polish products for new English content (safe!) |
| **update** | ❌ Only updates | ✅ Preserves | Refresh translations after dictionary updates |

**Important**: Both operations are **safe** and won't delete or overwrite your manual edits. Existing files are always preserved.

## File Structure

```
scraped/marttiini/
├── products.jsonl           # Raw product data
└── categories.jsonl         # Raw category data

src/content/products/marttiini/
├── en/                      # English products (JSON)
│   ├── product-1.json
│   ├── product-2.json
│   └── ...
└── pl/                      # Polish products (JSON)
    ├── product-1.json
    ├── product-2.json
    └── ...

src/content/dictionaries/marttiini/
├── en/                      # English dictionaries (translation source)
│   ├── attributes.json
│   ├── attribute-groups.json
│   ├── variants.json
│   ├── descriptions.json
│   ├── categories.json
│   └── attribute-values.json
└── pl/                      # Polish dictionaries (synchronized from English)
    ├── attributes.json
    ├── attribute-groups.json
    ├── variants.json
    ├── descriptions.json
    ├── categories.json
    └── attribute-values.json
```

## Tips

- **Always run commands in order** - each step depends on the previous output
- **`translations-init` is safe** - it only creates new files and skips existing ones, so your manual edits are never overwritten
- **Use `translations-update`** for incremental changes to refresh translations when dictionaries change
- **Run `translations-init` multiple times** if needed - it's designed to be idempotent and won't destroy your work
- Check `make help` for all available commands
