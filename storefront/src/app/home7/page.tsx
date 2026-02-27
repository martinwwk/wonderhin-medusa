import {Metadata} from 'next';
import Container from '@/components/shared/container';

import {
    homeSevenBGVideo as Bgvideo,
    homeSevenGrid as Grid,
    homeSevenGrid2 as Grid2
} from "@/components/banner/data";
import BestSellerFeed from "@/components/product/feeds/best-seller-feed";
import TrendingProductFeed from "@/components/product/feeds/trending-product-feed";
import ServiceFeature from "@/components/common/service-featured";
import {HomeService} from "@/components/common/service-data";

import BackgroundVideo from "@/components/common/background-video";
import BannerGrid from "@/components/banner/banner-grid";
import CollectionTop from "@/components/collection/collection-top";
import React from "react";
import { Home7Customer as Customer} from "@/components/testimonial/data";
import Testimonial from "@/components/testimonial/testimonial";
import InstagramGrid from "@/components/instagram/instagram";
import CollectionMarquee from "@/components/collection/collection-marquee";
import {homeSevenMarquee as Marquee} from "@/components/collection/data";
import {tinyInstagram as Instagram} from "@/components/instagram/data";

export const metadata: Metadata = {
    title: 'Home7'
};

export default async function Page() {
    return (
        <>
            <Container className={"pt-7.5"}>
                <BannerGrid data={Grid} variant={"home3Grid"} girdClassName={"grid-cols-2"} className={"mb-10"}/>
            </Container>

            <Container variant={"fluid"}>
                <CollectionMarquee data={Marquee} variant={'Normal'} className={"mb-10"}/>
            </Container>

            <Container>
                <CollectionTop variant={"tiny"}/>

                <BestSellerFeed variant={"tiny"} uniqueKey={'best-selling'} showBtnAllProducts={true}/>

                <BannerGrid data={Grid2} variant={"home3Grid"} girdClassName={"grid-cols-2"} />
            </Container>

            <Container variant={"fluid"}>
                <BackgroundVideo collections={Bgvideo} variant={"home7"} className={'overflow-hidden mb-15 lg:mb-22'} />
            </Container>

            <Container>
                <TrendingProductFeed variant={"tiny"} uniqueKey={"bestSelling"} showBtnAllProducts={true} />
                <Testimonial data={Customer} uniqueKey={"default"} />
                <InstagramGrid data={Instagram} roundedClass={'rounded-md'}  />

                <ServiceFeature data={HomeService} className={"mb-0"}/>
            </Container>
        </>
    );
}
