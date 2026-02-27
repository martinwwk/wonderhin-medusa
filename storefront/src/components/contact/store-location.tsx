
import Container from "@/components/shared/container";
import Heading from "@/components/shared/heading";
import Link from "@/components/shared/link";
import getLocation from "@/utils/get-location";

interface Props {
    useStore?: boolean;
    height?:string;

}

export default function StoreLocation({
                                          useStore = true,height="420px"
                                      }: React.PropsWithChildren<Props>) {
    // Get URL from Google Maps URL
    const selectedLocation = "https://www.google.com/maps/@-37.7603734,144.7878172,17z?entry=ttu&g_ep=EgoyMDI1MDQyMi4wIKXMDSoJLDEwMjExNjM5SAFQAw%3D%3D";
    
    return (
        <div className="relative w-full overflow-hidden mb-10">
            {/* Store popup */}
            {useStore && (
                <Container>
                    <div className={'relative'}>
                        <div className="absolute top-1/2 translate-y-1/2  left-5 transform   z-10">
                            <div className="rounded text-15px p-5 lg:p-8   w-full  lg:w-[380px] shadow-xl bg-white/60 backdrop-blur-sm">
                                <div className="py-2 ">
                                    <Heading variant="titleMedium" className="mb-3">Visit Our Store</Heading>
                                    <p className="mb-1"> 123 Widget Street Acmeville.</p>
                                    <p className=""> AC 12345 United States of America</p>
                                </div>
                                <div className="pt-0 ">
                                    <Link href={'#'} className={"font-medium text-brand-dark"} variant={'reversed'} >
                                        See more about
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            )}
            
            {/* GMap  */}
            <iframe
                src={getLocation(selectedLocation)}
                width="100%"
                height={height}
                style={{border: 0}}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full "
            />
            
        </div>
    )
}
