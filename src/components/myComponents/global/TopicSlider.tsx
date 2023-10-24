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
               <svg viewBox="0 0 24 24" fill="none" height="36" width="36">
                  <circle cx="12" cy="12" r="10" stroke="currentColor"></circle>
                  <title>Discover topics</title>
                  <path
                     fill-rule="evenodd"
                     clip-rule="evenodd"
                     d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zm3.94-14.84l.14-1-.88.48-5.9 3.2-.22.12-.03.24-.99 6.64-.14.99.88-.48 5.9-3.2.22-.11.03-.25.99-6.63zM9.2 16l.72-4.85 3.59 2.51L9.2 16zm1.3-5.67l3.58 2.51L14.8 8l-4.3 2.33z"
                     fill="currentColor"></path>
               </svg>
            </Link>
            <Link to={`/posts`}>
               <button
                  className={` ${
                     path === "posts" && "bg-accent-orange"
                  } px-2 py-2 transition-transform duration-300 hover:scale-105 w-max whitespace-nowrap text-black dark:text-white text-sm rounded-full`}>
                  {" "}
                  For you
               </button>
            </Link>
            <Link to={`/following`}>
               <button
                  className={` ${
                     path === "following" && "bg-accent-orange"
                  } px-2 py-2 transition-transform duration-300 hover:scale-105 w-max whitespace-nowrap text-black dark:text-white text-sm rounded-full`}>
                  {" "}
                  Following
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
