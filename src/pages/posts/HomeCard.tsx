import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PostCard from "./PostCard";

import PostCardSkeleton from "../../components/myComponents/skeletons/PostCardSkeleton";
import supabase from "../../lib/supabaseClient";
import usePost from "../../hooks/usePost";
interface PostCardProp {
   author: string;
   id: string;
   image: string;
   snippet: string;
   author_verification: boolean;
   title: string;
   created_at: string;
   category_name: string;
   author_image: string;
   bookmark_count: number;
   likes_count: number;
   comment_count: number;
   category_Ids: string[];
   profile_id: string;
}
export default function HomeCard() {
   const [posts, setPosts] = useState<Array<PostCardProp>>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [isFetching, setIsFetching] = useState(false);
   const [totalPosts, setTotalPosts] = useState<number | null>(0);

   useEffect(() => {
      const fetchInitialPosts = async () => {
         setIsLoading(true);
         try {
            const { data, error } = await supabase
               .from("posts")
               .select("*")
               .range(0, 9)
               .order("created_at", { ascending: false });

            if (!error && data) {
               setPosts(data);
            } else {
               setError("An error occurred while fetching posts.");
            }
         } catch (error) {
            setError("An error occurred while fetching posts.");
         } finally {
            setIsLoading(false);
         }
      };

      fetchInitialPosts();
   }, []);

   //  Function to fetch the total number of posts
   const fetchTotalPosts = async () => {
      try {
         const { count, error } = await supabase
            .from("posts")
            .select("count", { count: "exact" });

         if (!error) {
            setTotalPosts(count); // Set the total number of posts
         } else {
            setError(
               "An error occurred while fetching the total number of posts."
            );
         }
      } catch (error) {
         setError(
            "An error occurred while fetching the total number of posts."
         );
      }
   };

   useEffect(() => {
      fetchTotalPosts();
   }, []);

   //  Fetch more posts
   const fetchMorePosts = async () => {
      if (isFetching) {
         return; // If already fetching, do nothing
      }
      setIsFetching(true);
      try {
         const from = posts.length;
         const to = from + 9;
         const { data, error } = await supabase
            .from("posts")
            .select("*")
            .range(from, to)
            .order("created_at", { ascending: false });

         if (!error) {
            if (data && data.length > 0) {
               setPosts((prevPosts) => [...prevPosts, ...data]);
            } else {
               setError("No more posts to fetch.");
            }
         } else {
            setError("An error occurred while fetching more posts.");
         }
      } catch (error) {
         setError("An error occurred while fetching more posts.");
      } finally {
         setIsFetching(false); // Set isFetching to false after fetching is complete
      }
   };

   const handleLoadMoreClick = () => {
      fetchMorePosts();
   };
   // Create an array of skeleton elements based on the expected number of posts
   const skeletonElements = Array.from(
      { length: totalPosts || 5 },
      (_, index) => <PostCardSkeleton key={index} />
   );

   return (
      <>
         <div className="flex flex-col w-full">
            {posts?.map((post, index) => {
               const {
                  author,
                  id,
                  image,
                  snippet,
                  author_verification,
                  title,
                  created_at,
                  profile_id,
                  category_name,
                  author_image,
                  bookmark_count,
                  likes_count,
                  comment_count,
                  category_Ids,
               } = post;

               return (
                  <motion.div
                     key={post.id}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{
                        duration: 0,
                        ease: [0.25, 0.25, 0, 1],
                        delay: index / 15,
                     }}>
                     <PostCard
                        key={id}
                        author={author}
                        id={id}
                        image={image}
                        snippet={snippet}
                        author_verification={author_verification}
                        title={title}
                        category_name={category_name}
                        author_image={author_image}
                        bookmark_count={bookmark_count}
                        created_at={created_at}
                        likes_count={likes_count}
                        comment_count={comment_count}
                        profile_id={profile_id}
                        category_Ids={category_Ids}
                     />
                  </motion.div>
               );
            })}
            {isLoading && (
               <div className="flex flex-col w-full">{skeletonElements}</div>
            )}
            {error && (
               <div className="fixed inset-0 flex items-center justify-center bg-white">
                  <div className="relative w-full md:w-[500px] h-[500px]">
                     <img
                        src="/internalerror.svg"
                        alt="loading-image"
                        className="object-cover"
                     />
                  </div>
               </div>
            )}
            {totalPosts !== null &&
               posts !== null &&
               totalPosts > posts.length && (
                  <div className="my-10">
                     <button
                        disabled={isFetching}
                        onClick={handleLoadMoreClick}
                        className={`${
                           isFetching && "bg-wh-300 animate-bounce"
                        } w-full px-5 py-2 mt-5 font-semibold md:w-auto bg-accent-red hover:bg-wh-500 text-wh-10 dark:text-black`}>
                        {isFetching ? "Loading More..." : " Load More"}
                     </button>
                  </div>
               )}
            {totalPosts === 0 && <div className="pb-10">No Posts to fetch</div>}
         </div>
      </>
   );
}
