import { Post } from "../../types";
import supabase from "./supabaseClient";

export async function fetchCategoryPosts(categoryId: string): Promise<Post[] | null> {
   try {
      const { data: posts, error } = await supabase
         .from("posts")
         .select("*")
         .range(0, 9)
         .contains("category_Ids", [categoryId]) // Use contains to check if the categoryId is in the array
         .order("created_at", { ascending: false });

      if (posts && !error) {
         return posts;
      } else {
         return null;
      }
   } catch (error) {
      console.error("Error fetching posts:", error);
      return null;
   }
}
