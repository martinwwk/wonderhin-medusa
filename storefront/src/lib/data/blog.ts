import {Blog} from '@/types/template';
import { API_RESOURCES } from '@/lib/data/api-endpoints';
import http from '@/lib/data/http';
import {useQuery} from '@tanstack/react-query';

export const fetchBlogs = async () => {
  try {
    const { data } = await http.get(API_RESOURCES.BLOGS);
    return data as Blog[] ;
  } catch (error) {
    console.error('Error fetching blog data:', error);
    throw new Error('Unable to load blog content at the moment. Please try again later.');
  }
};

const fetchBlogPost = async () => {
  try {
    const { data } = await http.get(API_RESOURCES.BLOGDETAILS);
    return data;
  } catch (error) {
    console.error('Error fetching blog post data:', error);
    throw new Error('Unable to load blog content at the moment. Please try again later.');
  }
};

export const useBlogPostQuery = () => {
  return useQuery({
    queryKey: ['blogPost'],
    queryFn: () => fetchBlogPost(),
    retry: 1,
  });
};

export { fetchBlogPost };
