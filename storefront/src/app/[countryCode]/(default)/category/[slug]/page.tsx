import { Metadata } from "next";
import Container from "@/components/shared/container";
import PageContent from "@/app/[countryCode]/(default)/category/[slug]/page-content";
import PageHeroSection from "@/components/shared/page-hero-section";
import React from "react";
import { CategorySub } from "@/components/category/category-sub";
import { getRegion } from "@/lib/data/regions";

export const metadata: Metadata = {
	title: 'Category Page',
};
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
		<Container>
			<div className="blog-category">
				<PageHeroSection heroTitle="Category" heroSub='Comfortable with our luxurious—seductive knitwear collection' />
				<CategorySub />
				<PageContent slug={slug} regionId={region.id} />
			</div>
		</Container>
	);
}
