import {Blog} from "@/types/template";
import React from "react";
import {BsClock} from "react-icons/bs";
import cn from "classnames";
import {usePanel} from "@/hooks/use-panel";
import {colorMap} from "@/data/color-settings";
interface BlogProps {
    blog: Blog;
    variant?: string;
    useIcon?: boolean;
}
const BlogDetails: React.FC<BlogProps> = ({ blog, variant="default",useIcon }) => {
    const {date, authorName} = blog;
    const { selectedColor } = usePanel();
    return (
        <div className={cn("entry-meta text-sm  flex flex-wrap",{
                "justify-center": variant === "default" || variant === "list",
                "justify-start": variant === "big",
            }
            )}>
            <span className="post-on pe-2.5 relative flex items-center gap-1.5">
                Post by <span className={colorMap[selectedColor].text}>{authorName}</span>
            </span>
            <span className="has-dot px-2.5 relative  flex items-center gap-1.5">
                {useIcon && <BsClock className="transition"/>}
                {date}
            </span>
            <span className="has-dot ps-2.5 relative inline-block">0 Comments</span>
        </div>
    );
}
export default BlogDetails;