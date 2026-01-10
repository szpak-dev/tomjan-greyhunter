import { getCollection } from 'astro:content';
import { getRelativeLocaleUrl } from "astro:i18n";


export type ContentManufacturer = {
    name: string;
    slug: string;
    logoUrl: string;
    imagesOrientation: 'landscape' | 'portrait';
    link: {
        url: string;
        target: string;
    }
}

export async function findManufacturers(lang: string): Promise<ContentManufacturer[]> {
    const manufacturers = await getCollection('manufacturers');
    
    return manufacturers.map((entry) => {
        const {name, slug, link, logoUrl, imagesOrientation} = entry.data;

        if (link.url.startsWith('_INTERNAL_URL_')) {
            link.url = getRelativeLocaleUrl(lang,`/${slug}/`);
        }

        return { name, slug, logoUrl, imagesOrientation, link }
    });
}

export async function getImagesOrientation(manufacturer: string, lang: string ): Promise<'landscape' | 'portrait'> {
    const manufacturers = await findManufacturers(lang);
    const manufacturerEntry = manufacturers.find((entry) => entry.slug === manufacturer);
    return manufacturerEntry ? manufacturerEntry.imagesOrientation : 'landscape';
}

export async function getImagesOrientationMap(lang: string): Promise<Record<string, 'landscape' | 'portrait'>> {
    const manufacturers = await findManufacturers(lang);
    const orientationMap: Record<string, 'landscape' | 'portrait'> = {};

    manufacturers.forEach((entry) => {
        orientationMap[entry.slug] = entry.imagesOrientation;
    });

    return orientationMap;
}