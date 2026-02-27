'use client';
import {FC, useMemo} from 'react';
import cn from 'classnames';
import BlogCardList from '@/components/blog/blog-card-list';
import {GrNext, GrPrevious} from "react-icons/gr";
import Pagination from "@/components/shared/pagination";
import {Blog} from "@/types/template";
import {usePagination} from "@/hooks/use-pagination";

interface blogGridProps {
    data?: Blog[]; // Adjust based on your actual data structure
    className?: string;
}

export const BlogListContent: FC<blogGridProps> = ({data, className = ''}) => {

    const countPerPage = 5;
    const { currentPage, filterData:blogs, updatePage } = usePagination({
        data,
        countPerPage: countPerPage,
    });
    const blogCards = useMemo(() => {
        return blogs?.map((item: Blog) => (
            <BlogCardList key={`blog--key-${item.id}`} blog={item} />
        ));
    }, [blogs]);
    return (
        <>
            <div
                className={cn(
                    'grid grid-cols-1 gap-4 md:gap-10 ',
                    className
                )}
                >
                {blogCards}

                {/* end of error state */}
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
