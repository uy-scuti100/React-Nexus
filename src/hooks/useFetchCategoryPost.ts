import useSWR from "swr";
import { fetchCategoryPosts } from "../lib/fetchCategoryPostUtil"; // Update the import
import { Post } from "../../types";

export const useFetchCategoryPost = (
   paramsId: string
): {
   posts: Post[] | null | undefined;
   isLoading: boolean;
   isError: boolean;
} => {
   const { data: posts, error } = useSWR(
      paramsId ? `categoryPosts-${paramsId}` : null,
      () => fetchCategoryPosts(paramsId), // Update the function name here
      {
        revalidateOnMount: true
      }
   );

   return {
      posts,
      isLoading: !posts && !error,
      isError: !!error,
   };
};
