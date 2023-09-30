import useSWR from "swr";
import { fetchSinglePostById } from "../lib/singlePostUtil";

export const useFetchSinglePost = (
   postId: string
): {
   post: any; // Make post property optional
   isLoading: boolean;
   isError: boolean;
} => {
   const { data: post, error } = useSWR(
      `post-${postId}`,
      () => fetchSinglePostById(postId),
      {
         refreshInterval: 1800000, // 30 minutes
      }
   );

   return {
      post, // It can be undefined
      isLoading: !post && !error,
      isError: !!error,
   };
};
