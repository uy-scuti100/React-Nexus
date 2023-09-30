import { User } from "../../types";
import supabase from "./supabaseClient";

export async function fetchUser(): Promise<User | null> {
   try {
      const {
         data: { user },
      } = await supabase.auth.getUser();

      if (user) {
         const userData: User = {
            email: user.email || null,
            id: user.id || null,
            avatarUrl: user.user_metadata?.avatar_url || null,
            fullName: user.user_metadata?.full_name || null,
         };

         return userData;
      }

      return null;
   } catch (error) {
      console.error("Error fetching user:", error);
      return null;
   }
}
