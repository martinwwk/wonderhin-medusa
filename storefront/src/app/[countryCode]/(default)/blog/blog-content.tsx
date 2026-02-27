'use client';

import {FC, useMemo} from 'react';
import BlogCard from '@/components/blog/blog-card';
import cn from 'classnames';
import {GrNext, GrPrevious} from "react-icons/gr";
import Pagination from "@/components/shared/pagination";
import {Blog} from "@/types/template";
import {usePagination} from "@/hooks/use-pagination";

interface blogGridProps {
    data?: Blog[]; // Adjust based on your actual data structure
    className?: string;
    countPerPage?: number;
}

export const BlogContent: FC<blogGridProps> = ({data, className,countPerPage=9}) => {
    const { currentPage, filterData:blogs, updatePage } = usePagination({
        data,
        countPerPage: countPerPage,
    });

    const blogCards = useMemo(() => {
        return blogs?.map((item: Blog) => (
            <BlogCard key={`blog--key-${item.id}`} blog={item} />
        ));
    }, [blogs]);

    return (
        <>
            <div
                className={cn(
                    className,
                    'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2  gap-2 md:gap-6 lg:gap-7.5'
                )}>

                {blogCards}

            </div>
            <Pagination
                current={currentPage}
                onChange={updatePage}
                pageSize={countPerPage}
                total={data?.length}
                prevIcon={<GrPrevious size={14}  className={`m-auto my-1.5 rtl:rotate-180`}/>}
                nextIcon={<GrNext size={14}  className={`m-auto my-1.5 rtl:rotate-180`}/>}
                className="blog-pagination"
            />
        </>
    );
};

