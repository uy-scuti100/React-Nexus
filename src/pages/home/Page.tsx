import { useEffect, useState } from "react";
import { useUser } from "../../hooks/useUser";
import { useNavigate } from "react-router-dom";
import OnBoard from "../../components/myComponents/global/OnBoard";
import supabase from "../../lib/supabaseClient";
import HashtagForm from "../../components/providers/modal/hashtag-modal";
import { useFetchUser } from "../../hooks/useFetchUser";

interface UserHashtag {
   hashtag_id: string;
   hashtag_name: string;
}

const Page = () => {
   const navigate = useNavigate();
   const [userHashtags, setUserHashtags] = useState<UserHashtag[]>([]);
   const [loadingUserHashtags, setLoadingUserHashtags] = useState(true);
   const [loading, setLoading] = useState(false);
   const [showHashtagForm, setShowHashtagForm] = useState(false);
   const { user, isError } = useFetchUser();
   const userId = user?.id;
   const dbUsername = user?.email;
   let username: string | undefined;

   if (dbUsername) {
      const parts = dbUsername.split("@");
      if (parts.length === 2) {
         username = parts[0];
      } else {
         console.error("Invalid email format:", dbUsername);
      }
   } else {
      console.error("No email provided for the user.");
   }

   // useEffect(() => {
   //    const confirmUserHashtag = async () => {
   //       const { data: userHashtagsData } = await supabase
   //          .from("user_hashtags")
   //          .select("hashtag_id")
   //          .eq("user_id", userId);

   //       if (userHashtagsData) {
   //          setUserHashtags(userHashtagsData as UserHashtag[]);
   //          setLoadingUserHashtags(false);

   //          if (userHashtagsData.length < 5) {
   //             setShowHashtagForm(true);
   //          }
   //       }
   //    };
   //    confirmUserHashtag();
   // }, [userId]);

   useEffect(() => {
      const updateUserProfile = async () => {
         setLoading(true);
         try {
            if (userId) {
               const { data: userProfileData } = await supabase
                  .from("profiles")
                  .select()
                  .eq("id", userId)
                  .single();

               if (userProfileData) {
                  // Check if display_pic and display_name are null
                  if (
                     userProfileData.display_pic === null ||
                     userProfileData.display_name === null ||
                     userProfileData.username === null
                  ) {
                     // Update display_pic, and display_name if they are null
                     await supabase
                        .from("profiles")
                        .update([
                           {
                              display_pic: user.avatarUrl,
                              display_name: user.fullName,
                              username: username,
                           },
                        ])
                        .eq("id", userId)
                        .select();
                  }
               }
            }
            setLoading(false);
         } catch (error: any) {
            console.error("Error updating user profile:", error.message);
         }
      };

      if (userId && user) {
         updateUserProfile();
      }
   }, [userId, user]);

   useEffect(() => {
      if (user) {
         navigate("/posts");
         setLoading(false);
      }
   }, [user]);

   if (isError) {
      return <main>Error loading user data</main>;
   }

   if (loading) {
      return (
         <div className="fixed inset-0 flex items-center justify-center bg-white">
            <div className="relative w-full md:w-[500px] h-[500px]">
               <img
                  src="/Fast loading.gif"
                  alt="loading-image"
                  className="object-cover"
               />
            </div>
         </div>
      );
   }

   // if (showHashtagForm) {
   //    return <HashtagForm />;
   // }

   return <OnBoard />;
};

export default Page;
