'use client';
import { Element } from 'react-scroll';
import React, { useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import DrawerFilter from "@/components/filter/drawer-filter";
import TopBar from "@/components/category/top-bar";
import Filters from "@/components/filter/filters";
import Heading from "@/components/shared/heading";
import { ProductMain } from "@/components/product/productListing/product-main";
import { useProductsQuery } from "@/hooks/use-all-products";
import Alert from "@/components/shared/alert";
import useQueryParam from "@/utils/use-query-params";
import { LIMITS } from "@/lib/util/limits";
import { useI18n } from "@lib/hooks/use-i18n";

export default function PageContent({ regionId }: { regionId: string }) {
	const [viewAs, setViewAs] = useState(Boolean(true));
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { t } = useI18n();

	const searchTerm = searchParams.get('q') || '';

	// Read sort_by from URL (e.g., ?sort_by=new-arrival)
	const { getParams, query } = useQueryParam(pathname ?? '/');
	const urlQuery: { sort_by?: string } = getParams(
		`${process.env.NEXT_PUBLIC_WEBSITE_URL ?? ''}${query}`,
	);
	const sortBy = urlQuery.sort_by ?? searchParams.get('sort_by') ?? undefined;

	const { data: searchResults, isLoading, isError, error } = useProductsQuery({
		q: searchTerm,
		sort_by: sortBy,
		limit: LIMITS.PRODUCTS_LIMITS,
		regionId,
	});

	if (isError) return <Alert message={error.message} />;

	const resultCount = searchResults?.length ?? 0;

	return (
		<Element name="search" className="flex products-category gap-7 lg:gap-15">
			<div className="sticky hidden lg:block h-full shrink-0 w-[270px] top-16">
				<Filters />
			</div>
			<div className="w-full">
				<div className="sm:flex items-center justify-center mb-3 filters-panel pb-2 xl:pb-3 text-center border-b-1 border-black/10">
					{isLoading ? (
						<Heading variant="titleMedium">{t('loading')}</Heading>
					) : (
						<Heading variant="titleMedium">
							{`${resultCount} ${t('results') ?? 'results'} "${searchTerm}"`}
						</Heading>
					)}
				</div>
				<DrawerFilter />
				<TopBar viewAs={viewAs} setViewAs={setViewAs} />
				<ProductMain data={searchResults} isLoading={isLoading} viewAs={viewAs} />
			</div>
		</Element>
	);
}

