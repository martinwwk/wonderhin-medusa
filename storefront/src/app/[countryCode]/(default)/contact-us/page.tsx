
import Container from '@/components/shared/container';
import ContactForm from '@/components/contact/contact-form';
import ContactSupport from '@/components/contact/contact-support';
import {Metadata} from 'next';
import PageHeroSection from "@/components/shared/page-hero-section";
import StoreLocation from "@/components/contact/store-location";

export const metadata: Metadata = {
    title: 'Contact Us',
};

export default async function Page() {

  return (
      <>
          <PageHeroSection heroTitle="Contact Us"  heroSub={"Please use the below form. You can also call customer service on +1 (973) 435-3638."}/>
          <Container>
              <StoreLocation/>
              <div className="flex flex-wrap w-full">
                  <div className="w-full md:w-[53%] xl:w-[53%] md:pe-8 lg:pe-0 2xl:pe-24 lg:mb-0 mb-8">
                      <ContactSupport/>
                  </div>
                  <div className="w-full md:w-[47%] xl:w-[47%] pb-0.5 lg:ps-12 pt-1.5">
                     <ContactForm/>
                  </div>
              </div>

          </Container>
          
      </>
  );
}
