import { useEffect, useState } from "react";
import supabase from "../../../lib/supabaseClient";
import { useFetchUser } from "../../../hooks/useFetchUser";
import { Link, useParams } from "react-router-dom";

export default function TopicSlider() {
   const { id } = useParams();
   const para = id;
   const pathname = window.location.pathname;
   const path = pathname.split("/")[1];
   const { user } = useFetchUser();
   const userId = user?.id;
   const [topics, setTopics] = useState<any[] | null>([]);

   useEffect(() => {
      const fetchUserPreferredTopics = async () => {
         const { data, error } = await supabase
            .from("topicfellowship")
            .select("*")
            .eq("user_id", userId);

         if (data) {
            setTopics(data);
         }
      };
      fetchUserPreferredTopics();
   }, [userId]);

   return (
      <main>
         <div className="flex items-center gap-6 pb-3 mb-3 overflow-auto scrollbar">
            <Link
               to={`/explore-topics`}
               className="mr-2 transition-colors duration-500 rounded-full hover:border hover:bg-foreground/20">
               <svg
                  width="19"
                  height="19"
                  // @ts-ignore
                  class="hi hj hk"
                  className="cursor-pointer">
                  <path
                     d="M9 9H3v1h6v6h1v-6h6V9h-6V3H9v6z"
                     fill="currentcolor"></path>
               </svg>
            </Link>
            <Link to={`/posts`}>
               <button
                  className={` ${
                     path === "posts" && "bg-accent-orange"
                  } px-2 py-2 transition-transform duration-300 hover:scale-105 w-max whitespace-nowrap text-black dark:text-white text-sm rounded-full`}>
                  {" "}
                  Recommended
               </button>
            </Link>
            {topics?.map((topic) => {
               const {
                  user_id,
                  type,
                  topic_id,
                  subsubtopic_id,
                  subtopic_id,
                  id,
                  topicname,
               } = topic;

               let link = "";

               if (type === "Topic") {
                  link = topic_id?.toString() || "";
               } else if (type === "Subtopic") {
                  link = subtopic_id?.toString() || "";
               } else {
                  link = subsubtopic_id?.toString() || "";
               }

               return (
                  <Link to={`/topic/${link}`} key={link}>
                     <button
                        className={`  ${
                           para === link && "bg-accent-orange"
                        } px-2 py-2 text-sm text-black dark:text-white rounded-full transition-transform duration-300 hover:scale-105 w-max whitespace-nowrap`}>
                        {topicname}
                     </button>
                  </Link>
               );
            })}
         </div>
      </main>
   );
}
