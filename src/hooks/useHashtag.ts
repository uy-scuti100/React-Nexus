import useSWR from "swr";
import { fetchHashtags } from "../lib/hashtagUtils";

export const useHashtag = (): {
   hashtags: { name: string | null; id: string | null }[] | null;
   isLoading: boolean;
   isError: boolean;
} => {
   const { data: formattedHashtags, error } = useSWR(
      "hashtags",
      fetchHashtags,
      {
         refreshInterval: 1800000, // 30 minutes
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
