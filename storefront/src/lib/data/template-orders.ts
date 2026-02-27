import { QueryOptionsType } from '@/types/template';
import http from '@/lib/data/http';
import { API_RESOURCES } from '@/lib/data/api-endpoints';
import { useQuery } from '@tanstack/react-query';
import { Order } from '@/types/template';
import {ProgressData, ProgressItem} from "@/components/orders/progress-box";

// Template order fetchers (from local JSON API)
const fetchOrders = async () => {
  try {
    const { data } = await http.get(API_RESOURCES.ORDERS);
    return {
      data: data,
    };
  } catch (error) {
    console.error('Error fetching Order data:', error);
    throw new Error('Unable to load Order content at the moment. Please try again later.');
  }
};

export const useOrdersQuery = (options: QueryOptionsType) => {
  return useQuery({
    queryKey: [API_RESOURCES.ORDERS, options],
    queryFn: fetchOrders,
    retry: 1,
  });
};

export const fetchOrder = async (_id: string) => {
  try {
    const { data } = await http.get(`${API_RESOURCES.ORDER}`);
    return data;
  } catch (error) {
    console.error('Error fetching Order data:', error);
    throw new Error('Unable to load Order content at the moment. Please try again later.');
  }
};

export const useOrderQuery = (id: string) => {
  return useQuery<Order, Error>({
    queryKey: ["order", id],
    queryFn: () => fetchOrder(id),
    retry: 1,
  });
};

const fetchOrderStatus = async (): Promise<ProgressData> => {
  try {
    const { data } = await http.get<ProgressItem[]>(API_RESOURCES.ORDER_STATUS);
    return {
      data: data,
    };
  } catch (error) {
    console.error('Error fetching Order data:', error);
    throw new Error('Unable to load Order content at the moment. Please try again later.');
  }
};

export const useOrderStatusQuery = () => {
  return useQuery<ProgressData>({
    queryKey: [API_RESOURCES.ORDER_STATUS],
    queryFn: fetchOrderStatus,
    retry: 1,
  });
};

export { fetchOrders, fetchOrderStatus };
