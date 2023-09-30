import supabase from "./supabaseClient";

export interface Category {
   id: string | null;
}

// Function to fetch a single category by its ID
export async function fetchCategoryById(
   categoryId: string
): Promise<Category | null> {
   try {
      const { data: categories, error } = await supabase
         .from("categories")
         .select("id")
         .eq("id", categoryId)
         .single();

      if (categories && !error) {
         return {
            id: categories.id,
         };
      } else {
         return null;
      }
   } catch (error) {
      console.error("Error fetching category:", error);
      return null;
   }
}
