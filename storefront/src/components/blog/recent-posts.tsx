'use client';

import Image from '@/components/shared/image';
import LocalizedClientLink from "@/modules/common/components/localized-client-link";
import {productPlaceholder} from "@/assets/placeholders";
import {ROUTES} from "@/utils/routes";
import { usePanel } from "@/hooks/use-panel";
import { colorMap } from "@/data/color-settings";
import cn from "classnames";
import {useBlogsQuery} from "@/hooks/use-blog-query";
import React, {useMemo} from "react";
import Heading from "@/components/shared/heading";
import Loading from "@/components/shared/loading";
import Alert from "@/components/shared/alert";

export default function RecentPosts() {
    const {data:dataPosts, isLoading, isError, error} = useBlogsQuery();
    const { selectedColor } = usePanel();
    
    const recentPostItems = useMemo(() => {
        if (!dataPosts) return null;
        return dataPosts.slice(0, 5).map((post) => (
            <LocalizedClientLink
                href={`${ROUTES.BLOG}/${post.category}/${post.slug}`}
                key={post.id}
                className="flex gap-3 group"
            >
                <div className="card-img-container flex overflow-hidden max-w-[80px] relative rounded">
                    <Image
                        variant={"cover"}
                        src={post.image ?? productPlaceholder}
                        alt={post.title || 'Product Image'}
                        width={150}
                        height={100}
                    />
                </div>
                <div className={"w-full"}>
                    <h3 className={cn(
                        "font-medium text-sm text-brand-dark mb-1.5",
                        colorMap[selectedColor].groupHoverLink
                    )}>
                        {post.title}
                    </h3>
                    <p className="text-13px text-gray-500">{post.date}</p>
                </div>
            </LocalizedClientLink>
        ));
    }, [dataPosts, selectedColor]);
    if (isLoading)  return <Loading/>;
    if (isError)    return <Alert message={error.message}/>;
    return (
        <div className="w-full ">
            <Heading variant="titleMedium" className="mb-5">Recent Posts</Heading>
            <div className="space-y-5 ">
                {recentPostItems}
            </div>
        </div>
    )
}

