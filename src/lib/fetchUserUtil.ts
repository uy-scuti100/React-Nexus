import { User } from "../../types";
import supabase from "./supabaseClient";
export async function fetchSingleUser(): Promise<User | null> {
   try {
      const {
         data: { user },
      } = await supabase.auth.getUser();

      if (user) {
         const userId = user.id;

         const { data: currentUser, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();

         if (currentUser) {
            // console.log(currentUser);
            return currentUser;
         }

         return null;
      }

      return null;
   } catch (error) {
      console.error("Error fetching user:", error);
      return null;
   }
}
