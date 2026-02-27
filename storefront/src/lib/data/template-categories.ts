import { Category } from '@/types/template';
import http from '@/lib/data/http';
import { API_RESOURCES } from '@/lib/data/api-endpoints';

export const fetchCategories = async () => {
  try {
    const { data } = await http.get(API_RESOURCES.CATEGORIES);
    return data as Category[];
  } catch (error) {
    console.error('Error fetching Category data:', error);
    throw new Error('Unable to load category content at the moment. Please try again later.');
  }
};
