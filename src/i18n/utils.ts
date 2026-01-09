import { ui, defaultLang } from './ui';

export function getLangFromUrl(url: URL) {
    const [, lang] = url.pathname.split('/');
    if (lang in ui) return lang as keyof typeof ui;
    return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
    return function t(key: keyof typeof ui[typeof defaultLang]) {
        return ui[lang][key] || ui[defaultLang][key];
    }
}

export function getLocalizedUrl(lang: string, path: string = '') {
    // Remove leading and trailing slashes from path
    const cleanPath = path.replace(/^\/+|\/+$/g, '');
    // Construct URL with language prefix and trailing slash
    const url = `/${lang}${cleanPath ? '/' + cleanPath : ''}`;
    // Add trailing slash (Astro config has trailingSlash: 'always')
    return url.endsWith('/') ? url : `${url}/`;
}
