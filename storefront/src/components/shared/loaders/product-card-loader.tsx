import ContentLoader from 'react-content-loader';
import {ContentLoaderProps} from "@/types/template";

const ProductCardLoader = (props: ContentLoaderProps) => (
    <ContentLoader
        speed={2}
        width={330}
        height={540}
        viewBox="0 0 330 540"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        className="w-full h-auto"
        {...props}
    >
        <rect x="1" y="1" rx="15" ry="15" width="325" height="450" />
        <rect x="12" y="471" rx="3" ry="3" width="300" height="10" />
        <rect x="72" y="500" rx="3" ry="3" width="150" height="10" />
        <rect x="52" y="529" rx="3" ry="3" width="200" height="10" />
    </ContentLoader>
);

export default ProductCardLoader;
