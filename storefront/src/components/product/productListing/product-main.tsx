import React, {FC} from 'react';
import ProductCard from '@/components/product/productListing/productCards/product-card';
import ProductCardLoader from '@/components/shared/loaders/product-card-loader';
import ProductCardList from '@/components/product/productListing/productCards/product-list';
import {LIMITS} from '@/lib/util/limits';
import {Product} from '@/types/template';
import {GrNext, GrPrevious} from "react-icons/gr";
import Pagination from "@/components/shared/pagination";
import Link from "@/components/shared/link";
import {ROUTES} from "@/utils/routes";
import ProductListLoader from "@/components/shared/loaders/product-list-loader";
import {usePagination} from "@/hooks/use-pagination";

interface ProductGridProps {
	data?: Product[]; // Adjust based on your actual data structure
	isLoading: boolean;
	className?: string;
	viewAs: boolean;
}

export const ProductMain: FC<ProductGridProps> = ({data,isLoading,className = '', viewAs}) => {
	
	const countPerPage = LIMITS.PRODUCTS_LIMITS;
	
	const { currentPage, filterData:categories, updatePage } = usePagination({
		data: data,
		countPerPage: countPerPage,
	});
	
	return (
		<>
			{isLoading ? (
				<div className={`${viewAs  ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4  gap-3 lg:gap-7.5': 'grid grid-cols-1 gap-5 md:gap-7.5'} ${className}`}>
					{Array.from({length: countPerPage}).map((_, idx) => (
						viewAs ?
							<div key={`product--key-${idx}`}><ProductCardLoader uniqueKey={`product--key-${idx}`}/></div> :
							<div key={`product--key-${idx}`}><ProductListLoader uniqueKey={`product--key-${idx}`}/></div>
						))
					}
				</div>
			) : (
				!data?.length ? (
					<div className=" w-full flex flex-col items-center justify-center py-16 lg:py-30 bg-white rounded-md">
						<h2 className="text-xl  font-semibold text-brand-dark mb-10">Products Not Showing Up</h2>
						<Link href={ROUTES.HOME} variant={"button-black"} className={"min-w-60"}>
							Continue shopping
						</Link>
					</div>
				) : (
					<div className={`${viewAs  ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4  gap-3 lg:gap-7.5': 'grid grid-cols-1 gap-5 md:gap-7.5'} ${className}`}>
						{categories?.map((product: Product) => (
							viewAs ?
								<ProductCard 	 key={`product--key-${product.id}`} product={product} /> :
								<ProductCardList key={`product--key-${product.id}`} product={product} />
							))
						}
					</div>
				)
			)}
			
			<Pagination
				current={currentPage}
				onChange={updatePage}
				pageSize={countPerPage}
				total={Array.isArray(data) ? data.length : 0} // Fallback to 0 if data is not an array
				prevIcon={<GrPrevious size={14}  className={`m-auto my-1.5 rtl:rotate-180`}/>}
				nextIcon={<GrNext size={14}  className={`m-auto my-1.5 rtl:rotate-180`}/>}
				className="blog-pagination  xs:mt-2"
			/>
			
			
		</>
	);
};
