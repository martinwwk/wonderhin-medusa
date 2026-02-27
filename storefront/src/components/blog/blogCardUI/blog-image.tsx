import {Blog} from "@/types/template";
import React, {useMemo} from "react";
import Link from "@/components/shared/link";
import {ROUTES} from "@/utils/routes";
import Image from "@/components/shared/image";
import {productPlaceholder} from "@/assets/placeholders";
import cn from "classnames";

interface BlogProps {
    blog: Blog;
    variant?: string;
    className?: string;
}
const BlogImage: React.FC<BlogProps> = ({ blog, variant="default",className }) => {
    const {title, image, slug,category} = blog;
    const slugCategory = category.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();
    const imgSize = useMemo(() => {
        switch (variant) {
            case 'big':
                return {width:1040, height:420};
            case 'list':
                return {width:768, height:430};
            default:
                return {width:525, height:300};
        }
    }, [variant]);
    return (
        <div className={cn("relative flex-shrink-0", className)}>
            <Link
                href={`${ROUTES.BLOG}/${slugCategory}/${slug}`}
                className="text-brand-dark flex "
            >
                <div
                    className="card-img-container inline-flex overflow-hidden  relative ">
                    <Image
                        src={image ?? productPlaceholder}
                        alt={title || 'Product Image'}
                        width={imgSize.width}
                        height={imgSize.height}
                        rootClassName={"h-full rounded-xl overflow-hidden"}
                        className="duration-500 ease-out hover:scale-105"
                    />
                </div>
            </Link>
        </div>
    );
}
export default BlogImage;