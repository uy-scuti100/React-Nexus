import { Category } from "../../types";
import supabase from "./supabaseClient";

export async function fetchCategories(): Promise<Category[] | null> {
   try {
      const { data: categories, error } = await supabase
         .from("categories")
         .select("*");

      if (categories && !error) {
         const formattedCategories: Category[] = categories.map(
            (category: any) => ({
               id: category.id,
               name: category.name,
            })
         );

         return formattedCategories;
      } else {
         return null;
      }
   } catch (error) {
      console.error("Error fetching categories:", error);
      return null;
   }
}
