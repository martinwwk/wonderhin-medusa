import ContentLoader from 'react-content-loader';
import {ContentLoaderProps} from "@/types/template";

const ProductListLoader = (props: ContentLoaderProps) => (
    <ContentLoader
        speed={2}
        width={1080}
        height={370}
        viewBox="0 0 1080 370"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        {...props}
    >
        <rect x="0" y="0" rx="10" ry="10" width="300" height="370" />
        <rect x="330" y="25" rx="3" ry="3" width="529" height="30" />
        <rect x="330" y="83" rx="3" ry="3" width="60" height="10" />
        <rect x="330" y="103" rx="3" ry="3" width="102" height="10" />
        <rect x="330" y="140" rx="3" ry="3" width="822" height="70" />
        <rect x="330" y="241" rx="20" ry="20" width="158" height="43" />
        <circle cx="520" cy="261" r="22" />
        <circle cx="577" cy="262" r="22" />
    </ContentLoader>
);

export default ProductListLoader;
