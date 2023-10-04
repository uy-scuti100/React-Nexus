import useSWR from "swr";
import { fetchSinglePostById } from "../lib/singlePostUtil";

export const useFetchSinglePost = (
   postId: string
): {
   post: any | null;
   isLoading: boolean;
   isError: boolean;
} => {
   const { data: post, error } = useSWR(
      `post-${postId}`,
      () => fetchSinglePostById(postId),
      {
         refreshInterval: 1800000,
      }
   );

   return {
      post: post || null,
      isLoading: !post && !error,
      isError: !!error,
   };
};
