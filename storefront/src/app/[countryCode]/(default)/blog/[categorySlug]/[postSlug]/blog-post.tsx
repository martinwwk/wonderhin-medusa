'use client';
import React, {FC} from 'react';
import cn from 'classnames';
import {useBlogPostQuery} from '@/lib/data/blog';

import BlogPostCard from "@/components/blog/blog-post-card";
import Loading from "@/components/shared/loading";
import Alert from "@/components/shared/alert";

interface blogGridProps {
  className?: string;
}

export const BlogPost: FC<blogGridProps> = ({ className }) => {

  const {data, isLoading, isError, error } = useBlogPostQuery();
  if (isLoading)  return <Loading/>;
  if (isError)    return <Alert message={error.message}/>;

  return (
      <div className={cn('blog-post w-full ', className)}>
          <BlogPostCard key={`blog--post`} blogData={data}  />
      </div>
   
  );
};
