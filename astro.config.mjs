// @ts-check
import { defineConfig } from 'astro/config';
import { getBasePath } from './src/libs/deployment';

// https://astro.build/config
export default defineConfig({
    output: 'static',
    base: getBasePath() + '/',
    trailingSlash: 'always',
    i18n: {
        defaultLocale: 'en',
        locales: ['en', 'pl'],
    },
    vite: {
        optimizeDeps: {
            include: ['bootstrap']
        },
        ssr: {
            noExternal: ['bootstrap']
        }
    }
});