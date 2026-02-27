import {Metadata} from 'next';
import Container from '@/components/shared/container';
import HeroSlider from "@/components/hero/hero-slider";
import CollectionMarquee from "@/components/collection/collection-marquee";
import { homeTwoMarquee as Marquee} from "@/components/collection/data";
import {homeTwoHeroSlider as heroSlider} from "@/components/hero/data";
import BestSellerFeed from "@/components/product/feeds/best-seller-feed";
import CollectionTop from "@/components/collection/collection-top";
import TrendingProductFeed from "@/components/product/feeds/trending-product-feed";
import Testimonial from "@/components/testimonial/testimonial";
import InstagramGrid from "@/components/instagram/instagram";
import ServiceFeature from "@/components/common/service-featured";
import {HomeService as Service} from "@/components/common/service-data";
import {Home2Customer as Customer} from "@/components/testimonial/data";
import {homeTwoGrid as Grid, homeTwoGrid2 as Grid2} from "@/components/banner/data";
import BannerGrid from "@/components/banner/banner-grid";
import {dataInstagram as Instagram} from "@/components/instagram/data";

export const metadata: Metadata = {
    title: 'Home2'
};

export default async function Page() {
    return (
        <>
            <Container variant={'fluid'}>
                <CollectionMarquee data={Marquee} variant={'Small'} className={"mb-0"}/>
                <HeroSlider heroBanner={heroSlider} variant={'hero-2'} className={"mb-7.5"}/>
            </Container>
            
            <Container>
                <BannerGrid data={Grid}/>
                <CollectionTop/>
                <BestSellerFeed/>
            </Container>
            
            <Container variant={'fluid'}>
                <BannerGrid data={Grid2} variant={"home2Grid2"} girdClassName={"grid-cols-2"}/>
            </Container>
            
            <Container>
                <TrendingProductFeed/>
                <Testimonial data={Customer}/>
                <InstagramGrid data={Instagram}/>
                <ServiceFeature data={Service}/>
            </Container>

        </>
);
}
