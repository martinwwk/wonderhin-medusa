import {Metadata} from 'next';
import Container from '@/components/shared/container';
import HeroSlider from "@/components/hero/hero-slider";

import {homeFiveHeroSlider as heroSlider} from "@/components/hero/data";
import BestSellerFeed from "@/components/product/feeds/best-seller-feed";
import TrendingProductFeed from "@/components/product/feeds/trending-product-feed";
import ServiceFeature from "@/components/common/service-featured";
import {HomeService as Service} from "@/components/common/service-data";
import {homeFiveBGVideo as Bgvideo} from "@/components/banner/data";
import BackgroundVideo from "@/components/common/background-video";
import ExpandContent from "@/components/common/expand-content";
import BrandCarousel from "@/components/brand/brand-carousel";
import {homeFiveHighlight as Hightlight} from "@/components/collection/data";
import CollectionHighlights from "@/components/collection/collection-highlights";

export const metadata: Metadata = {
    title: 'Home5'
};

export default async function Page() {
    return (
        <>

            <HeroSlider heroBanner={heroSlider} variant={'hero-5'} />

            <Container variant={"Small"}>
                <ServiceFeature data={Service}/>

                <BestSellerFeed/>

                <BackgroundVideo collections={Bgvideo} variant={"home5"} className={'overflow-hidden mb-15 lg:mb-22'} />

                <TrendingProductFeed/>

                <CollectionHighlights  collections={Hightlight}  variant={"home5"}/>

                <ExpandContent/>

                <BrandCarousel/>
            </Container>

        </>
    );
}
