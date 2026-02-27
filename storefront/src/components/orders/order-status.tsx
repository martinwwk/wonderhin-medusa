import { useOrderStatusQuery } from '@/lib/data/template-orders';
import ProgressBox from '@/components/orders/progress-box';

interface Props {
  status: number;
}

const OrderStatus = ({ status }: Props) => {
  const { data, isLoading } = useOrderStatusQuery();
  // Provide a fallback if data is undefined
  if (isLoading || !data) {
    return <div>Loading...</div>;
  }
  return <ProgressBox data={data} status={status} />;
};

export default OrderStatus;
