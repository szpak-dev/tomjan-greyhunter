import { getCollection } from 'astro:content';

export type SocialLink = {
    label: string;
    url: string;
    icon: string;
}

export type Manufacturer = {
    id: string;
    lang: string;
    name: string;
    logoImage: string;
    website: string;
    link: string; // External URL or internal path for the manufacturer page
    socials: SocialLink[];
    description: string[];
    domains: string[]; // List of domain names associated with the manufacturer
}

export async function findAll(lang: string): Promise<Manufacturer[]> {
    const manufacturers = await getCollection('manufacturers');
    return manufacturers
        .map((entry) => entry.data as Manufacturer)
        .filter((manufacturer) => manufacturer.lang === lang);
}

export async function get(id: string, lang: string): Promise<Manufacturer> {
    const manufacturers = await findAll(lang);
    const manufacturer = manufacturers.find((m) => m.id === id);
    if (!manufacturer) {
        throw new Error(`Manufacturer with id '${id}' not found for lang '${lang}'`);
    }
    return manufacturer;
}