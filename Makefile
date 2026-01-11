copy-raw:
	cp ../scraping/marttiini/data/final_categories.jsonl raw/marttiini/categories.jsonl
	cp ../scraping/marttiini/data/final_products.jsonl raw/marttiini/products.jsonl

load-content:
	npx tsx src/content.loader.ts

