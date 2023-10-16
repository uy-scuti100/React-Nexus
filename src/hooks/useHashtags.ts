

// import useSWR from "swr";
// import { fetchHashtags } from "../lib/hashtagUtils";



// export const useHashtags = () => {
//    const { data: hashtags, error } = useSWR("hashtags", fetchHashtags, {
//       initialData: window.__INITIAL_DATA__.hashtags || null, // Use the initial data if available
//       revalidateOnMount: true, // Revalidate data when the component mounts
//    });

//    const isLoading = !hashtags && !error;
//    const isError = !!error;

//    return {
//       hashtags,
//       isLoading,
//       isError,
//    };
// };





import useSWR from "swr";
import { fetchHashtags } from "../lib/hashtagUtils";

export interface TopicProp {
    name: string | null;
     id: string | null; 
    created_at: string | null; 
}
export const useHashtag = (): {
   hashtags: TopicProp[] | null;
   isLoading: boolean;
   isError: boolean;
} => {
   const { data: formattedHashtags, error } = useSWR(
      "hashtags",
      fetchHashtags,
      {
         revalidateOnMount: true
      }
   );

   const hashtags = formattedHashtags || null;

   return {
      hashtags,
      isLoading: !hashtags && !error,
      isError: !!error,
   };
};

// {
//    revalidateOnFocus: false, // Disable revalidation on window focus (optional)
//    revalidateOnReconnect: false, // Disable revalidation on reconnect (optional)
//    refreshInterval: 600000, // Set revalidation time in milliseconds (e.g., 1 minute)
// }
