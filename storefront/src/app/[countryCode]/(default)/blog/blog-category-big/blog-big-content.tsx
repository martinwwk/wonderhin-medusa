'use client';
import {FC, useMemo} from 'react';
import cn from 'classnames';
import BlogCardBig from "@/components/blog/blog-card-big";
import Pagination from "@/components/shared/pagination";
import {GrNext, GrPrevious} from "react-icons/gr";
import {Blog} from "@/types/template";
import {usePagination} from "@/hooks/use-pagination";

interface blogGridProps {
    data?: Blog[];
    className?: string;
}

export const BlogBigContent: FC<blogGridProps> = ({data, className = ''}) => {
    const countPerPage = 5;
    const { currentPage, filterData:blogs, updatePage } = usePagination<Blog>({
        data,
        countPerPage: countPerPage,
    });
    const blogCards = useMemo(() => {
        return blogs?.map((item: Blog) => (
            <BlogCardBig key={`blog--key-${item.id}`} blog={item} />
        ));
    }, [blogs]);
    return (
        <>
            <div
                className={cn('grid grid-cols-1 gap-2 md:gap-7',className)}>
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
