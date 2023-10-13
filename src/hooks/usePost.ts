
import useSWR from "swr";
import { fetchPosts } from "../lib/postUtils";

export const usePost = () => {
   const { data, error } = useSWR("posts", fetchPosts, {
      revalidateOnMount: true,
      revalidateOnFocus: false,
   });

   const posts = data || null;

   const isLoading = !data && !error;
   const isError = !!error;

   return {
      posts,
      isLoading,
      isError,
   };
};




