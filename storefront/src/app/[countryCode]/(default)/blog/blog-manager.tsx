'use client';
import React, {useMemo} from "react";
import {BlogContent} from "@/app/[countrycode]/(default)/blog/blog-content";
import {BlogBigContent} from "@/app/[countrycode]/(default)/blog/blog-category-big/blog-big-content";
import {BlogListContent} from "@/app/[countrycode]/(default)/blog/blog-category-list/blog-list-content";
import Loading from "@/components/shared/loading";
import {useBlogsQuery} from "@/hooks/use-blog-query";
import Alert from "@/components/shared/alert";

export default function BlogManager({ variant }: { variant: string,}) {
    const {data, isLoading, isError, error } = useBlogsQuery();

    const blogContent = useMemo(() => {
        switch (variant) {
            case 'grid':
                return <BlogContent data={data} countPerPage={8} />;
            case 'list':
                return <BlogListContent data={data} />;
            case 'big':
                return <BlogBigContent data={data} />;
            default:
                return <BlogContent data={data} className="xl:grid-cols-3" />;
        }
    }, [variant, data]);
    
    if (isLoading)  return <Loading/>;
    if (isError)    return <Alert message={error.message}/>;
    return blogContent;
}
