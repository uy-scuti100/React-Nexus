
import useSWR from "swr";
import { fetchPosts } from "../lib/postUtils";

// Define __INITIAL_DATA__ as an empty object
declare global {
   interface Window {
      __INITIAL_DATA__: Record<string, any>;
   }
}

window.__INITIAL_DATA__ = {};

const usePost = () => {
   const { data, error } = useSWR("posts", fetchPosts, {
      initialData: window.__INITIAL_DATA__ || null, // Use the initial data if available
   revalidateOnMount: true
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

export default usePost;





// import useSWR from "swr";
// import { fetchPosts } from "../lib/postUtils";
// import { useEffect } from "react";

// // Define __INITIAL_DATA__ as an empty object
// declare global {
//    interface Window {
//       __INITIAL_DATA__: Record<string, any>;
//    }
// }

// window.__INITIAL_DATA__ = {};

// const useCachedPosts = () => {
//    const { data, error, mutate } = useSWR("posts", fetchPosts, {
//       initialData: window.__INITIAL_DATA__ || null, // Use the initial data if available
//       refreshInterval: 3600000, // Refresh every 1 hour (3600000 milliseconds)
//    });

//    const posts = data || null;

//    const isLoading = !data && !error;
//    const isError = !!error;

//    // Use useEffect to fetch the initial data when the component mounts
//    useEffect(() => {
//       // Fetch initial data here
//       async function fetchInitialData() {
//          const initialData = await fetchPosts();
//          if (initialData !== null) {
//             mutate(initialData, false); // Update the SWR cache without revalidating
//          }
//       }

//       if (!data && !isLoading && !isError) {
//          fetchInitialData();
//       }
//    }, [data, isLoading, isError, mutate]);

//    return {
//       posts,
//       isLoading,
//       isError,
//    };
// };

// export default useCachedPosts;




// import useSWR from "swr";
// import { fetchPosts } from "../lib/postUtils";

// export const usePost = () => {
//    const { data, error } = useSWR("posts", fetchPosts, {
//      revalidateOnMount: true
//    });

//    const posts = data || null;

//    const isLoading = !data && !error;
//    const isError = !!error;

//    return {
//       posts,
//       isLoading,
//       isError,
//    };
// };

// Example of how to use this hook in a component:
// import { usePost } from './usePost'; // Import your custom hook

// function MyComponent() {
//   const { posts, isLoading, isError } = usePost();

//   // Rest of your component code here
// }
