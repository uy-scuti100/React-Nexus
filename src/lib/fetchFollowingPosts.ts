import { Post } from "../../types";
import supabase from "./supabaseClient";

export async function fetchFollowingPosts(ids: string[]): Promise<Post[] | null | undefined> {
   try {
      const { data: posts, error } = await supabase
         .from("posts")
         .select("*")
         .contains("category_Ids", [ids])
         .range(0,19)
    
      

      if (posts) {
         return posts;
      } else {
         return null;
      }
   } catch (error) {
      console.error("Error fetching posts:", error);
      return null;
   }
}
