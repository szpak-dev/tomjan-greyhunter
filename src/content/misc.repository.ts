export type SocialAccount = {
    name: string;
    url: string;
    icon: string;
};

export function findSocialAccounts(): SocialAccount[] {
    return [
        { name: "Facebook", url: "https://www.facebook.com/greyhunter", icon: "bi bi-facebook", },
        { name: "Instagram", url: "https://www.instagram.com/greyhunter", icon: "bi bi-instagram", },
    ];
}

export type MossaicPicture = {
    image_url: string;
};

export function findMossaicPictures(): MossaicPicture[] {
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

export type BusinessPartner = {
    name: string;
    link: {
        url: string;
        label: string;
        target: string;
    };
}

export function findBusinessPartners(): BusinessPartner[] {
    return [
        { 
            name: 'Partner 1', 
            link: { 
                url: '/', 
                label: 'Partner 1', 
                target: '_blank' 
            } 
        },
        { 
            name: 'Partner 2', 
            link: { 
                url: '/', 
                label: 'Partner 2', 
                target: '_blank' 
            } 
        },
    ];
}

export type DownloadableOffer = {
    label: string;
    url: string;
    target: string;
}

export function findDownloadableOffers(lang: string = 'en'): DownloadableOffer[] {
    return [
        { 
            url: '/', 
            label: lang === 'en' ? 'Marttiini Catalog' : 'Katalog Marttiini',
            target: '_blank'
        },
        { 
            url: '/', 
            label: lang === 'en' ? 'Databank' : 'Databank',
            target: '_blank'
        },
    ];
}
