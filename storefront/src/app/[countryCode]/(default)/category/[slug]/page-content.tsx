'use client';
import { Element } from 'react-scroll';
import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";

const DEFAULT_PRICE_RANGE: [number, number] = [0, 500];
import TopBar from "@/components/category/top-bar";
import Filters from "@/components/filter/filters";
import DrawerFilter from "@/components/filter/drawer-filter";
import { LIMITS } from "@/lib/util/limits";
import { usePathname } from "next/navigation";
import useQueryParam from "@/utils/use-query-params";
import { ProductMain } from "@/components/product/productListing/product-main";
import { useProductsQuery } from "@/hooks/use-all-products";
import Loading from "@/components/shared/loading";
import Alert from "@/components/shared/alert";
import { useCategories } from "@/hooks/use-categories";
import { CategoryOption } from "@/components/filter/facets/categories-filter";
import { useLocale } from "@/lib/hooks/use-i18n";
import { translateCategoryName } from "@/lib/util/translate-category";
import { Category } from "@/types/template";

/**
 * Transform Category[] into CategoryOption[] for filter UI
 */
function categoriesToFilterOptions(categories: Category[], locale: string): CategoryOption[] {
	return categories.map((cat) => ({
		id: cat.id.toString(),
		label: translateCategoryName(cat.name, locale),
		count: cat.productCount || 0,
		subCategories: cat.children?.map((child) => ({
			id: child.id.toString(),
			label: translateCategoryName(child.name, locale),
			count: child.productCount || 0,
		})),
	}));
}

/**
 * Find the matching parent category by slug and return its sub-categories
 * as filter options. This is for the /category/[slug] page where we want
 * to show only the sub-categories of the current parent category.
 */
function getSubCategoryFilterForSlug(
	categories: Category[],
	slug: string,
	locale: string,
): { filterCategories: CategoryOption[]; parentCategory: Category | null; allSubIds: string[] } {
	// Find the parent category matching this slug
	const parent = categories.find((cat) => cat.slug === slug);
	if (parent && parent.children && parent.children.length > 0) {
		// Show sub-categories as the filter list (flat, no nesting since these are leaves)
		const filterCategories: CategoryOption[] = parent.children.map((child) => ({
			id: child.id.toString(),
			label: translateCategoryName(child.name, locale),
			count: child.productCount || 0,
		}));
		const allSubIds = parent.children.map((c) => c.id.toString());
		return { filterCategories, parentCategory: parent, allSubIds };
	}
	// If no children (leaf category), return empty — hide the categories filter
	return {
		filterCategories: [],
		parentCategory: parent || null,
		allSubIds: [],
	};
}

export default function PageContent({ slug, regionId }: { slug: string; regionId: string }) {
	const [viewAs, setViewAs] = useState(Boolean(true));
	const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
	const [priceRange, setPriceRange] = useState<[number, number]>(DEFAULT_PRICE_RANGE);
	const initializedRef = useRef(false);
	const pathname = usePathname();
	const { getParams, query } = useQueryParam(pathname ?? '/');
	const newQuery: { sort_by?: string } = getParams(
		`${process.env.NEXT_PUBLIC_WEBSITE_URL}${query}`,
	);
	const locale = useLocale();

	// Fetch real categories from Medusa
	const { data: categories } = useCategories();

	// For slug pages, show sub-categories of the matching parent
	const { filterCategories, parentCategory, allSubIds } = useMemo(() => {
		if (!categories) return { filterCategories: [], parentCategory: null, allSubIds: [] };
		return getSubCategoryFilterForSlug(categories, slug, locale);
	}, [categories, slug, locale]);

	// Initialize: pre-select all sub-categories when we first load a parent category page
	useEffect(() => {
		if (!initializedRef.current && allSubIds.length > 0) {
			initializedRef.current = true;
			setSelectedCategoryIds(allSubIds);
		}
	}, [allSubIds]);

	const handleCategoryChange = useCallback((ids: string[]) => {
		setSelectedCategoryIds(ids);
	}, []);

	const handlePriceChange = useCallback((value: [number, number]) => {
		setPriceRange(value);
	}, []);

	// Determine which category IDs to filter products by
	const effectiveCategoryIds = useMemo(() => {
		if (selectedCategoryIds.length > 0) {
			return selectedCategoryIds;
		}
		// No filter selection yet — use slug-based default
		return undefined;
	}, [selectedCategoryIds]);

	// Get category query parameters
	const limit = LIMITS.PRODUCTS_LIMITS;
	const { data, isLoading, isError, error } = useProductsQuery({
		limit: limit,
		sort_by: newQuery.sort_by,
		categoryHandle: effectiveCategoryIds ? undefined : slug,
		categoryIds: effectiveCategoryIds,
		regionId: regionId,
	});

	// Apply price filter client-side
	const filteredData = useMemo(() => {
		if (!data) return undefined;
		const [minPrice, maxPrice] = priceRange;
		if (minPrice === DEFAULT_PRICE_RANGE[0] && maxPrice === DEFAULT_PRICE_RANGE[1]) return data;
		return data.filter((p) => {
			const price = p.price ?? 0;
			return price >= minPrice && price <= maxPrice;
		});
	}, [data, priceRange]);

	if (isLoading) return <Loading />;
	if (isError) return <Alert message={error.message} />;

	return (
		<Element name="category" className="flex products-category gap-7 lg:gap-15">
			<div className="sticky hidden lg:block h-full shrink-0 w-[270px] top-16">
				<Filters categories={filterCategories} onCategoryChange={handleCategoryChange} onPriceChange={handlePriceChange} />
			</div>
			<div className="w-full">
				<DrawerFilter categories={filterCategories} onCategoryChange={handleCategoryChange} onPriceChange={handlePriceChange} />
				<TopBar viewAs={viewAs} setViewAs={setViewAs} />
				<ProductMain data={filteredData} isLoading={isLoading} viewAs={viewAs} />
			</div>
		</Element>

	);
}
