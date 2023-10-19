import { Post } from "../../types";
import supabase from "./supabaseClient";

export async function fetchFollowingPosts(followingIds: string[]): Promise<Post[] | null | undefined> {
   try {
      const { data: posts, error } = await supabase
         .from("posts")
         .select("*")
         .in("profile_id", followingIds) 
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
