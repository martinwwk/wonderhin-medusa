import React, { FC, useEffect, useRef } from 'react';

import ProductCard from '@/components/product/productListing/productCards/product-card';
import ProductCardLoader from '@/components/shared/loaders/product-card-loader';
import ProductCardList from '@/components/product/productListing/productCards/product-list';
import {PaginatedProduct, Product} from '@/types/template';
import {InfiniteData} from "@tanstack/react-query";
import ProductListLoader from "@/components/shared/loaders/product-list-loader";

interface ProductGridProps {
    data?: InfiniteData<PaginatedProduct, unknown>; // Use InfiniteData from useInfiniteQuery
    isLoading?: boolean;
    className?: string;
    fetchNextPage?: () => void;
    hasNextPage?: boolean;
    loadingMore?: boolean;
    viewAs: boolean;
}

export const ProductInfinity: FC<ProductGridProps> = ({
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    loadingMore,
    className = '',
    viewAs
}) => {
    const limit =  12;
    const observerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!hasNextPage || loadingMore || isLoading) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchNextPage?.();
                }
            },
            {
                root: null,
                rootMargin: '200px',
                threshold: 0
            }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, [hasNextPage, loadingMore, isLoading, fetchNextPage]);

    return (
        <>
            <div className={`${viewAs ? 'grid grid-cols-2  md:grid-cols-3 xl:grid-cols-5 gap-3 lg:gap-7.5' : 'grid grid-cols-1 gap-3 lg:gap-7.5'} ${className}`}>
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
            </div>
            
            <div
                ref={observerRef}
                className="mt-5 py-5 text-center "
            >
            {hasNextPage ? (
                loadingMore && (
                    <div className="text-center">Loading more products...</div>
                )
            ) : (
                data && data.pages && data.pages.length > 0 && (
                    <p className="text-brand-dark">No more products to load</p>
                )
            )}
            </div>
        </>
    );
};