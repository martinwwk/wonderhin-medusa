import {Metadata} from "next";
import Container from "@/components/shared/container";
import Breadcrumb from "@/components/shared/breadcrumb";
import PageContent from "@/app/[countryCode]/(default)/search/page-content";
import React, {Suspense} from "react";
import Loading from "@/components/shared/loading";
import { getRegion } from "@/lib/data/regions";

export const metadata: Metadata = {
	title: 'Search Page',
};
function SearchBarFallback() {
	return <Loading/>
}
export default async function Page({
	params,
}: {
	params: Promise<{ countryCode: string }>
}) {
	const { countryCode } = await params;
	const region = await getRegion(countryCode);

	return (
		<Container>
			<div className="py-7 lg:py-8  blog-category">
				<Breadcrumb/>
				<Suspense fallback={<SearchBarFallback />}>
					<div className="pt-7 lg:pt-8">
						<PageContent regionId={region?.id ?? ""}/>
					</div>
				</Suspense>
				
			</div>
		</Container>
	);
}
