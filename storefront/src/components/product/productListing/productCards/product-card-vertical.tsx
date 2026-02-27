import React from "react";
import cn from 'classnames';
import Image from '@/components/shared/image';
import {Product} from '@/types/template';
import {productPlaceholder} from '@/assets/placeholders';
import ProductDetails from "@/components/product/productListing/productCardsUI/product-details";
import ProductPricing from "@/components/product/productListing/productCardsUI/product-pricing";

interface ProductProps {
	product: Product;
	className?: string;
	variant?: string;
}

const ProductCardVertical: React.FC<ProductProps> = ({
	                                                     product,
	                                                     className='',
	                                                     variant = "default"
                                                     }) => {
	const { name, image } = product ?? {};
	
	return (
		<article
			className={cn(
				'product-card overflow-hidden relative grid grid-cols-12 gap-2', {
					'pt-3 pb-3'  : variant ==='cardList',
				},
				className,
			)}
		>
			<div className="col-span-4 relative product-card-img">
				<div className="card-img-container overflow-hidden rounded mb-3">
					<Image
						src={image?.thumbnail ?? productPlaceholder}
						alt={name || 'Product Image'}
						width={85}
						height={115}
					/>
				</div>
			</div>
			
			<div className="col-span-8 relative product-card-content">
				<ProductDetails product={product} variant={variant}/>
				<ProductPricing product={product} variant={variant}/>
			</div>
		</article>
	);
};

export default ProductCardVertical;
