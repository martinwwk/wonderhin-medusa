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
              <div className="flex flex-wrap  w-full  relative z-10">
                  <div className="w-full md:w-[47%] xl:w-[40%] pb-5 lg:pe-12 pt-1.5">
                      <ContactSupport/>
                  </div>
                  <div className="w-full md:w-[53%] xl:w-[60%]  lg:mb-0 mb-8">
                      <StoreLocation useStore={false} height={"500px"}/>
                  </div>
              </div>

          </Container>

      </>
  );
}
