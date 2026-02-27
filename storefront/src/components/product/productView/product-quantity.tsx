import React from "react";
import { Product, VariationOption } from "@/types/template";
import isEmpty from "lodash/isEmpty";
import Counter from "@/components/shared/counter";
import {Item} from "@/lib/util/cart-utils";
import { useI18n } from "@lib/hooks/use-i18n";

interface ProductQuantityProps {
    data: Product;
    selectedVariation?: VariationOption;
    selectedQuantity: number;
    setSelectedQuantity: React.Dispatch<React.SetStateAction<number>>;
    isInCart: (id: string) => boolean;
    isInStock: (id: string) => boolean;
    getItemFromCart: (id: string) => Item | undefined;
}

const ProductQuantity: React.FC<ProductQuantityProps> = ({
                                                             data,
                                                             selectedVariation,
                                                             selectedQuantity,
                                                             setSelectedQuantity,
                                                             isInCart,
                                                             isInStock,
                                                             getItemFromCart,
                                                         }) => {
    const { t } = useI18n();
    const variations = data.variations;
    // Ensure itemId is a string by using toString() or type assertion
    const itemId = (selectedVariation ? selectedVariation.id : data.id).toString();
    const outOfStock = isInCart(itemId) && !isInStock(itemId);
    // Safely handle data.quantity with a fallback
    const availableQuantity = data.quantity ?? 0;

    return (
        <div className="pb-2">
            {isEmpty(variations) && (
                <>  
                    {availableQuantity > 0 || !outOfStock ? (
                        <span className="text-sm text-yellow">
              {t('piecesAvailable', { count: availableQuantity })}
            </span>
                    ) : (
                        <div className="text-base text-brand-danger whitespace-nowrap">{t('outStock')}</div>
                    )}
                </>
            )}
            {!isEmpty(selectedVariation) && (
                <span className="text-sm text-yellow">
          {selectedVariation?.is_disable || selectedVariation.quantity === 0
              ? t('outStock')
              : t('piecesAvailable', { count: selectedVariation.quantity })}
        </span>
            )}
            <div className="pt-1.5 lg:pt-3 xl:pt-5 space-y-2.5 md:space-y-3.5">
                <label className="font-medium text-sm text-brand-dark mb-1.5 inline-block">{t('quantityLabel')}</label>
                <Counter
                    variant="single"
                    value={selectedQuantity}
                    onIncrement={() => setSelectedQuantity((prev) => prev + 1)}
                    onDecrement={() => setSelectedQuantity((prev) => (prev !== 1 ? prev - 1 : 1))}
                    disabled={
                        isInCart(itemId)
                            ? (getItemFromCart(itemId)?.quantity ?? 0) + selectedQuantity >=
                            Number(selectedVariation?.quantity ?? availableQuantity)
                            : selectedQuantity >= Number(selectedVariation?.quantity ?? availableQuantity)
                    }
                />
            </div>
        </div>
    );
};

export default ProductQuantity;