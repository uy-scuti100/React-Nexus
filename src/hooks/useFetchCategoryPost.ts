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
        revalidateOnMount: true
      }
   );

   return {
      posts,
      isLoading: !posts && !error,
      isError: !!error,
   };
};

