import PageHeroSection from '@/components/shared/page-hero-section';
import PrivacyPageContent from '@/app/[countrycode]/(default)/privacy/privacy-page-content';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy',
};

export default async function Page() {
  return (
    <>
      <PageHeroSection heroTitle="Privacy Policy" />
      <PrivacyPageContent  />
    </>
  );
}
