import {Metadata} from 'next';
import Container from '@/components/shared/container';
import HeroSlider from "@/components/hero/hero-slider";

import { homeFourHeroSlider as heroSlider} from "@/components/hero/data";
import BestSellerFeed from "@/components/product/feeds/best-seller-feed";
import CollectionHighlights from "@/components/collection/collection-highlights";
import {homeThreeHighlight as Hightlight, homeTwoMarquee as Marquee} from "@/components/collection/data";
import {homeFourBGVideo as Bgvideo, homeFourHighlightText as HightlightText} from "@/components/banner/data";
import BannerGrid from "@/components/banner/banner-grid";
import BackgroundVideo from "@/components/common/background-video";
import CollectionMarquee from "@/components/collection/collection-marquee";
import TrendingProductFeed from "@/components/product/feeds/trending-product-feed";
import Testimonial from "@/components/testimonial/testimonial";
import {Home2Customer as Customer} from "@/components/testimonial/data";
import InstagramGrid from "@/components/instagram/instagram";
import {HomeService as Service} from "@/components/common/service-data";
import ServiceFeature from "@/components/common/service-featured";
import {dataInstagram as Instagram} from "@/components/instagram/data";

export const metadata: Metadata = {
    title: 'Home4'
};

export default async function Page() {
    return (
        <>
            <Container variant={"fluid"}>
                <HeroSlider heroBanner={heroSlider} variant={"hero-4"} />
            </Container>

            <Container>
                <CollectionHighlights  collections={Hightlight} girdClassName={"grid-cols-5"}/>
                <BestSellerFeed variant={"underwear"}/>
                <BannerGrid variant={"home4Highlight"} data={HightlightText} girdClassName={"grid-cols-1"}/>
            </Container>

            <Container variant={'fluid'}>
                <BackgroundVideo collections={Bgvideo} className={'rounded-t-xl overflow-hidden'} />
                <CollectionMarquee data={Marquee} variant={'Primary'} className={"mb-15 lg:mb-22 rounded-b-xl "} />
            </Container>

            <Container>
                <TrendingProductFeed  variant={"underwear"}/>
                <Testimonial  data={Customer} uniqueKey={"testimonial-30"} useImage={false}/>
            </Container>
            
            <div className={"bg-fill-one lg:p-10 py-5 lg:py-20 rounded-xl  mx-4 md:mx-7.5"}>
                <Container>
                    <InstagramGrid data={Instagram} />
                    <ServiceFeature data={Service} className={"mb-0"}/>
                </Container>
            </div>
        </>
    );
}
