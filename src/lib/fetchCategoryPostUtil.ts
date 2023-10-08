import { Post } from "../../types";
import supabase from "./supabaseClient";

export async function fetchCategoryPost(id: string): Promise<Post[] | null> {
   try {
      const { data: posts, error } = await supabase
         .from("posts")
         .select("*")
         .range(0, 9)
         .eq("category_id", id)
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
