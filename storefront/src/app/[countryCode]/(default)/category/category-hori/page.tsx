import {Metadata} from "next";
import Container from "@/components/shared/container";
import Breadcrumb from "@/components/shared/breadcrumb";
import PageContent from "@/app/[countrycode]/(default)/category/category-hori/page-content";
import React, {Suspense} from "react";
import Loading from "@/components/shared/loading";

export const metadata: Metadata = {
    title: 'Category Page',
};

const Fallback = () => {
    return <Loading/>
}

export default async function Page() {

    return (
        <Container>
            <div className="py-7 lg:py-8">
                <Breadcrumb/>
                <Suspense fallback={<Fallback/>}>
                    <div className="pt-7 lg:pt-8">
                        <PageContent/>
                    </div>
                </Suspense>
            </div>
        </Container>
    );
}
