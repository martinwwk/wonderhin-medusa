import React from "react";
import { Product } from "@/types/template";
import { X } from "lucide-react";
import Button from "@/components/shared/button";

interface ProductActionsProps {
    product: Product;
    removeWishlist?: (id: string) => void;
}

const BtnRemoveWishlist: React.FC<ProductActionsProps> = ({
                                                           product,
                                                           removeWishlist,
                                                       }) => {
    const { id } = product;
    
    return (
        <>
            {removeWishlist && (
                <Button
                    variant={"white-w45"}
                    className={"absolute z-2 top-3 end-3"}
                    onClick={() => removeWishlist(String(id))}
                >
                    <X size={18} strokeWidth={1} />
                    <span className="sr-only">Remove from Wishlist</span>
                </Button>
            )}
           
        </>
    );
};

export default BtnRemoveWishlist;