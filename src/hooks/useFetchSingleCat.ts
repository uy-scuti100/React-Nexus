//;
import useSWR from "swr";
import { fetchCategoryById } from "../lib/singleCatUtil";

export interface Category {
   id: string | null;
}
export const useSingleCategory = (
   categoryId: string
): {
   category: Category | null;
   isLoading: boolean;
   isError: boolean;
} => {
   const { data: categoryData, error } = useSWR(
      `category-${categoryId}`,
      () => fetchCategoryById(categoryId),
      {
         refreshInterval: 1800000, // 30 minutes
      }
   );

   const category = categoryData || null;

   return {
      category,
      isLoading: !category && !error,
      isError: !!error,
   };
};
// revalidateOnFocus: false, // Disable revalidation on window focus (optional)
// revalidateOnReconnect: false, // Disable revalidation on reconnect (optional)
