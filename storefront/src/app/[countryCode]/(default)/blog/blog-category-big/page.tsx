import Container from '@/components/shared/container';
import { Metadata } from 'next';
import React from "react";
import BlogManager from "@/app/[countrycode]/(default)/blog/blog-manager";
import PageHeroSection from '@/components/shared/page-hero-section';

export const metadata: Metadata = {
    title: 'Blog',
};

export default async function Page() {
    return (
        <Container>
            <div className=" blog-category">
                <PageHeroSection heroTitle="Blog Category Grid" heroSub='Discover style insights and trends on our fashion lifestyle blog'/>
                <div className="max-w-screen-lg m-auto">
                    <BlogManager variant={'big'}/>
                </div>
            </div>
        </Container>
    );
}
