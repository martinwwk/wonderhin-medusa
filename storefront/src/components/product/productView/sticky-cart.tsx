import React, {useCallback, useEffect} from 'react';
import {Product, VariationsType} from "@/types/template";
import { productPlaceholder } from "@/assets/placeholders";
import Container from "@/components/shared/container";
import Image from "@/components/shared/image";
import Button from "@/components/shared/button";
import ProductPricing from "@/components/product/productListing/productCardsUI/product-pricing";
import ProductDetails from "@/components/product/productListing/productCardsUI/product-details";
import {AnimatePresence, motion} from "motion/react";

interface Props {
    product?: Product;
    addToCartLoader: boolean;
    handleAddToCart: () => void;
    targetButtonRef: React.RefObject<HTMLButtonElement | null>;
    isCartVisible: boolean;
    setCartVisible: (visible: boolean) => void;
    isSelected: VariationsType;
}

const StickyCart: React.FC<Props> = ({ product, addToCartLoader, handleAddToCart, targetButtonRef, isCartVisible, setCartVisible, isSelected }) => {
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const checkScrollPosition = () => {
        if (targetButtonRef.current) {
            const Height = 50;
            const rectShowCart = targetButtonRef.current.getBoundingClientRect();
            
            if (rectShowCart.top - Height >= 0) {
                setCartVisible(false);
            } else {
                setCartVisible(true);
            }
        }
    };
    
    const renderAddtocart= useCallback(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        !isSelected && window.scrollTo({ top: 100, behavior: 'smooth' });
        handleAddToCart();
    },[handleAddToCart, isSelected])
    
    // Animation variants for the popup
    const popupVariants = {
        hidden: {opacity: 0, y: 150},
        visible: {opacity: 1, y: 0, transition: {duration: 0.3}},
        exit: {opacity: 0, y: 150, transition: {duration: 0.2}},
    };
    
    useEffect(() => {
        window.addEventListener('scroll', checkScrollPosition);
        return () => {
            window.removeEventListener('scroll', checkScrollPosition);
        };
    }, [checkScrollPosition]);
    
    return product && isCartVisible ? (
        <AnimatePresence>
        <motion.div
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full z-40 bg-white/90 fixed  left-0 bottom-0 border-t border-border-base py-2 drop-shadow  backdrop-blur-[2px]"
        >
            <Container>
                <div className="flex  gap-2 md:gap-5 items-center">
                    <div className="relative card-img-container overflow-hidden max-h-16">
                        <Image src={product.image?.thumbnail ?? productPlaceholder} width={60} height={80}
                               alt={product.name || 'Product Image'} />
                    </div>
                    <div className="flex flex-col md:flex-row gap-2 md:gap-5 md:items-center w-full">
                        <div>
                            <ProductDetails product={product} useReview={false}/>
                            <ProductPricing product={product} />
                        </div>

                        <Button
                            variant="formButton"
                            onClick={renderAddtocart}
                            className=" md:ms-auto"
                            loading={addToCartLoader}
                        >
                            Add To Cart
                        </Button>
                    </div>
                
                </div>
            </Container>
        </motion.div>
        </AnimatePresence>
    ) : null;
};

export default StickyCart;
