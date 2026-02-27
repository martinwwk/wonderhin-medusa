import cn from 'classnames';
import {Blog} from '@/types/template';
import BlogImage from "@/components/blog/blogCardUI/blog-image";
import BlogHeading from "@/components/blog/blogCardUI/blog-heading";
import BlogDetails from "@/components/blog/blogCardUI/blog-details";

interface BlogProps {
    blog: Blog;
    className?: string;
    variant?: string;
}

const BlogCardList: React.FC<BlogProps> = ({blog, className,variant = "list"}) => {
    return (
        <article className={cn('flex flex-col xl:flex-row blog-card overflow-hidden rounded-lg w-full bg-gray-100 dark:bg-white  ',className)}>
            <BlogImage blog={blog} variant={variant} className={"basis-6/12"}/>

            <div className="basis-6/12 flex flex-col justify-center text-center py-5 px-5 sm:px-8  overflow-hidden relative">
                <BlogHeading blog={blog} useCategory={true} useDescription={true}  variant={variant} />
                <BlogDetails blog={blog} useIcon={true} variant={variant} />
            </div>
        </article>
    );
};

export default BlogCardList;
