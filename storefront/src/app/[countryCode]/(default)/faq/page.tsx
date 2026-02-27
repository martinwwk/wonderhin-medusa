import Container from '@/components/shared/container';
import PageHeroSection from '@/components/shared/page-hero-section';
import { Metadata } from 'next';
import { shopping,order,payment } from '@/data/faq-settings';
import Heading from "@/components/shared/heading";
import React from "react";
import AccordionGroup from "@/components/shared/accordionGroup";

export const metadata: Metadata = {
  title: 'FAQ',
};

export default async function Page() {
    return (
    <>
      <PageHeroSection
        heroTitle="Help Center"
        heroSub={"Please use the below form. You can also call customer service on +1 (973) 435-3638."}
      />
        <Container>
            <div className="flex flex-col md:flex-row gap-5 lg:gap-10  w-full  relative z-10">
                <div className="w-full md:w-[40%] xl:w-[25%] ">
                    <div className={"sticky z-10 md:top-26 lg:top-20"}>
                        <div className="w-full p-5 bg-gray-100 rounded-md">
                            <Heading variant="heading" className="mb-3 ">Have a question</Heading>
                            
                            <p className="text-15px mb-4 leading-7">
                                If you have an issue or question that requires immediate assistance, you can click the
                                button below to chat live
                                with a Customer Service representative.
                            </p>
                            
                            <p className="text-15px mb-6 leading-7">
                                Please allow 06 - 12 business days from the time your package arrives back to us for a
                                refund to be issued.
                            </p>
                            
                            <div className="flex items-center gap-4">
                                <button className="px-6 py-3 bg-black dark:bg-brand-light text-white font-medium rounded-md">Contact us</button>
                                
                                <a href="#" className="flex items-center text-black font-medium underline">
                                    Live chat <span className="ml-1">↗</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-[60%] xl:w-[75%]  xl:mb-0 mb-8">

                        <Heading variant="heading" className="mb-3 ">
                            Shopping Information
                        </Heading>
                        <AccordionGroup items={shopping}/>
                        
                        <Heading variant="heading" className="mt-15 mb-3 ">
                            Payment information
                        </Heading>
                        <AccordionGroup items={order}/>
                        
                        <Heading variant="heading" className="mt-15 mb-3 ">
                            Order & Returns
                        </Heading>
                        <AccordionGroup items={payment}/>

                </div>
                
            </div>
        
        </Container>
    </>
    );
}
