import { useMemo } from "react";

const useCarouselConfig = (
    variant?: string,
    uniqueKey?: string
) => {
    const spaceBetween = useMemo(() => {
        return ["celeste"].includes(variant ?? '') ? 20 : 0;
    }, [variant]);

    const breakpoints = useMemo(() => {
        const configs = {
            searchResults: {
                1536: { slidesPerView: 5 ,spaceBetween: 30},
                1280: { slidesPerView: 5,spaceBetween: 30 },
                1024: { slidesPerView: 3,spaceBetween: 30 },
                640: { slidesPerView: 3,spaceBetween: 20 },
                360: { slidesPerView: 2,spaceBetween: 10 },
                0: { slidesPerView: 1 },
            },
            popularPicks: {
                1024: { slidesPerView: 2,spaceBetween: 20 },
                640: { slidesPerView: 2,spaceBetween: 20 },
                360: { slidesPerView: 2,spaceBetween: 10 },
                0: { slidesPerView: 1 },
            },
            bestSelling: {
                1536: { slidesPerView: 4 ,spaceBetween: 20},
                1280: { slidesPerView: 4,spaceBetween: 20 },
                1024: { slidesPerView: 3,spaceBetween: 20 },
                640: { slidesPerView: 3,spaceBetween: 20 },
                360: { slidesPerView: 2,spaceBetween: 10 },
            },
            default: {
                1536: { slidesPerView: 4 ,spaceBetween: 30},
                1280: { slidesPerView: 4,spaceBetween: 30 },
                1024: { slidesPerView: 3,spaceBetween: 30 },
                640: { slidesPerView: 3,spaceBetween: 20 },
                360: { slidesPerView: 2,spaceBetween: 10 },
                0: { slidesPerView: 1 },
            },
        };

        if (variant === 'searchResults') {
            return configs.searchResults;
        }

        if (uniqueKey === 'best-selling' ) {
            return configs.bestSelling;
        }

        if (uniqueKey === 'popular-picks' ) {
            return configs.popularPicks;
        }

        return configs.default;

    }, [variant,uniqueKey]);

    return { spaceBetween, breakpoints };
};

export default useCarouselConfig;
