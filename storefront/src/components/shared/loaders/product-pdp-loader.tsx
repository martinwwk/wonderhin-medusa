
import ContentLoader from 'react-content-loader';
import {ContentLoaderProps} from "@/types/template";

const ProductPDPLoader = (props: ContentLoaderProps) => (
    <ContentLoader
        speed={2}
        width={1270}
        height={860}
        viewBox="0 0 1270  860"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        {...props}
    >
        {/* Vertical Thumbnails */}
        <rect x="0" y="10" rx="5" ry="5" width="80" height="80" />
        <rect x="0" y="100" rx="5" ry="5" width="80" height="80" />
        <rect x="0" y="190" rx="5" ry="5" width="80" height="80" />
        <rect x="0" y="280" rx="5" ry="5" width="80" height="80" />
        <rect x="0" y="370" rx="5" ry="5" width="80" height="80" />
        
        {/* Main Image */}
        <rect x="100" y="10" rx="10" ry="10" width="515" height="696" />
        
        {/* Product Title */}
        <rect x="660" y="10" rx="4" ry="4" width="400" height="30" />
        
        {/* Rating */}
        <rect x="660" y="60" rx="4" ry="4" width="120" height="20" />
        
        {/* Price */}
        <rect x="660" y="100" rx="4" ry="4" width="150" height="30" />
        
        {/* Product details */}
        <rect x="660" y="170" rx="3" ry="3" width="250" height="20" />
        <rect x="660" y="200" rx="3" ry="3" width="230" height="20" />
        <rect x="660" y="230" rx="3" ry="3" width="270" height="20" />
        <rect x="660" y="260" rx="3" ry="3" width="220" height="20" />
        
        {/* Color options */}
        <rect x="660" y="320" rx="20" ry="20" width="40" height="40" />
        <rect x="720" y="320" rx="20" ry="20" width="40" height="40" />
        <rect x="780" y="320" rx="20" ry="20" width="40" height="40" />
        <rect x="840" y="320" rx="20" ry="20" width="40" height="40" />
        
        {/* Memory options */}
        <rect x="660" y="380" rx="5" ry="5" width="80" height="35" />
        <rect x="760" y="380" rx="5" ry="5" width="80" height="35" />
        <rect x="860" y="380" rx="5" ry="5" width="80" height="35" />
        
        {/* Quantity selector */}
        <rect x="660" y="450" rx="5" ry="5" width="150" height="35" />
        
        {/* Buttons */}
        <rect x="660" y="520" rx="8" ry="8" width="280" height="50" />
        <rect x="960" y="520" rx="8" ry="8" width="50" height="50" />
        <rect x="1030" y="520" rx="8" ry="8" width="50" height="50" />
        <rect x="660" y="590" rx="8" ry="8" width="560" height="50" />
    </ContentLoader>
);

export default ProductPDPLoader;
