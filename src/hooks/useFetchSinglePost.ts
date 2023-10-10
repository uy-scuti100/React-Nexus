import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";


export const useFetchSinglePost = (
   postId: string
): {
   post: any | null;
   isLoading: boolean;
   isError: boolean;
} => {
   const [post, setPost] = useState(null);
   const [isLoading, setIsLoading] = useState(true);
   const [isError, setIsError] = useState(false);

   useEffect(() => {
      const fetchPost = async () => {
         try {
            const { data: post, error } = await supabase
               .from("posts")
               .select()
               .eq("id", postId)
               .single();

            if (error) {
               console.error(`Error fetching post with id ${postId}:`, error.message);
               setIsError(true);
            } else if (!post) {
               console.log(`Post with id ${postId} not found`);
               setIsError(true);
            } else {
               setPost(post);
               setIsError(false);
            }

            setIsLoading(false);
         } catch (error: any) {
            console.error(`Error fetching post with id ${postId}:`, error.message);
            setIsError(true);
            setIsLoading(false);
         }
      };

      fetchPost();
   }, [postId]);

   return {
      post,
      isLoading,
      isError,
   };
};
