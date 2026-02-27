'use client';
import React, {useState} from "react";
import { Element } from 'react-scroll';
import {useSearchParams} from "next/navigation";
import DrawerFilter from "@/components/filter/drawer-filter";
import TopBar from "@/components/category/top-bar";
import Filters from "@/components/filter/filters";
import Heading from "@/components/shared/heading";
import {ProductMain} from "@/components/product/productListing/product-main";
import {useSearchQuery} from "@/hooks/use-search-query";
import Alert from "@/components/shared/alert";

export default function PageContent() {
	const [viewAs, setViewAs] = useState(Boolean(true));
	// Get search and category query parameters
	const searchParams = useSearchParams();
	const searchTerm = searchParams.get('q') || '';
	const { data: searchResults, isLoading, isError, error } = useSearchQuery({
		text: searchTerm,
	});
	if (isError)    return <Alert message={error.message}/>;
	return (
		<Element name="category" className="flex products-category gap-7 lg:gap-15">
			<div className="sticky hidden lg:block h-full shrink-0  w-[270px] top-16 ">
				<Filters/>
			</div>
			<div className="w-full">
				<div className="sm:flex items-center justify-center mb-3 filters-panel   pb-2 xl:pb-3 text-center border-b-1 border-black/10">
					<Heading variant={"titleMedium"}>{`${searchResults?.length ?? ''} results for "${searchTerm}"`}</Heading>
				</div>
				<DrawerFilter/>
				<TopBar viewAs={viewAs} setViewAs={setViewAs}/>
				<ProductMain data={searchResults} isLoading={isLoading} viewAs={viewAs}/>
				</div>
		</Element>

);
}
