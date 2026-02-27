import {Blog} from "@/types/template";
import React from "react";
import Link from "@/components/shared/link";
import {ROUTES} from "@/utils/routes";
import cn from "classnames";
import {colorMap} from "@/data/color-settings";
import {usePanel} from "@/hooks/use-panel";
import {BsArrowRight} from "react-icons/bs";

interface BlogProps {
    blog: Blog;
    variant?: string;
}
const BlogReadMore: React.FC<BlogProps> = ({ blog }) => {
    const { slug,category} = blog;
    const { selectedColor } = usePanel();
    const slugCategory = category.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();
    return (
        <Link
            href={`${ROUTES.BLOG}/${slugCategory}/${slug}`}
            className={cn(" rounded-full text-white px-4 lg:px-5 py-2.5 xs:hover:text-brand-light text-13px flex items-center gap-1.5 bg-brand-dark",
                colorMap[selectedColor].hoverBg,
            )}
        >
            Read More
            <BsArrowRight className={`rtl:rotate-180`}/>
        </Link>
    );
}
export default BlogReadMore;