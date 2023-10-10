import { Post } from "../../types";
import supabase from "./supabaseClient";

export async function fetchPosts(): Promise<Post[] | null> {
   try {
      const { data: posts, error } = await supabase
         .from("posts")
         .select("*")
         .range(0, 9)
         .order("created_at", { ascending: false });

      if (posts && !error) {
         const formattedPost: Post[] = posts.map((post: Post) => ({
            id: post.id,
            title: post.title,
            profile_id: post.profile_id,
            content: post.content,
            image: post.image,
            snippet: post.snippet,
            created_at: post.created_at,
            author: post.author,
            author_image: post.author_image,
            bookmark_count: post.bookmark_count,
            likes_count: post.likes_count,
            comment_count: post.comment_count,
            category_Ids: post.category_Ids
         
         }));

         return formattedPost;
      } else {
         return null;
      }
   } catch (error) {
      console.error("Error fetching categories:", error);
      return null;
   }
}
