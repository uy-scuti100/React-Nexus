//;
import React, { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { useUser } from "@/hooks/useUser";
import { useHashtag } from "@/hooks/useHashtag";
import "./registration.css";
import supabase from "@/lib/supabaseClient";
import { redirect } from "next/navigation";

interface HashtagProp {
   name: string | null | undefined;
   id: string | null | undefined;
}

const HashtagForm = () => {
   const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
   const [loading, setLoading] = useState(false);
   const [userHashtags, setUserHashtags] = useState<string[]>([]); // Store user's current hashtags
   const { hashtags } = useHashtag();
   const fetchedHashtags = hashtags;
   const { user } = useUser();
   const userId = user?.id;

   // Fetch user's current hashtags
   useEffect(() => {
      const fetchUserHashtags = async () => {
         try {
            const { data: userHashtagsData, error } = await supabase
               .from("user_hashtags")
               .select("hashtag_id")
               .eq("user_id", userId);

            if (!error && userHashtagsData) {
               setUserHashtags(userHashtagsData.map((item) => item.hashtag_id));
            }
         } catch (error: any) {
            console.error("Error fetching user's hashtags:", error.message);
         }
      };

      fetchUserHashtags();
   }, [userId]);

   // Function to check if at least 5 hashtags are selected
   const areEnoughHashtagsSelected = () => {
      return selectedHashtags.length + userHashtags?.length >= 5;
   };
   const addHashtags = async () => {
      setLoading(true);
      try {
         // Map selected hashtags to the appropriate format
         const hashtagsToInsert = selectedHashtags.map((hashtag) => ({
            user_id: userId, // Replace with the actual user ID
            hashtag_id: hashtag,
            name: hashtags?.find((h) => h.id === hashtag)?.name || "",
         }));

         // Insert the selected hashtags into the "user_hashtags" table
         const { data, error } = await supabase
            .from("user_hashtags")
            .upsert(hashtagsToInsert);

         if (error) {
            console.error("Error inserting hashtags:", error.message);
         } else {
            console.log("Hashtags inserted successfully:", data);
            window.location.href = "/home";
         }
      } catch (error: any) {
         console.error("Error:", error.message);
      }
   };

   const totalSelectedHashtags =
      selectedHashtags.filter((hashtag) => !userHashtags.includes(hashtag))
         .length + userHashtags.length;

   // Calculate how many more hashtags are needed to reach a total of five
   const hashtagsLeft = Math.max(5 - totalSelectedHashtags, 0);
   // // Count of hashtags left to reach the minimum of five
   // const hashtagsLeft = Math.max(
   //    5 - (selectedHashtags.length + userHashtags.length),
   //    0
   // );

   return (
      <div className="fixed inset-0 z-30 w-full h-full overflow-hidden transition-all duration-300">
         <div className="absolute inset-0 z-40 bg-white dark:bg-black" />
         <div className="absolute flex flex-col items-center z-50 top-[55%] left-1/2 translate-x-[-50%] translate-y-[-50%] w-full px-6">
            <h1 className="pb-4 text-xl text-center">
               Personalize Your Experience:
            </h1>
            <p className="text-center">Choose 5 or More Interests</p>
            <div className="h-[400px] overflow-y-auto py-4">
               <div className="flex gap-5 items-center flex-wrap max-w-[500px]">
                  {hashtags?.map((hashtag: HashtagProp) => (
                     <Button
                        className={`px-2 py-2 text-xs transition-transform duration-300 rounded hover:scale-105 w-max whitespace-nowrap ${
                           selectedHashtags.includes(hashtag.id as string)
                              ? "selected"
                              : userHashtags.includes(hashtag.id as string) // Check if the user has this hashtag
                              ? "bg-accent-red"
                              : ""
                        }`}
                        key={hashtag.id}
                        onClick={() =>
                           setSelectedHashtags((prevSelected) => {
                              if (prevSelected.includes(hashtag.id as string)) {
                                 return prevSelected.filter(
                                    (item) => item !== (hashtag.id as string)
                                 );
                              } else {
                                 return [...prevSelected, hashtag.id as string];
                              }
                           })
                        }>
                        #{hashtag.name}
                     </Button>
                  ))}
               </div>
            </div>
            {/* Display the count of hashtags left to reach the minimum */}
            <p className="mt-4">
               {hashtagsLeft > 0
                  ? `${hashtagsLeft} more ${
                       hashtagsLeft === 1 ? "hashtag" : "hashtags"
                    } to reach the minimum of five.`
                  : "You have reached the minimum of five hashtags."}
            </p>

            {/* <p className="mt-4">
               {hashtagsLeft > 0
                  ? `${hashtagsLeft} more ${
                       hashtagsLeft === 1 ? "hashtag" : "hashtags"
                    } to reach the minimum of five.`
                  : "You have reached the minimum of five hashtags."}
            </p> */}
            <Button
               className="w-full my-8"
               type="button"
               onClick={addHashtags}
               disabled={!areEnoughHashtagsSelected() || loading}>
               Submit
            </Button>
         </div>
      </div>
   );
};
export default HashtagForm;
