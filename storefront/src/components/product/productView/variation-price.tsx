import usePrice from '@/lib/util/use-price';
import isEmpty from 'lodash/isEmpty';
import cn from "classnames";
import {VariationOption} from "@/types/template";

// Define the props interface
interface VariationPriceProps {
    selectedVariation?: VariationOption; // Optional, as it’s checked with isEmpty
    minPrice: number;
    maxPrice: number;
}
export default function VariationPrice({
  selectedVariation,
  minPrice,
  maxPrice,
}: VariationPriceProps) {

  const { price, basePrice, discount } = usePrice(
    selectedVariation && {
      amount: selectedVariation.sale_price
        ? selectedVariation.sale_price
        : selectedVariation.price,
      baseAmount: selectedVariation.price,
      currencyCode: 'USD',
    }
  );
  const { price: min_price } = usePrice({
    amount: minPrice,
    currencyCode: 'USD',
  });
  const { price: max_price } = usePrice({
    amount: maxPrice,
    currencyCode: 'USD',
  });
  return (
    <div className="flex items-center mt-5">
      <div className={cn("text-brand-dark"," font-semibold text-[26px]")}>
        {!isEmpty(selectedVariation)
          ? `${price}`
          : `${min_price} - ${max_price}`}
      </div>
      {discount && (
          <>
              <del className="text-sm  md:text-xl ltr:pl-3 rtl:pr-3 text-brand-dark/50">
                  {basePrice}
              </del>
              <span
                  className="inline-block rounded-full  text-[13px]  bg-brand-sale bg-opacity-20 text-brand-light uppercase px-2 py-1 ltr:ml-2.5 rtl:mr-2.5">
                       {discount} Off
               </span>
          </>
      )}
    </div>
  );
}
