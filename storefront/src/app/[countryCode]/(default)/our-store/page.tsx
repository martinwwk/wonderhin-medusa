import Container from '@/components/shared/container';
import {Metadata} from 'next';
import PageHeroSection from "@/components/shared/page-hero-section";
import OurStores from "@/components/our-store/our-store";
import { dataStores } from '@/components/our-store/data';
export const metadata: Metadata = {
    title: 'Our Stores',
};

export default async function Page() {
  
  return (
      <>
          <PageHeroSection heroTitle="Our Stores"/>
          <Container>
             <OurStores data={dataStores}/>
          </Container>
      </>
  );
}
