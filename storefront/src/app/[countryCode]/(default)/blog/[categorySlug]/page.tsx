import Container from '@/components/shared/container';
import { Metadata } from 'next';
import { BlogSidebar } from '@/app/[countrycode]/(default)/blog/blog-sidebar';
import React from "react";
import BlogManager from "@/app/[countrycode]/(default)/blog/blog-manager";
import PageHeroSection from '@/components/shared/page-hero-section';

export const metadata: Metadata = {
    title: 'Blog',
};

export default async function Page() {
    return (
       
        <Container>
            <PageHeroSection heroTitle="Blog Category Grid" heroSub='Discover style insights and trends on our fashion lifestyle blog'/>
            <div className="flex blog-category">
                <div className="shrink-0 pe-5 xl:pe-10 hidden lg:block w-85  sticky top-16 h-full">
                    <BlogSidebar />
                </div>
                <div className="w-full">
                    <BlogManager variant={'grid'}/>
                </div>
            </div>
        </Container>
       
    );
}
