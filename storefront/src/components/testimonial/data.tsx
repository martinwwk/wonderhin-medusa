
export interface PropsCustomer {
    id: number;
    rating: number
    productId?: string;
    author_name: string;
    image?:string;
    video?:string;
    description:string;
    verified: boolean;
}


export  const Home2Customer: PropsCustomer[] = [
    {
        id: 1,
        rating: 4,
        productId: "product1",
        image: '/assets/images/support/tes_home2_1.jpg',
        description: 'These are sooo pretty and very comfy. Perfect color as well. I love wearing these with a neutral top and Chelsea boots. Wicked cute...😍',
        author_name: 'Carie-Goose H.',
        verified: true
    },
    {
        id: 2,
        rating: 4,
        productId: "product2",
        image: '/assets/images/support/tes_home2_2.jpg',
        video: 'https://next15-glozin.vercel.app/assets/images/support/video-1.mp4',
        description: 'A perfect product, it keeps you very warm without over heating. True to size, I couldn\'t be happier with the purchase... Thank you! 🤗',
        author_name: 'Cameron Smith.',
        verified: true
    },
    {
        id: 3,
        rating: 4,
        productId: "product3",
        image: '/assets/images/support/tes_home2_3.jpg',
        description: 'A fantastic purchase! The product provides just the right amount of warmth without causing overheating. Highly recommend! 😊',
        author_name: 'Nostalgia Lionel.',
        verified: true
    }
];

export  const Home6Customer: PropsCustomer[] = [
    {
        id: 1,
        rating: 4,
        productId: "caleste1",
        image: '/assets/images/support/tes_home2_1.jpg',
        description: 'These are sooo pretty and very comfy. Perfect color as well. I love wearing these with a neutral top and Chelsea boots. Wicked cute...😍',
        author_name: 'Carie-Goose H.',
        verified: true
    },
    {
        id: 2,
        rating: 4,
        productId: "caleste2",
        image: '/assets/images/support/tes_home2_2.jpg',
        video: 'https://next15-glozin.vercel.app/assets/images/support/video-1.mp4',
        description: 'A perfect product, it keeps you very warm without over heating. True to size, I couldn\'t be happier with the purchase... Thank you! 🤗',
        author_name: 'Cameron Smith.',
        verified: true
    },
    {
        id: 3,
        rating: 4,
        productId: "caleste3",
        image: '/assets/images/support/tes_home2_3.jpg',
        description: 'A fantastic purchase! The product provides just the right amount of warmth without causing overheating. Highly recommend! 😊',
        author_name: 'Nostalgia Lionel.',
        verified: true
    }
];

export  const Home7Customer: PropsCustomer[] = [
    {
        id: 1,
        rating: 4,
        productId: "tiny1",
        image: '/assets/images/support/home7/tiny_outfits-banner-7.jpg',
        description: 'These are sooo pretty and very comfy. Perfect color as well. I love wearing these with a neutral top and Chelsea boots. Wicked cute...😍',
        author_name: 'Susan Gibson',
        verified: true
    },
    {
        id: 2,
        rating: 4,
        productId: "tiny2",
        image: '/assets/images/support/home7/tiny_outfits-banner-8.jpg',
        description: 'A perfect product, it keeps you very warm without over heating. True to size, I couldn\'t be happier with the purchase... Thank you! 🤗',
        author_name: 'Cameron Smith',
        verified: true
    },
    {
        id: 3,
        rating: 4,
        productId: "tiny3",
        image: '/assets/images/support/home7/tiny_outfits-banner-6.jpg',
        description: 'A fantastic purchase! The product provides just the right amount of warmth without causing overheating. Highly recommend! 😊',
        author_name: 'Nostalgia Lionel',
        verified: true
    }
];