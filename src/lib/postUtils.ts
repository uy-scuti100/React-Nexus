import { Post } from "../../types";
import supabase from "./supabaseClient";

export async function fetchPosts(): Promise<Post[] | null> {
   try {
      const { data: posts, error } = await supabase
         .from("posts")
         .select("*")
         .order("created_at", { ascending: false });

      if (posts && !error) {
         const formattedPost: Post[] = posts.map((post: Post) => ({
            id: post.id,
            title: post.title,
            profile_id: post.profile_id,
            category_id: post.category_id,
            content: post.content,
            image: post.image,
            snippet: post.snippet,
            created_at: post.created_at,
            author: post.author,
            category_name: post.category_name,
            updated_at: post.updated_at,
            author_verification: post.author_verification,
            author_image: post.author_image,
            bookmark_count: post.bookmark_count,
            likes_count: post.likes_count,
            comment_count: post.comment_count,
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
