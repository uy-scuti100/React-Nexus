import useSWR from "swr";
import { fetchCategoryPost } from "../lib/fetchCategoryPostUtil";
import { Post } from "../../types";

export const useFetchCategoryPost = (
   categoryId: string
): {
   posts: Post[] | null | undefined;
   isLoading: boolean;
   isError: boolean;
} => {
   const { data: posts, error } = useSWR(
      categoryId ? `categoryPosts-${categoryId}` : null,
      () => fetchCategoryPost(categoryId),
      {
         refreshInterval: 1800000, // 30 minutes
      }
   );

   return {
      posts,
      isLoading: !posts && !error,
      isError: !!error,
   };
};

// {
//    revalidateOnFocus: false, // Disable revalidation on window focus (optional)
//    revalidateOnReconnect: false, // Disable revalidation on reconnect (optional)
//    refreshInterval: 600000, // Set revalidation time in milliseconds (e.g., 1 minute)
// }
