import {Blog} from "@/types/template";
import React from "react";
import Link from "@/components/shared/link";
import {ROUTES} from "@/utils/routes";
import cn from "classnames";

interface BlogProps {
    blog: Blog;
    variant?: string;
    useCategory?: boolean;
    useDescription?: boolean;
}
const BlogHeading: React.FC<BlogProps> = ({ blog, variant="default",useDescription,useCategory }) => {
    const {title, category, slug,shortDescription} = blog;
    const slugCategory = category.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();
    return (
        <>
            {useCategory && (
                <Link
                    href={`${ROUTES.BLOG}/${slugCategory}`}
                    className={cn("text-brand-dark")}
                >
                <div className="text-13px px-5 py-1.5  font-medium mb-2.5 border border-border-base rounded-full inline-block">{category}</div>
                </Link>
            )}

            <h4 className={cn("font-semibold  ",{
                "text-lg mb-3 ": variant === "default",
                "text-xl  mb-4": variant === "big" || variant === "list",
            }
            )}>
                <Link
                    href={`${ROUTES.BLOG}/${slugCategory}/${slug}`}
                    className={cn("text-brand-dark line-clamp-2")}
                >
                    {title}
                </Link>
            </h4>
            {useDescription && (
                <div className="text-15px pb-1 leading-6 md:leading-7 mb-4 line-clamp-2">
                    {shortDescription}
                </div>
            )}
        </>
    );
}
export default BlogHeading;