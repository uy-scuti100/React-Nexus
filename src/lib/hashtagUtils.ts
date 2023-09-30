import { Hashtag } from "../../types";
import supabase from "./supabaseClient";

export async function fetchHashtags(): Promise<Hashtag[] | null> {
   try {
      const { data: hashtags, error } = await supabase
         .from("hashtags")
         .select("*");

      if (hashtags && !error) {
         const formattedHashtags: Hashtag[] = hashtags.map((hashtag: any) => ({
            id: hashtag.id,
            name: hashtag.name,
         }));

         return formattedHashtags;
      } else {
         return null;
      }
   } catch (error) {
      console.error("Error fetching hashtags:", error);
      return null;
   }
}
