import { Metadata } from 'next';
import OrdersContent from "@/app/[countrycode]/(default)/(account)/account-order/orders-content";

export const metadata: Metadata = {
  title: 'My Orders',
};

export default async function OrdersTablePage() {
  return <OrdersContent />;
}
