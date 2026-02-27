import {Metadata} from "next";
import Container from "@/components/shared/container";
import CategoryContent from "@/app/[countryCode]/(default)/category/category-content";
import React, {Suspense} from "react";
import PageHeroSection from "@/components/shared/page-hero-section";
import {CategorySub} from "@/components/category/category-sub";
import Loading from "@/components/shared/loading";
import {getRegion} from "@/lib/data/regions";

export const metadata: Metadata = {
    title: 'Category Page',
};
const Fallback = () => {
    return <Loading/>
}
export default async function Page({
    params,
}: {
    params: Promise<{ countryCode: string }>
}) {
    const { countryCode } = await params;
    const region = await getRegion(countryCode);

    if (!region) {
        return <div>Region not found</div>;
    }

    return (
        <Container>
            <div className="blog-category">
                <PageHeroSection heroTitle="Category"
                                 heroSub='Comfortable with our luxurious—seductive knitwear collection'/>
                <Suspense fallback={<Fallback/>}>
                    <CategorySub/>
                    <CategoryContent regionId={region.id} />
                </Suspense>
            </div>
        </Container>
    );
}
