import { useEffect, useState } from "react";
import Category from "../../components/myComponents/global/Category";
import Navbar from "../../components/myComponents/global/Navbar";
import Sidebar from "../../components/myComponents/global/Sidebar";
import HomeCard from "./HomeCard";
import supabase from "../../lib/supabaseClient";
import { usePost } from "../../hooks/usePost";
import { Post } from "../../../types";
import TopicSlider from "../../components/myComponents/global/TopicSlider";
import PostCardSkeleton from "../../components/myComponents/skeletons/PostCardSkeleton";
import { calculateReadTime } from "../../lib/readTime";
import PostCard from "./PostCard";

const page = () => {
   const [isFetching, setIsFetching] = useState(false);
   const [totalPosts, setTotalPosts] = useState<number | null>(0);
   const { posts, isLoading } = usePost();
   const [blogPosts, setBlogPosts] = useState<Post[] | null>([]);
   const [error, setError] = useState(false);
   const FROM = Number(blogPosts?.length);

   useEffect(() => {
      setBlogPosts(posts);
   }, []);

   //  Function to fetch the total number of posts
   useEffect(() => {
      const fetchTotalPosts = async () => {
         try {
            const { count, error } = await supabase
               .from("posts")
               .select("count", { count: "exact" });

            if (!error) {
               setTotalPosts(count); // Set the total number of posts
            } else {
               console.log(error);
            }
         } catch (error) {
            console.log(error);
         }
      };
      fetchTotalPosts();
   }, []);

   //  Fetch more posts
   const fetchMorePosts = async () => {
      if (isFetching) {
         return; // If already fetching, do nothing
      }
      setIsFetching(true);

      try {
         console.log("Fetching from:", FROM); // Log the 'from' value

         const { data, error } = await supabase
            .from("posts")
            .select("*")
            .range(FROM, FROM + 9)
            .order("created_at", { ascending: false });

         console.log("Fetched data:", data); // Log the fetched data
         console.log("Fetch error:", error); // Log any errors

         if (data && data.length > 0) {
            if (blogPosts !== null) {
               // Check if blogPosts is not null before concatenating
               setBlogPosts(blogPosts.concat(data));
            }
         } else {
            setError(true);
         }
      } catch (error) {
         setError(true);
      } finally {
         setIsFetching(false);
      }
   };
   const handleLoadMoreClick = () => {
      fetchMorePosts();
   };
   const skeletonElements = Array.from(
      { length: totalPosts || 5 },
      (_, index) => <PostCardSkeleton key={index} />
   );
   return (
      <main className="relative">
         <Navbar />
         <section className="px-6 pt-16 ">
            <div className="grid-cols-5 gap-10 pt-5 mb-5 lg:grid md:px-20">
               <div className="overflow-x-hidden lg:col-span-3 md:px-0 lg:px-12">
                  <TopicSlider />
                  {blogPosts?.map((post: Post) => {
                     const {
                        author,
                        id,
                        image,
                        snippet,
                        title,
                        created_at,
                        profile_id,
                        author_image,
                        bookmark_count,
                        likes_count,
                        comment_count,
                        category_Ids,
                        content,
                     } = post;
                     const readTime = calculateReadTime(content);

                     return (
                        <PostCard
                           key={id}
                           author={author}
                           id={id}
                           image={image}
                           snippet={snippet}
                           title={title}
                           author_image={author_image}
                           bookmark_count={bookmark_count}
                           created_at={created_at}
                           likes_count={likes_count}
                           comment_count={comment_count}
                           profile_id={profile_id}
                           category_Ids={category_Ids}
                           readTime={readTime}
                           content={content}
                        />
                     );
                  })}
                  {isLoading && (
                     <div className="flex flex-col w-full">
                        {skeletonElements}
                     </div>
                  )}

                  {totalPosts !== null &&
                     posts !== null &&
                     totalPosts > (posts ? posts.length : 0) && (
                        <div className="my-10">
                           <button
                              disabled={isFetching}
                              onClick={handleLoadMoreClick}
                              className={`${
                                 isFetching && "bg-wh-300 animate-bounce"
                              } w-full px-5 py-2 mt-5 font-semibold md:w-auto bg-accent-red  rounded-full hover-bg-wh-500 text-black`}>
                              {isFetching ? "Loading More..." : "Load More"}
                           </button>
                        </div>
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

                  {totalPosts === 0 && (
                     <div className="flex flex-col w-full">
                        {skeletonElements}
                     </div>
                  )}
               </div>

               <div className="md:pl-8 md:border-l lg:col-span-2 border-foreground/40 lg:px-6">
                  <Sidebar type="home" />
               </div>
            </div>
         </section>
      </main>
   );
};

export default page;
