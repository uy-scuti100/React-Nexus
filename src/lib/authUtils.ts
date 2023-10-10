import supabase from "./supabaseClient";

export async function fetchUser() {
   try {
      const {
         data: { user },
      } = await supabase.auth.getUser();

      if (user) {
         const userData = {
            email: user.email || null,
            id: user.id || null,
            avatarUrl: user.user_metadata?.avatar_url || null,
            fullName: user.user_metadata?.full_name || null,
            user_name: user.user_metadata?.user_name || null,
         };

         return userData;
      }

      return null;
   } catch (error) {
      console.error("Error fetching user:", error);
      return null;
   }
}
