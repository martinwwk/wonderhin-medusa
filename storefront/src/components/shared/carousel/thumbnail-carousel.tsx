import { Navigation, SwiperOptions, SwiperSlide, Thumbs } from '@/components/shared/carousel/slider';
import { Swiper as SwiperComponent } from '@/components/shared/carousel/slider';
import { Swiper } from 'swiper';
import Image from '@/components/shared/image';
import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import cn from 'classnames';
import { productGalleryPlaceholder } from '@/assets/placeholders';
import ImageLightBox from '@/components/shared/image-lightbox';
import { IoPlay } from 'react-icons/io5';
import { GlassMagnifier } from '@/components/shared/image-magnifiers';
import { usePanel } from '@/hooks/use-panel';
import { Attachment } from '@/types/template';

interface Props {
    gallery: Attachment[];
    navigation?: boolean;
    thumbnailClassName?: string;
    galleryClassName?: string;
    videoUrl?: string;
    variant?: 'default' | 'right' | 'bottom';
    activeIndex?: number;
}

const swiperParams: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 0,
};

// Function to extract YouTube video ID from URL, including Shorts
const getYouTubeVideoId = (url?: string): string | null => {
    if (!url) return null;
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
};

const ThumbnailCarousel: React.FC<Props> = ({
                                                gallery,
                                                variant,
                                                videoUrl,
                                                navigation = false,
                                                thumbnailClassName = 'xl:w-full',
                                                galleryClassName = 'xl:w-[80px]',
                                                activeIndex,
                                            }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<Swiper | null>(null);
    const [mainSwiper, setMainSwiper] = useState<Swiper | null>(null);
    const [showVideo, setShowVideo] = useState(false);
    const [isSwiperReady, setIsSwiperReady] = useState(false);
    const prevRef = useRef<HTMLDivElement>(null);
    const nextRef = useRef<HTMLDivElement>(null);
    const mainSwiperRef = useRef<Swiper | null>(null);

    // Reset thumbs swiper when gallery changes
    useEffect(() => {
        if (isSwiperReady && mainSwiper) {
            mainSwiper.update();
            mainSwiper.slideTo(activeIndex ?? 0, 0);
            setShowVideo((activeIndex ?? 0) === 0 && !!videoUrl);
        }
    }, [gallery, videoUrl, activeIndex, isSwiperReady, mainSwiper]);

    // Handle slide change to stop video
    const onSlideChange = useCallback((swiper: Swiper) => {
        const activeIndex = swiper.activeIndex;
        setShowVideo(activeIndex === 0 && !!videoUrl);
    }, [videoUrl]);

    // Handle video thumbnail click
    const handleVideoThumbnailClick = useCallback(() => {
        if (videoUrl && mainSwiperRef.current) {
            setShowVideo(true);
            mainSwiperRef.current.slideTo(0, 0);
        }
    }, [videoUrl]);

    // Render play button overlay for the video thumbnail
    const circlePlay = useMemo(() => (
        <div className="absolute z-1 top-0 start-0 group w-full h-full flex justify-center items-center">
            <div className={cn('flex justify-center items-center text-white w-14 h-14 rounded-full', 'bg-black/80')}>
                <IoPlay className={cn('w-6 h-6')} />
            </div>
        </div>
    ), []);

    // Get YouTube video ID
    const videoId = getYouTubeVideoId(videoUrl);
    const { selectedDirection } = usePanel();
    const dir = selectedDirection; // 'ltr' or 'rtl'

    const galleryBreakpoints = useMemo(() => {
        const isBottom = variant === 'bottom';
        return {
            1280: {
                slidesPerView: 6,
                direction: isBottom ? 'horizontal' : 'vertical',
            },
            767: {
                slidesPerView: 5,
                direction: 'horizontal',
            },
            0: {
                slidesPerView: 4,
                direction: 'horizontal',
            },
        } as Record<number, SwiperOptions>;
    }, [variant]);

    const containerClass = useMemo(
        () =>
            cn('w-full relative', {
                'xl:flex-row-reverse': variant === 'default',
                'xl:flex': variant !== 'bottom',
            }),
        [variant]
    );

    const mainSwiperClass = useMemo(
        () =>
            cn('w-full mb-5 xl:mb-0 overflow-hidden relative', {
                'xl:ms-5': variant === 'default',
                'xl:me-5': variant === 'right',
            }, thumbnailClassName),
        [variant, thumbnailClassName]
    );

    const navigationConfig = useMemo(
        () =>
            navigation
                ? {
                    prevEl: prevRef.current!,
                    nextEl: nextRef.current!,
                }
                : false,
        [navigation]
    );

    return (
        <div className={containerClass}>
            <ImageLightBox gallery={gallery} className={cn({ 'start-3 xs:end-auto': variant === 'right' })} />
            <div className={mainSwiperClass}>
                {Boolean(navigation) && (
                    <>
                        <div
                            ref={prevRef}
                            className="swiper-button-prev absolute left-4 top-1/2 z-10 -translate-y-1/2 cursor-pointer"
                        ></div>
                        <div
                            ref={nextRef}
                            className="swiper-button-next absolute right-4 top-1/2 z-10 -translate-y-1/2 cursor-pointer"
                        ></div>
                    </>
                )}

                <SwiperComponent
                    id="productGallery"
                    dir={dir}
                    className={`${dir === 'rtl' ? 'swiper-rtl' : ''}`}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    modules={[Navigation, Thumbs]}
                    navigation={navigationConfig}
                    observer={true}
                    observeParents={true}
                    onSwiper={(swiperInstance) => {
                        setMainSwiper(swiperInstance);
                        mainSwiperRef.current = swiperInstance;
                        setIsSwiperReady(true);
                    }}
                    onSlideChange={onSlideChange}
                    {...swiperParams}
                >
                    {gallery?.map((item: Attachment, index: number) => (
                        <SwiperSlide key={`product-gallery-${item.id || index}`} className="text-center">
                            {index === 0 && showVideo && videoUrl && videoId ? (
                                <iframe
                                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0`}
                                    title={`YouTube video ${item.id}`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className={cn('mx-auto w-full', {
                                        'h-[380px] md:h-[530px]': variant === 'bottom',
                                        'h-[380px] md:h-[690px]': variant !== 'bottom',
                                    })}
                                />
                            ) : (
                                <div
                                    className="mx-auto magnifier-image-container"
                                    style={{ maxHeight: `${variant === 'bottom' ? '630px' : '840px'}` }}
                                >
                                    <GlassMagnifier
                                        src={item.original ?? productGalleryPlaceholder}
                                        alt={`Product gallery ${item.id || index}`}
                                    />
                                </div>
                            )}
                        </SwiperSlide>
                    ))}
                </SwiperComponent>
            </div>

            <div
                className={cn('shrink-0', {
                    [`${galleryClassName}`]: variant !== 'bottom',
                    ['xl:h-[520px]']: variant !== 'bottom',
                    ['mt-5']: variant === 'bottom',
                })}
            >
                <SwiperComponent
                    id="productGalleryThumbs"
                    key={gallery.length}
                    dir={dir}
                    style={variant !== 'bottom' ? { height: '100%' } : undefined}
                    className={`${dir === 'rtl' ? 'swiper-rtl' : ''}`}
                    onSwiper={(swiper) => {
                        if (swiper && !swiper.destroyed) {
                            setThumbsSwiper(swiper);
                        }
                    }}
                    spaceBetween={10}
                    watchSlidesProgress={true}
                    freeMode={true}
                    observer={true}
                    observeParents={true}
                    breakpoints={galleryBreakpoints}
                    modules={[Thumbs]}
                >
                    {gallery?.map((item: Attachment, index: number) => {
                        const isFirstItem = index === 0;
                        return (
                            <SwiperSlide
                                key={`product-thumb-gallery-${item.id || index}`}
                                className="cursor-pointer rounded overflow-hidden border transition hover:opacity-75 border-border-base box-border"
                                onClick={isFirstItem && videoUrl ? handleVideoThumbnailClick : () => setShowVideo(false)}
                                aria-label={isFirstItem && videoUrl ? 'Play YouTube video' : `View product image ${item.id || index}`}
                            >
                                <Image
                                    src={item.thumbnail ?? productGalleryPlaceholder}
                                    alt={`Product thumb gallery ${item.id || index}`}
                                    width={78}
                                    height={78}
                                />
                                {isFirstItem && videoUrl && circlePlay}
                            </SwiperSlide>
                        );
                    })}
                </SwiperComponent>
            </div>
        </div>
    );
};

export default ThumbnailCarousel;