import supabase from "./supabaseClient";

export async function fetchUser() {
   try {
     const {
       data: { user },
     } = await supabase.auth.getUser();
 
     if (user) {
       const userData = {
         email: user.email || null, // Ensure email is provided, even if it's null
         id: user.id || null,
         avatarUrl: user.user_metadata?.avatar_url || null,
         fullName: user.user_metadata?.full_name || null,
         user_name: user.user_metadata?.user_name || null,
       };
 
       console.log(user);
       return userData;
     }
 
     // If user is not found, return an object with email as null
     return { email: null, id: null, avatarUrl: null, fullName: null, user_name: null };
   } catch (error) {
     console.error("Error fetching user:", error);
     return null;
   }
 }
 