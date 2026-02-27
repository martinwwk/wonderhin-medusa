import ContentLoader from 'react-content-loader';
import {ContentLoaderProps} from "@/types/template";

const CategoryCardLoader = (props: ContentLoaderProps) => (
    <ContentLoader
        speed={2}
        width={330}
        height={430}
        viewBox="0 0 330 430"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        className="w-full h-auto"
        {...props}
    >
        <rect x="1" y="1" rx="15" ry="15" width="325" height="325" />
    </ContentLoader>
);

export default CategoryCardLoader;
