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

export function getOwnerStory(manufacturerId: string, lang: string): string {
    const stories: Record<string, Record<string, string>> = {
        "marttiini": {
            "en": "I chose Marttiini because Finnish craftsmanship represents everything I believe in. For generations, Marttiini has been perfecting the art of knife-making with meticulous attention to detail. Their commitment to innovation in blade design, combined with decades of tradition, creates tools that hunters and outdoor enthusiasts can trust with their lives. When you hold a Marttiini knife, you're holding Finnish heritage.",
            "pl": "Wybrałem Marttiini, ponieważ fińskie rzemiosło to wszystko, w co wierzę. Przez pokolenia Marttiini doskonali sztukę wyrobu noży z niezwykłą staranności. Ich zaangażowanie w innowacje w projektowaniu ostrzy, połączone z dziesięcioleciami tradycji, tworzy narzędzia, którym mogą ufać myśliwi i entuzjaści przyrody. Trzymając nóż Marttiini, trzymasz fińskie dziedzictwo."
        },
        "sarsilmaz": {
            "en": "Sarsilmaz represents the modern face of Turkish firearms engineering. With decades of proven excellence, they've earned recognition worldwide for their reliability and innovative designs. Whether for hunting or sport shooting, Sarsilmaz firearms combine precision manufacturing with timeless quality. I partnered with them because they understand that a firearm must be dependable when it matters most.",
            "pl": "Sarsilmaz reprezentuje nowoczesną twarz tureckiej inżynierii strzeleckiej. Dzięki dziesięcioleciom sprawdzonej doskonałości zdobyli uznanie na całym świecie za niezawodność i innowacyjne projekty. Niezależnie od tego, czy chodzi o łowiectwo czy sport strzelecki, karabiny Sarsilmaz łączą precyzyjną produkcję z ponadczasową jakością. Zawiązałem z nimi partnerstwo, ponieważ wiedzą, że broń musi być niezawodna, gdy to się liczy najbardziej."
        },
        "eley": {
            "en": "Over 140 years of ammunition manufacturing expertise. Eley's name is synonymous with precision and consistency in the shooting world. Their commitment to quality control and performance has made them the choice of serious hunters and competitive shooters globally. When I considered ammunition suppliers, there was no question—Eley's heritage and proven track record spoke for themselves.",
            "pl": "Ponad 140 lat doświadczenia w produkcji amunicji. Nazwa Eley jest synonimem precyzji i konsekwencji w świecie strzeleckim. Ich zaangażowanie w kontrolę jakości i wydajność uczyniło ich wyborem poważnych myśliwych i zawodowych strzelców na całym świecie. Kiedy rozpatrywałem dostawców amunicji, nie było pytań—dziedzictwo Eley i sprawdzony dorobek mówiły same za siebie."
        },
        "eley-hawk": {
            "en": "Eley Hawk is where precision meets perfection. This premium ammunition line from Eley represents the absolute peak of shooting accuracy. For hunters and competitors who refuse to compromise, Eley Hawk delivers the superior quality and consistency that separates good shots from great ones. I distribute Eley Hawk because excellence demands nothing less.",
            "pl": "Eley Hawk to miejsce, gdzie precyzja spotyka się z doskonałością. Ta linia premium amunicji od Eley reprezentuje absolutny szczyt dokładności strzeleckiej. Dla myśliwych i zawodników, którzy nie pójdą na kompromisy, Eley Hawk dostarcza najwyższą jakość i konsekwencję, która odróżnia dobre strzały od świetnych. Dystrybuuję Eley Hawk, ponieważ doskonałość wymaga nic mniej."
        }
    };

    return stories[manufacturerId][lang];
}

export type ContentPage = {
    id: string;
    lang: string;
    title: string;
    slug: string;
    paragraphs: string[];
};

