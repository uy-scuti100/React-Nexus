//;
import { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { useUser } from "../../../hooks/useUser";
import "./registration.css";
import { useNavigate } from "react-router-dom";
import supabase from "../../../lib/supabaseClient";

interface Topic {
   id: string;
   type: string;
   name?: string;
   topic_id?: string;
   subtopic_id?: string;
   subsubtopic_id?: string;
}

export default function FollowTopicsModal() {
   const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);
   // console.log(selectedTopics);
   const [loading, setLoading] = useState(false);
   const { user } = useUser();
   const userId = user?.id;
   const navigate = useNavigate();
   const [allTopics, setAllTopics] = useState<Topic[]>([]);
   const [alreadyFollowing, setAlreadyFollowing] = useState<Topic[] | null>([]);

   // console.log(allTopics);
   // console.log(alreadyFollowing);

   // fetching all hashtags from the db
   useEffect(() => {
      const fetchAllHashtags = async () => {
         try {
            const { data: topicsData, error: topicsError } = await supabase
               .from("topics")
               .select("*");

            const { data: subtopicsData, error: subtopicsError } =
               await supabase.from("subtopics").select("*");

            const { data: subsubtopicsData, error: subsubtopicsError } =
               await supabase.from("subsubtopics").select("*");

            // Combine the data from all sources into a single array
            const allData = [
               ...(topicsData || []),
               ...(subtopicsData || []),
               ...(subsubtopicsData || []),
            ];

            if (!topicsError && !subtopicsError && !subsubtopicsError) {
               setAllTopics(allData);
            }
         } catch (error: any) {
            console.error("Error fetching hashtags:", error.message);
         }
      };

      fetchAllHashtags();
   }, [userId]);

   //fetch hasghtags the user is alredy following
   useEffect(() => {
      const fetchUserHashtags = async () => {
         try {
            const { data, error } = await supabase
               .from("topicfellowship")
               .select("*")
               .eq("user_id", userId);

            if (!error && data) {
               // Check if any of the IDs match the topics in allTopics
               const alreadyFollowingTopics = data.filter((item) => {
                  return (
                     item.type === "Topic" &&
                     allTopics.some((topic) => topic.id === item.topic_id)
                  );
               });

               const alreadyFollowingSubtopics = data.filter((item) => {
                  return (
                     item.type === "Subtopic" &&
                     allTopics.some((topic) => topic.id === item.subtopic_id)
                  );
               });

               const alreadyFollowingSubsubtopics = data.filter((item) => {
                  return (
                     item.type === "Subsubtopic" &&
                     allTopics.some((topic) => topic.id === item.subsubtopic_id)
                  );
               });

               const combinedAlreadyFollowing = [
                  ...alreadyFollowingTopics,
                  ...alreadyFollowingSubtopics,
                  ...alreadyFollowingSubsubtopics,
               ];

               setAlreadyFollowing(combinedAlreadyFollowing);
            }
         } catch (error: any) {
            console.error("Error fetching user's hashtags:", error.message);
         }
      };

      fetchUserHashtags();
   }, [userId, allTopics]);

   const areEnoughHashtagsSelected = () => {
      return selectedTopics.length + (alreadyFollowing?.length || 0) >= 5;
   };

   const addHashtags = async () => {
      setLoading(true);
      try {
         // Map selected topics to the appropriate format
         const topicsToInsert = selectedTopics.map((topic) => ({
            user_id: userId,
            topic_id: topic.type === "Topic" ? topic.id : null,
            subtopic_id: topic.type === "Subtopic" ? topic.id : null,
            subsubtopic_id: topic.type === "Subsubtopic" ? topic.id : null,
            type: topic.type,
            topicname: topic.name,
         }));

         // Insert the selected topics into the "topicfellowship" table
         const { data, error } = await supabase
            .from("topicfellowship")
            .upsert(topicsToInsert);

         if (error) {
            console.error("Error inserting topics:", error.message);
         } else {
            console.log("Topics inserted successfully:", data);
            navigate(`/account/${userId}`);
         }
      } catch (error: any) {
         console.error("Error:", error.message);
      }
   };

   // const updateSelectedTopics = (topic) => {
   //    setSelectedTopics((prevSelected) => {
   //       // Check if the topic is already in the selectedTopics
   //       const topicExists = prevSelected.some((item) => item.id === topic.id);

   //       if (!topicExists) {
   //          // Include 'type' in the payload
   //          const selectedTopic = {
   //             id: topic.id,
   //             type: topic.type,
   //             topicname: topic.topicname,
   //          };
   //          return [...prevSelected, selectedTopic];
   //       } else {
   //          // Remove the topic if it's already selected
   //          return prevSelected.filter((item) => item.id !== topic.id);
   //       }
   //    });
   // };

   const totalSelectedHashtags =
      selectedTopics.filter((topic) => !alreadyFollowing?.includes(topic))
         .length + (alreadyFollowing?.length ?? 0);

   // Calculate how many more hashtags are needed to reach a total of five
   const hashtagsLeft = Math.max(5 - totalSelectedHashtags, 0);

   return (
      <div className="fixed inset-0 z-30 w-full h-full overflow-hidden transition-all duration-300">
         <div className="absolute inset-0 z-40 bg-white dark:bg-black" />
         <div className="absolute flex flex-col items-center z-50 top-[55%] left-1/2 translate-x-[-50%] translate-y-[-50%] w-full px-6">
            <h1 className="pb-4 text-xl text-center">
               Personalize Your Experience:
            </h1>
            <p className="text-center">Choose 5 or More Interests</p>
            <div className="h-[300px] overflow-y-auto py-4">
               <div className="flex gap-5 items-center flex-wrap max-w-[500px]">
                  {allTopics?.map((topic) => {
                     let type = "";
                     if (topic.type === "Topic") {
                        type = "topic";
                     } else if (topic.type === "Subtopic") {
                        type = "subtopic";
                     } else if (topic.type === "Subsubtopic") {
                        type = "subsubtopic";
                     }

                     const isSelected = selectedTopics.some(
                        (item) => item.id === topic.id && item.type === type
                     );

                     const isFollowed = alreadyFollowing?.some(
                        (item) =>
                           (item.topic_id === topic.id &&
                              item.type === "Topic") ||
                           (item.subtopic_id === topic.id &&
                              item.type === "Subtopic") ||
                           (item.subsubtopic_id === topic.id &&
                              item.type === "Subsubtopic")
                     );

                     const toggleSelection = () => {
                        if (isSelected) {
                           // Unselect the topic
                           setSelectedTopics((prevSelected) =>
                              prevSelected.filter(
                                 (item) =>
                                    item.id !== topic.id && item.type !== type
                              )
                           );
                        } else {
                           // Select the topic
                           setSelectedTopics((prevSelected) => [
                              ...prevSelected,
                              {
                                 id: topic.id,
                                 type: type,
                                 topicname: topic.name,
                              },
                           ]);
                        }
                     };

                     return (
                        <button
                           className={`px-2 py-2 border-foreground border text-xs transition-transform duration-300 rounded-full w-max whitespace-nowrap ${
                              isSelected
                                 ? "bg-[#c1c1c1]"
                                 : isFollowed
                                 ? "bg-accent-orange"
                                 : ""
                           }`}
                           key={topic.id}
                           onClick={toggleSelection}>
                           {topic.name}
                        </button>
                     );
                  })}
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

            <Button
               className="w-full px-6 py-2 my-8 border rounded-full md:w-auto border-foregroud"
               type="button"
               onClick={addHashtags}
               disabled={!areEnoughHashtagsSelected() || loading}>
               Submit
            </Button>
         </div>
      </div>
   );
}
