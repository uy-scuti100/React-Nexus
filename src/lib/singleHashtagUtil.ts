import supabase from "./supabaseClient";

export interface HashtagProp {
   id: string | null;
   name: string | null;
}

// Function to fetch a single category by its ID
export async function fetchHashtagById(
   hashtagId: string
): Promise<HashtagProp | null> {
   try {
      const { data: hashtags, error } = await supabase
         .from("hashtags")
         .select("id, name")
         .eq("id", hashtagId)
         .single();

      if (hashtags && !error) {
         return {
            id: hashtags.id,
            name: hashtags.name,
         };
      } else {
         return null;
      }
   } catch (error) {
      console.error("Error fetching category:", error);
      return null;
   }
}
