import { User } from "../../types";
import supabase from "./supabaseClient";
export async function fetchSingleProfile(userId: string): Promise<User | null> {
   try {
         const { data: singleUser, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();

         if (singleUser) {
 
            return singleUser;
         } else{

             return null;
         }

   } catch (error) {
      console.error("Error fetching user:", error);
      return null;
   }
}
