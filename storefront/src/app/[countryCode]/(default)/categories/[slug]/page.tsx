import {Metadata} from "next";
import Container from "@/components/shared/container";
import CategoriesContent from "@/app/[countrycode]/(default)/categories/categories-content";
import PageHeroSection from "@/components/shared/page-hero-section";
import React from "react";
import { listTopLevelCategories, getCategoryMedia } from "@/lib/data/categories";
import { transformMedusaCategory } from "@/lib/util/transform-categories";

export const metadata: Metadata = {
	title: 'Categories Page',
};

export default async function Page() {
	const heroSub ="Explore our thoughtfully curated collections: Sweaters, Handbags, Denim, and more—each\n" +
		"perfect for enhancing every style on every special occasion and daily wear.";
	
	// Fetch only top-level categories on server side with media
	const medusaCategories = await listTopLevelCategories();
	const categories = await Promise.all(
		medusaCategories.map(async (category) => {
			const media = await getCategoryMedia(category.id);
			return transformMedusaCategory(category, media);
		})
	);
	
	return (
		<Container>
			<PageHeroSection useBreadcrumb={false} heroTitle="Collections List" heroSub={heroSub}/>
			<CategoriesContent variant={'drop-shadow'} initialCategories={categories}/>
		</Container>
	);
}
