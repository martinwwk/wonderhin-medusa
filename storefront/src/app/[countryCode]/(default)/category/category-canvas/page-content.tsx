'use client';

import React, {useState} from "react";
import TopBar from "@/components/category/top-bar";
import DrawerFilter from "@/components/filter/drawer-filter";
import {LIMITS} from "@/lib/util/limits";
import {usePathname} from "next/navigation";
import useQueryParam from "@/utils/use-query-params";
import {ProductMain} from "@/components/product/productListing/product-main";
import { useProductsQuery } from "@/hooks/use-all-products";
import Loading from "@/components/shared/loading";
import Alert from "@/components/shared/alert";

export default function PageContent() {
	const [viewAs, setViewAs] = useState(Boolean(true));
	const pathname = usePathname();
	const { getParams, query } = useQueryParam(pathname ?? '/');
	const newQuery: { sort_by?: string } = getParams(
		`${process.env.NEXT_PUBLIC_WEBSITE_URL}${query}`,
	);
	// Get category query parameters
	const limit = LIMITS.PRODUCTS_LIMITS;
	const { data, isLoading, isError, error } = useProductsQuery({
		limit: limit,
		sort_by: newQuery.sort_by,
	});
	if (isLoading)  return <Loading/>;
	if (isError)    return <Alert message={error.message}/>;
	
	return (
		<div className=" products-category">
			
			<div className="w-full">
				<div className={"lg:flex"}>
					<DrawerFilter  isDesktop={true}/>
					<TopBar viewAs={viewAs} setViewAs={setViewAs}/>
				</div>
				<ProductMain data={data} isLoading={isLoading} viewAs={viewAs}/>
			</div>
		</div>
	
	);
}
