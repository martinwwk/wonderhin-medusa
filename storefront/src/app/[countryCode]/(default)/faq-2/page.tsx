import PageHeroSection from '@/components/shared/page-hero-section';
import PageContent from "@/app/[countrycode]/(default)/faq-2/page-content";



export default async function Page() {
    return (
        <>
            <PageHeroSection
                heroTitle="Help Center"
                heroSub={"Please use the below form. You can also call customer service on +1 (973) 435-3638."}
            />
            <PageContent/>
        </>
    );
}
