'use client';
import React, {FC} from 'react';

import Button from '@/components/shared/button';
import ProductCard from '@/components/product/productListing/productCards/product-card';
import ProductCardLoader from '@/components/shared/loaders/product-card-loader';
import ProductCardList from '@/components/product/productListing/productCards/product-list';
import {LIMITS} from '@/lib/util/limits';
import {PaginatedProduct, Product} from '@/types/template';
import {InfiniteData} from "@tanstack/react-query";
import ProductListLoader from "@/components/shared/loaders/product-list-loader";


interface ProductProps {
	data?: InfiniteData<PaginatedProduct, unknown>; // Use InfiniteData from useInfiniteQuery
	isLoading?: boolean;
	className?: string;
	fetchNextPage?: () => void;
	hasNextPage?: boolean;
	loadingMore?: boolean;
	viewAs: boolean;
}

export const ProductLoadMore: FC<ProductProps> = ({data,isLoading,fetchNextPage,hasNextPage,loadingMore,className = '', viewAs}) => {
	const limit = LIMITS.PRODUCTS_LIMITS || 15;

	return (
		<>
			<div
				className={`${viewAs ? 'grid grid-cols-2  md:grid-cols-3  gap-3 lg:gap-7.5' : 'grid grid-cols-1 gap-3 lg:gap-7.5'} ${className}`}
			>
				{isLoading  ? (
					Array.from({length: limit}).map((_, idx) => (
							viewAs ?
								<div key={`product--key-${idx}`}><ProductCardLoader uniqueKey={`product--key-${idx}`}/></div> :
								<div key={`product--key-${idx}`}><ProductListLoader uniqueKey={`product--key-${idx}`}/></div>
					))
				) : (
					data?.pages?.map((page: PaginatedProduct) => {
						return page.data.map((product: Product) => (
							viewAs ?
								<ProductCard 	 key={`product--key-${product.id}`} product={product} /> :
								<ProductCardList key={`product--key-${product.id}`} product={product} />
						));
						
					})
				)}
				{/* end of error state */}
			</div>

			<div className="mt-5 py-5 text-center">
				{hasNextPage ? (
					<Button
						loading={loadingMore}
						disabled={loadingMore}
						onClick={() => fetchNextPage?.()}
						className={'w-60 xs:capitalize'}
						variant={'formButton'}
					>
						Load More
					</Button>
				) : (
					data && data.pages && data.pages.length > 0 && (
						<p className="text-brand-dark">No more products to load</p>
					)
				)}
			</div>
		</>
	);
};