export function getContentPage(slug: string, lang: string): ContentPage {
    const pages: ContentPage[] = [
        {
            id: "about-company",
            lang: "en",
            title: "About Company",
            slug: "about-company",
            paragraphs: [
                "Grey Hunter has been actively trading since 2013. From its inception, the company's main goal was to supply products to the Polish market dedicated to the hunting and shooting industries.",
                "Grey Hunter operates on a business-to-business model, representing international brands in the Polish market and building a sales network throughout the country. This type of agency activity ensures that our foreign partners not only have a distributor, but someone who cares about building their brand, reputation, and good standing among individual customers.",
                "We understand that building stable business relationships with shops in the Polish market requires time and effort. Therefore, through countless meetings, conversations, visits, and trade shows, we constantly strive to listen to our partners' needs and meet their expectations, making their business operations easier.",
                "As a company providing trade mediation and brand representation services, we are aware that our future is the future of the hunting and shooting industries in Poland. We thank all our current business partners for their trust and invite new Polish entrepreneurs interested in our offer to cooperate with us.",
            ],
        },
        {
            id: "about-company",
            lang: "pl",
            title: "O Firmie",
            slug: "o-firmie",
            paragraphs: [
                "Firma Grey Hunter działa aktywnie w handlu od 2013 roku. Od momentu założenia głównym celem przedsiębiorstwa było dostarczanie na rynek polski produktów adresowanych dla branży myśliwskiej i strzeleckiej.",
                "Grey Hunter prowadzi działalność w oparciu o model business 2 business, reprezentując marki zagraniczne na rynku polskim, oraz budując sieć sprzedaży na terenie całego kraju.Tego typu działalność agencyjna sprawia, że nasi zagraniczni kontrahenci nie tylko posiadają dystrybutora, ale kogoś, kto dba o budowanie ich marki, wizerunku oraz o dobre imię wśród klientów indywidualnych.",
                "Mamy świadomość, że budowanie stabilnych relacji handlowych ze sklepami na rynku polskim wymaga czasu i pracy. Dlatego podczas niezliczonej ilości spotkań, rozmów, wizyt i targów każdorazowo staramy się słuchać potrzeb naszych partnerów i spełniać ich oczekiwania, ułatwiając im prowadzenie działalności.",
                "Jako firma świadcząca usługi pośrednictwa handlu i reprezentowania marki, zdajemy sobie sprawę, że nasza przyszłość to przyszłość branży myśliwskiej i strzeleckiej w Polsce.Dziękujemy za zaufanie wszystkim dotychczasowym partnerom handlowym i zapraszamy do współpracy nowych polskich przedsiębiorców zainteresowanych naszą ofertą.",
             ],
        },
        {
            id: "contact",
            lang: "en",
            title: "Contact",
            slug: "contact",
            paragraphs: [
                "Get in touch. I'm here to help and answer any questions you might have."
            ],
        },
        {
            id: "contact",
            lang: "pl",
            title: "Kontakt",
            slug: "contact",
            paragraphs: [
                "Skontaktuj się ze mną. Jestem tutaj, aby pomóc i odpowiedzieć na wszelkie pytania, które możesz mieć."
            ],
        },
    ];

    const page = pages.find((p) => p.slug === slug && p.lang === lang);
    
    if (!page) {
        throw new Error(`Content page with slug '${slug}' not found for lang '${lang}'`);
    }

    return page;
}

export type NavigationItem = {
    slug: string;
    name: string;
    path: string;
    icon?: string;
};

export function getNavigationItems(lang: string): NavigationItem[] {
    const items: Record<string, NavigationItem[]> = {
        "en": [
            { slug: "about-company", name: "About Company", path: "/en/company/", icon: "bi bi-building" },
            { slug: "contact", name: "Contact", path: "/en/contact/", icon: "bi bi-envelope" },
        ],
        "pl": [
            { slug: "o-firmie", name: "O Firmie", path: "/pl/company/", icon: "bi bi-building" },
            { slug: "kontakt", name: "Kontakt", path: "/pl/contact/", icon: "bi bi-envelope" },
        ],
    };

    return items[lang];
}