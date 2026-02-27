import usePrice from '@/lib/util/use-price';
import {calculateTotal, Item} from '@/lib/util/cart-utils';
import {Order} from "@/types/template";

// Define types for discount and delivery parameters
interface DiscountData {
  discount: number;
}

interface DeliveryData {
  delivery: number;
}


export const TotalPrice: React.FC<{ items: Order }> = ({ items }) => {
  const { price } = usePrice({
    amount: Math.round(
        calculateTotal(items?.products) + (items?.delivery_fee ?? 0) - (items?.discount ?? 0),
    ),
    currencyCode: 'USD',
  });
  return <span className="total_price text-brand-dark font-semibold">{price}</span>;
};

export const DiscountPrice = (discount: DiscountData) => {
  const { price } = usePrice({
    amount: discount?.discount,
    currencyCode: 'USD',
  });
  return <>-{price}</>;
};

export const DeliveryFee = (delivery: DeliveryData) => {
  const { price } = usePrice({
    amount: delivery?.delivery,
    currencyCode: 'USD',
  });
  return <>{price}</>;
};

export const SubTotalPrice: React.FC<{ items: Item[] }> = ({ items =[] }) => {
  const { price } = usePrice({
    amount: calculateTotal(items),
    currencyCode: 'USD',
  });
  return <>{price}</>;
};
