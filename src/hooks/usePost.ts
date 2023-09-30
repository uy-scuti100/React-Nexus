//;
import useSWR from "swr";
import { fetchPosts } from "../lib/postUtils";

export const usePost = () => {
   const { data, error } = useSWR("posts", fetchPosts, {
      refreshInterval: 1000, // 30 minutes
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

// Example of how to use this hook in a component:
// import { usePost } from './usePost'; // Import your custom hook

// function MyComponent() {
//   const { posts, isLoading, isError } = usePost();

//   // Rest of your component code here
// }
