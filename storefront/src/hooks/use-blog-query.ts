import {useQuery} from "@tanstack/react-query";
import {API_RESOURCES} from "@/lib/data/api-endpoints";
import {fetchBlogs} from "@/lib/data/blog";

export const useBlogsQuery = () => {
    return useQuery({
        queryKey: [API_RESOURCES.BLOGS],
        queryFn: () => fetchBlogs(),
        retry: 1,
    });
}
