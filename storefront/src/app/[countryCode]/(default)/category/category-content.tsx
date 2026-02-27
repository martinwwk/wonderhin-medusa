'use client';
import { Element } from 'react-scroll';
import React, {useState, useMemo, useCallback} from "react";
import TopBar from "@/components/category/top-bar";
import {ProductLoadMore} from "@/components/product/productListing/product-loadmore";
import Filters from "@/components/filter/filters";
import DrawerFilter from "@/components/filter/drawer-filter";
import {LIMITS} from "@/lib/util/limits";
import {usePathname} from "next/navigation";
import useQueryParam from '@/utils/use-query-params';
import {InfiniteData} from "@tanstack/react-query";
import {PaginatedProduct, Product} from "@/types/template";
import {useMoreProductsQuery} from "@/hooks/use-all-more-products";
import {useCategories} from "@/hooks/use-categories";
import {CategoryOption} from "@/components/filter/facets/categories-filter";
import {useLocale} from "@/lib/hooks/use-i18n";
import {translateCategoryName} from "@/lib/util/translate-category";
import {Category} from "@/types/template";

const DEFAULT_PRICE_RANGE: [number, number] = [0, 500];


/**
 * Transform our Category[] (from Medusa) into CategoryOption[] for the filter UI.
 * Shows parent categories with their children as sub-categories.
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


export default function CategoryContent({ regionId }: { regionId: string }) {
	const [viewAs, setViewAs] = useState(Boolean(true));
	const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
	const [priceRange, setPriceRange] = useState<[number, number]>(DEFAULT_PRICE_RANGE);
	const pathname = usePathname();
	const { getParams, query } = useQueryParam(pathname ?? '/');
	const newQuery: { sort_by?: string } = getParams(
		`${process.env.NEXT_PUBLIC_WEBSITE_URL}${query}`,
	);
	const locale = useLocale();
	
	// Fetch real categories from Medusa (top-level with children)
	const { data: categories } = useCategories();
	
	// Transform to filter options
	const filterCategories = useMemo(() => {
		if (!categories) return [];
		return categoriesToFilterOptions(categories, locale);
	}, [categories, locale]);
	
	// Handle category selection changes from filter
	const handleCategoryChange = useCallback((ids: string[]) => {
		setSelectedCategoryIds(ids);
	}, []);

	const handlePriceChange = useCallback((value: [number, number]) => {
		setPriceRange(value);
	}, []);
	
	// Get products filtered by selected categories
	const limit = LIMITS.PRODUCTS_LIMITS;
	const {
		isLoading,
		isFetchingNextPage: loadingMore,
		fetchNextPage,
		hasNextPage,
		data,
	} = useMoreProductsQuery({
		limit: limit,
		sort_by: newQuery.sort_by,
		regionId: regionId,
		categoryIds: selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
	});

	// Apply price filter client-side over the already-fetched pages
	const filteredData = useMemo(() => {
		if (!data) return undefined;
		const [minPrice, maxPrice] = priceRange;
		// Skip filtering when on default range to avoid unnecessary re-renders
		if (minPrice === DEFAULT_PRICE_RANGE[0] && maxPrice === DEFAULT_PRICE_RANGE[1]) return data;
		return {
			...data,
			pages: data.pages.map((page: PaginatedProduct) => ({
				...page,
				data: page.data.filter((p: Product) => {
					const price = p.price ?? 0;
					return price >= minPrice && price <= maxPrice;
				}),
			})),
		};
	}, [data, priceRange]);
	
	
	return (
		<Element name="category" className="flex products-category gap-7 lg:gap-15">
			<div className="sticky hidden lg:block h-full shrink-0  w-[270px] top-16 ">
				<Filters categories={filterCategories} onCategoryChange={handleCategoryChange} onPriceChange={handlePriceChange} />
			</div>
			<div className="w-full">
				<DrawerFilter categories={filterCategories} onCategoryChange={handleCategoryChange} onPriceChange={handlePriceChange} />
				<TopBar viewAs={viewAs} setViewAs={setViewAs}/>
				<ProductLoadMore
					data={filteredData as InfiniteData<PaginatedProduct, unknown>}
					isLoading={isLoading}
					fetchNextPage={fetchNextPage}
					hasNextPage={hasNextPage}
					loadingMore={loadingMore}
					viewAs={viewAs}
				/>
			</div>
		</Element>
	
	);
}
