import { useState, useMemo } from 'react';
import { Blog, Category, Product } from "@/types/template";

interface UseBlogPaginationProps<T extends Blog | Category | Product> {
    data?: T[];
    countPerPage?: number;
}

interface UseBlogPaginationReturn<T extends Blog | Category | Product> {
    currentPage: number;
    filterData: T[];
    updatePage: (page: number) => void;
}

export const usePagination = <T extends Blog | Category | Product>({
                                                                       data = [] as T[],
                                                                           countPerPage = 8,
                                                                       }: UseBlogPaginationProps<T>): UseBlogPaginationReturn<T> => {
    const [currentPage, setCurrentPage] = useState(1);

    const filterData = useMemo(() => {
        if (data) {
            const to = countPerPage * currentPage;
            const from = to - countPerPage;
            return data.slice(from, to);
        }
        return [] as T[];
    }, [data, currentPage, countPerPage]);

    const updatePage = (page: number) => {
        setCurrentPage(page);
    };

    return {
        currentPage,
        filterData,
        updatePage,
    };
};