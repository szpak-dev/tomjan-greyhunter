import { useTranslations } from "../i18n/utils";
import type { ui } from "../i18n/ui";

export type AvailableLanguage = {
    code: string;
    label: string;
    flag: string;
}

export function getAvailableLanguages(): AvailableLanguage[] {
    const languages = [
        { code: 'en', label: 'EN', flag: '🇬🇧' },
        { code: 'pl', label: 'PL', flag: '🇵🇱' },
    ];

    return languages;
}

export function getLanguage(code: string): AvailableLanguage {
    const languages = getAvailableLanguages();
    const language = languages.find((lang) => lang.code === code);
    
    if (!language) {
        throw new Error(`Language with code ${code} not found`);
    }
    
    return language;
}

export function getDefaultLanguage(): AvailableLanguage {
    return { code: 'pl', label: 'PL', flag: '🇵🇱' };
}

export function getTranslator(lang: string) {
    const validLang = (lang === 'en' || lang === 'pl') ? lang : 'pl';
    return useTranslations(validLang as keyof typeof ui);
}

export type MossaicPicture = {
    image_url: string;
};

export function getMossaic(): MossaicPicture[] {
    return [
        { image_url: 'tomjan/collage/m-0' },
        { image_url: 'tomjan/collage/m-1' },
        { image_url: 'tomjan/collage/m-2' },
        { image_url: 'tomjan/collage/m-3' },
        { image_url: 'tomjan/collage/m-4' },
        { image_url: 'tomjan/collage/m-5' },
        { image_url: 'tomjan/collage/m-6' },
        { image_url: 'tomjan/collage/m-7' },
        { image_url: 'tomjan/collage/m-8' },
        { image_url: 'tomjan/collage/m-9' },
        { image_url: 'tomjan/collage/m-10' },
        { image_url: 'tomjan/collage/m-11' },
    ]
}

export type SocialAccount = {
    name: string;
    url: string;
    icon: string;
};

export function getSocialAccounts(): SocialAccount[] {
    return [
        { name: "Facebook", url: "https://www.facebook.com/greyhunter", icon: "bi bi-facebook", },
        { name: "Instagram", url: "https://www.instagram.com/greyhunter", icon: "bi bi-instagram", },
    ];
}

export type SiteOwner = {
    name: string;
    company: {
        name: string;
        taxId: string; // nip
        registrationId: string; // regon
    };
    address: {
        street: string;
        postalCode: string;
        city: string;
        country: string;
    };
    contact: {
        email: string;
        phone: {
            number: string;
            url: string;
        };
        website: string;
    };
    socials: SocialAccount[];
};

export function getSiteOwner(): SiteOwner {
    return {
        name: "Tomasz Jantos",
        company: {
            name: "Grey Hunter Tomasz Jantos",
            taxId: "9512111440",
            registrationId: "146876673",
        },
        address: {
            street: "Belgradzka 18/108",
            postalCode: "02-793",
            city: "Warszawa",
            country: "Polska",
        },
        contact: {
            email: "tomek.jantos@greyhunter.com.pl",
            phone: {
                number: "+48 502 770 556",
                url: "tel:+48502770556",
            },
            website: "https://greyhunter.com.pl",
        },
        socials: getSocialAccounts(),
    };
}

export function getSliderItems(manufacturer: string): { image: string; altText: string; }[] {
    const mapping: Record<string, { image: string; altText: string; }[]> = {
        "marttiini": [
            { image: "greyhunter.com.pl/slider-0", altText: "Slider Item 0", },
            { image: "greyhunter.com.pl/slider-1", altText: "Slider Item 1", },
            { image: "greyhunter.com.pl/slider-2", altText: "Slider Item 2", },
            { image: "greyhunter.com.pl/slider-3", altText: "Slider Item 3", },
        ],
    }

    return mapping[manufacturer] || [];
}