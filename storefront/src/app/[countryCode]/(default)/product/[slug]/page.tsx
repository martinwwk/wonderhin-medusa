import Container from '@/components/shared/container';
import Breadcrumb from '@/components/shared/breadcrumb';
import PageContent from "@/app/[countryCode]/(default)/product/[slug]/page-content";
import {getRegion} from "@/lib/data/regions";

export default async function Page({
	params,
}: {
	params: Promise<{ slug: string; countryCode: string }>
}) {
	const { slug, countryCode } = await params;
	const region = await getRegion(countryCode);

	if (!region) {
		return <div>Region not found</div>;
	}

	return (
		<div className="pt-6 lg:pt-8">
			<Container>
				<Breadcrumb/>
				<div className="pt-7 lg:pt-8">
					<PageContent slug={slug} regionId={region.id}/>
				</div>
			</Container>
		</div>
	);
}
