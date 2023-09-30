import useSWR from "swr";
import { fetchCategories } from "../lib/categoryUtils";

export const useCategory = (): {
   categories: { name: string | null; id: string | null }[] | null;
   isLoading: boolean;
   isError: boolean;
} => {
   const { data: formattedCategories, error } = useSWR(
      "categories",
      fetchCategories,
      {
         refreshInterval: 1800000, // 30 minutes
      }
   );

   const categories = formattedCategories || null;

   return {
      categories,
      isLoading: !categories && !error,
      isError: !!error,
   };
};

// {
//    revalidateOnFocus: false, // Disable revalidation on window focus (optional)
//    revalidateOnReconnect: false, // Disable revalidation on reconnect (optional)
//    refreshInterval: 600000, // Set revalidation time in milliseconds (e.g., 1 minute)
// }
