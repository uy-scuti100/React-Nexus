//;
import useSWR from "swr";
import { fetchHashtagById } from "../lib/singleHashtagUtil";

export interface Hashtag {
   id: string | null;
   name: string | null;
}
export const useSingleHashtag = (
   hashtagId: string
): {
   hashtag: Hashtag | null;
   isLoading: boolean;
   isError: boolean;
} => {
   const { data: hashtagData, error } = useSWR(
      `hashtag-${hashtagId}`,
      () => fetchHashtagById(hashtagId),
      {
         revalidateOnMount: true
      }
   );

   const hashtag = hashtagData || null;

   return {
      hashtag,
      isLoading: !hashtag && !error,
      isError: !!error,
   };
};
// revalidateOnFocus: false, // Disable revalidation on window focus (optional)
// revalidateOnReconnect: false, // Disable revalidation on reconnect (optional)
