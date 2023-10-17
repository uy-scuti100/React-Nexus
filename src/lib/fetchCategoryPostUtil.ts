import { Post } from "../../types";
import supabase from "./supabaseClient";

export async function fetchCategoryPosts(paramsId: string): Promise<Post[] | null> {
   try {
      const { data: posts, error } = await supabase
         .from("posts")
         .select("*")
         .contains("category_Ids", [paramsId]) // Use contains to check if the categoryId is in the array
         .range(0, 2)

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
