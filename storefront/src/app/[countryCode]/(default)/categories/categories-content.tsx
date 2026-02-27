'use client';

import React from "react";
import {CategoryListing} from "@/components/category/category-listing";
import {useCategories} from "@/hooks/use-categories";
import Loading from "@/components/shared/loading";
import Alert from "@/components/shared/alert";
import { Category } from "@/types/template";

interface IProps {
	variant?: 'base' | 'drop-shadow' ;
	initialCategories?: Category[];
}

export default function CategoriesContent({ variant, initialCategories }: IProps) {
	const {data : categories, isLoading, isError, error} = useCategories();
	
	// Use server-fetched data if available, otherwise use query data
	const displayCategories = initialCategories || categories;
	
	if (!initialCategories && isLoading)  return <Loading/>;
	if (!initialCategories && isError)    return <Alert message={error.message}/>;
	return <CategoryListing categories = {displayCategories} variant={variant} isLoading={isLoading}/>
}
