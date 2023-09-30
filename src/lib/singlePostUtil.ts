import supabase from "./supabaseClient";

// Function to fetch a single category by its ID
export async function fetchSinglePostById(postId: string) {
   try {
      const { data: post, error } = await supabase
         .from("posts")
         .select()
         .eq("id", postId)
         .single();

      if (error) {
         console.error(`Error fetching post with id ${postId}:`, error.message);
      }

      if (!post) {
         console.log(`Post with id ${postId} not found`);
      }
      // console.log(post);
      return post;
   } catch (error) {
      console.log(`Post with id ${postId} not found`);
   }
}
