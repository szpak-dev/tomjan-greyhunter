.PHONY: copy-scraped-data load-contents dictionaries-build dictionaries-sync translations-init translations-update help

SCRAPING_DATA_DIR := /Users/gorky/Sites/scraping/marttiini/data
SCRAPED_DIR := ./scraped/marttiini

help:
	@echo "Available targets:"
	@echo "  make copy-scraped-data      Copy raw JSONL files from scraping directory"
	@echo "  make load-contents          Transform and load products from scraped JSONL"
	@echo "  make dictionaries-build     Build dictionaries with unique attributes, categories and product descriptions"
	@echo "  make dictionaries-sync      Sync dictionaries from source language to target (en → pl)"
	@echo "  make translations-init      Initialize translations by creating target language content files"
	@echo "  make translations-update    Update existing translations with new or changed content"

copy-scraped-data:
	@echo "Copying scraped data from $(SCRAPING_DATA_DIR)..."
	@mkdir -p $(SCRAPED_DIR)
	@cp $(SCRAPING_DATA_DIR)/final_products.jsonl $(SCRAPED_DIR)/products.jsonl
	@cp $(SCRAPING_DATA_DIR)/final_categories.jsonl $(SCRAPED_DIR)/categories.jsonl
	@echo "✓ Files copied successfully"

load-contents:
	@echo "Loading contents..."
	@npm run load:contents

dictionaries-build:
	@echo "Building dictionaries..."
	@npm run dictionaries:build

dictionaries-sync:
	@echo "Syncing dictionaries..."
	@npm run dictionaries:sync -- marttiini en pl

translations-init:
	@echo "Initializing translations..."
	@npm run translations:init -- marttiini en pl

translations-update:
	@echo "Updating translations..."
	@npm run translations:update -- marttiini pl