import {Metadata} from 'next';

import Container from "@/components/shared/container";

import ServiceFeature from "@/components/common/service-featured";
import {HomeThreeService as Service} from "@/components/common/service-data";
import { homeThreeGrid as Grid, homeThreeHero as Hero} from "@/components/banner/data";
import BannerGrid from "@/components/banner/banner-grid";
import BestSellerFeed from "@/components/product/feeds/best-seller-feed";
import TrendingProductFeed from "@/components/product/feeds/trending-product-feed";
import InstagramGrid from "@/components/instagram/instagram";
import LatestblogCarousel from "@/components/blog/latestblog-carousel";
import Divider from "@/components/shared/divider";
import {dataInstagram as Instagram} from "@/components/instagram/data";

export const metadata: Metadata = {
    title: 'Home3',
};

export default async function Page() {
    return (
        <>
            <Container variant={'fluid'}>
                <BannerGrid variant={"home3Hero"} data={Hero} girdClassName={"grid-cols-4"} className={"mb-0"}/>
            </Container>

            <Container>
                <ServiceFeature  variant={"home3"} data={Service} />
                <BestSellerFeed/>
            </Container>

            <Container variant={'fluid'}>
                <BannerGrid variant={"home3Grid"} data={Grid} girdClassName={"grid-cols-2"}/>
            </Container>

            <Container>
                <TrendingProductFeed/>
                <LatestblogCarousel/>
                <Divider/>
            </Container>

            <Container variant={'fluid'}>
                <InstagramGrid data={Instagram} className={"mb-0"} limit={7}/>
            </Container>
        </>
    );
}
