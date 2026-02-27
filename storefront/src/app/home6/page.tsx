import {Metadata} from 'next';
import Container from '@/components/shared/container';
import HeroSlider from "@/components/hero/hero-slider";

import {homeSixHeroSlider as heroSlider} from "@/components/hero/data";
import BestSellerFeed from "@/components/product/feeds/best-seller-feed";
import TrendingProductFeed from "@/components/product/feeds/trending-product-feed";
import ServiceFeature from "@/components/common/service-featured";
import {HomeService} from "@/components/common/service-data";
import {
    homeSixBGVideo as bgVideo,
    homeSixHighlightText as HighlightText
} from "@/components/banner/data";
import BackgroundVideo from "@/components/common/background-video";
import BannerGrid from "@/components/banner/banner-grid";
import CollectionTop from "@/components/collection/collection-top";
import SectionHeader from "@/components/common/section-header";
import React from "react";
import {Home6Customer as Customer} from "@/components/testimonial/data";
import Testimonial from "@/components/testimonial/testimonial";
import InstagramGrid from "@/components/instagram/instagram";
import {celesteInstagram as Instagram} from "@/components/instagram/data";

export const metadata: Metadata = {
    title: 'Home6'
};

export default async function Page() {
    return (
        <>
            <Container variant={"fluid"}>
                <HeroSlider heroBanner={heroSlider} roundedClass={'rounded-md'}  />
            </Container>

            <Container>
                <CollectionTop variant={"caleste"}/>

                <BestSellerFeed variant={"caleste"} uniqueKey={'best-selling'} rowCarousel={2} showBtnAllProducts={true}/>

                <BannerGrid variant={"home4Highlight"} data={HighlightText} countdown={true}
                            girdClassName={"grid-cols-1"} CardClassName={"flex-row-reverse"} className={'bg-gray-100 mb-15 lg:mb-22'}/>

                <SectionHeader
                    sectionHeading={"Today's Popular Picks"}
                    sectionSubHeading="Unmatched design—superior performance and customer satisfaction in one."
                    headingPosition={"center-xl"}
                />
                <div className={"grid grid-cols-1 md:grid-cols-2 gap-5 mb-15 lg:mb-22"}>
                    <TrendingProductFeed variant={"caleste"} uniqueKey={"popular-picks"} rowCarousel={2} className={"mb-0"}/>
                    <BackgroundVideo collections={bgVideo} variant={"home6"}  />
                </div>

                <Testimonial data={Customer} uniqueKey={"testimonial-20"} useImage={false}/>

            </Container>

            <Container variant={"fluid"}>
                <InstagramGrid data={Instagram} roundedClass={'rounded-md'} limit={7}  />
            </Container>

            <Container>
                <ServiceFeature data={HomeService} className={"mb-0"}/>
            </Container>
        </>
    );
}
