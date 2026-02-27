import LoginForm from '@/components/auth/login-form';
import { Metadata } from 'next';
import Container from "@/components/shared/container";
import PageHeroSection from "@/components/shared/page-hero-section";
import React from "react";

export const metadata: Metadata = {
  title: 'Sign In',
};

export default async function Page() {
    const backgroundBanner = '/assets/images/login_bg.png';
  return (
    <div className={"md:-mb-18 bg-gray-50 bg-center"} style={{backgroundImage: `url(${backgroundBanner})`}}>
        <Container >

                <PageHeroSection heroTitle="Login"/>
                <div className="flex items-center justify-center">
                    <div className="w-full md:w-auto pb-8 lg:pb-13">
                        <LoginForm isPopup={false}/>
                    </div>
                </div>

        </Container>
    </div>
  );
}
