export const footerSettings = {
    widgets: [
        {
            id: 1,
            widgetTitle: 'ourCompany',
            lists: [
                {
                    id: 1,
                    title: 'blog',
                    path: '/blog',
                },
                {
                    id: 2,
                    title: 'contactUs',
                    path: '/contact-us',
                },
                {
                    id: 3,
                    title: 'privacyPolicy',
                    path: '/privacy',
                },
                {
                    id: 4,
                    title: 'termsAndCondition',
                    path: '/terms',
                },
                {
                    id: 5,
                    title: 'checkout',
                    path: '/checkout',
                },
                {
                    id: 6,
                    title: 'faq',
                    path: '/faq',
                },
            ],
        },
        {
            id: 2,
            widgetTitle: 'shopCategories',
            // Note: lists below are template only - actual categories are fetched dynamically from Medusa API
            // See src/layouts/footer/index.tsx for dynamic category loading
            lists: [
                {
                    id: 1,
                    title: 'cropTop',
                    path: '/category/crop-top',
                },
                {
                    id: 2,
                    title: 'tShirts',
                    path: '/category/t-shirts',
                },
                {
                    id: 3,
                    title: 'topsAndBlouses',
                    path: '/category/tops-blouses',
                },
                {
                    id: 4,
                    title: 'accessories',
                    path: '/category/accessories',
                },
                {
                    id: 5,
                    title: 'bagsAndShoes',
                    path: '/category/bags-shoes',
                },
                {
                    id: 6,
                    title: 'beautyAndHealth',
                    path: '/category/beauty-health',
                },
            ],
        },
        {
            id: 3,
            widgetTitle: 'brands',
            lists: [
                {
                    id: 1,
                    title: 'Common Good',
                    path: '/',
                },
                {
                    id: 2,
                    title: 'OFS',
                    path: '/',
                },
                {
                    id: 3,
                    title: 'Sagaform',
                    path: '/',
                },
                {
                    id: 4,
                    title: 'Feugiat nulla',
                    path: '/',
                },
                {
                    id: 5,
                    title: 'Vulputate velit',
                    path: '/',
                },
                {
                    id: 6,
                    title: 'Samsung Galaxy',
                    path: '/',
                },
            ],
        },
        {
            id: 4,
            widgetTitle: 'ourServices',
            lists: [
                {
                    id: 1,
                    title: 'blog',
                    path: '/blog',
                },
                {
                    id: 2,
                    title: 'aboutTheStore',
                    path: '/contact-us',
                },
                {
                    id: 3,
                    title: 'privacyPolicy',
                    path: '/privacy',
                },
                {
                    id: 4,
                    title: 'termsAndCondition',
                    path: '/terms',
                },
                {
                    id: 5,
                    title: 'checkout',
                    path: '/checkout',
                },
                {
                    id: 6,
                    title: 'faq',
                    path: '/faq',
                },
            ],
        }
    ],
    payment: [
        // {
        //     id: 1,
        //     path: "/",
        //     image: "/assets/images/payment/mastercard.svg",
        //     name: "payment-master-card",
        //     width: 43,
        //     height: 25,
        // },
        // {
        //     id: 2,
        //     path: "/",
        //     image: "/assets/images/payment/visa.svg",
        //     name: "payment-visa",
        //     width: 42,
        //     height: 28,
        // },
        // {
        //     id: 3,
        //     path: "/",
        //     image: "/assets/images/payment/paypal.svg",
        //     name: "payment-paypal",
        //     width: 57,
        //     height: 32,
        // },
        // {
        //     id: 4,
        //     path: "/",
        //     image: "/assets/images/payment/discover.svg",
        //     name: "payment-discover",
        //     width: 75,
        //     height: 25,
        // },
        // {
        //     id: 5,
        //     path: "/",
        //     image: "/assets/images/payment/american_logo.svg",
        //     name: "payment-american",
        //     width: 55,
        //     height: 25,
        // },
    ],
    social: [
        {
            id: 1,
            path: 'https://www.facebook.com/wonderhin',
            image: '/assets/images/social/facebook.svg',
            name: 'facebook',
            width: 32,
            height: 32,
        },
        // {
        //     id: 2,
        //     path: 'https://tiktok.com/',
        //     image: '/assets/images/social/tiktok.svg',
        //     name: 'ticktok',
        //     width: 44,
        //     height: 44,
        // },
        // {
        //     id: 3,
        //     path: 'https://x.com/',
        //     image: '/assets/images/social/x.svg',
        //     name: 'x',
        //     width: 32,
        //     height: 32,
        // },
        {
            id: 4,
            path: 'https://www.instagram.com/wonderhin.handmade',
            image: '/assets/images/social/instagram.svg',
            name: 'instagram',
            width: 42,
            height: 42,
        },
        // {
        //     id: 5,
        //     path: 'https://www.youtube.com/',
        //     image: '/assets/images/social/youtube.svg',
        //     name: 'youtube',
        //     width: 32,
        //     height: 32,
        // },
    ],
};
