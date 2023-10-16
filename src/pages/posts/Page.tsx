import { useEffect, useState } from "react";
import Category from "../../components/myComponents/global/Category";
import Navbar from "../../components/myComponents/global/Navbar";
import Sidebar from "../../components/myComponents/global/Sidebar";
import HomeCard from "./HomeCard";
import supabase from "../../lib/supabaseClient";
import { usePost } from "../../hooks/usePost";
import { Post } from "../../../types";

const page = () => {
   const [isFetching, setIsFetching] = useState(false);
   const [totalPosts, setTotalPosts] = useState<number | null>(0);
   const { posts: initialPosts, isLoading } = usePost();
   const [error, setError] = useState(false);
   const [blogPosts, setBlogPosts] = useState<Post[] | null>([]);

   useEffect(() => {
      setBlogPosts(initialPosts);
   });
   //  Function to fetch the total number of posts
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
         const from = blogPosts ? blogPosts.length : 0;
         console.log("Fetching from:", from); // Log the 'from' value
         const { data, error } = await supabase
            .from("posts")
            .select("*")
            .range(from, from + 9)
            .order("created_at", { ascending: false });
         console.log("Fetched data:", data); // Log the fetched data
         console.log("Fetch error:", error); // Log any errors

         if (!error) {
            if (data && data.length > 0) {
               setBlogPosts((prevPosts) => [...(prevPosts || []), ...data]);
            } else {
               setError(true);
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
   return (
      <main className="relative">
         <Navbar />
         <section className="px-6 pt-16 ">
            <div className="gap-10 pt-5 mb-5 md:flex md:px-20">
               <div className="md:basis-3/5 lg:basis-3/4 md:px-0 lg:px-24">
                  {/* posts */}
                  <HomeCard
                     blogPosts={blogPosts}
                     isLoading={isLoading}
                     totalPosts={totalPosts}
                  />
                  {totalPosts !== null &&
                     blogPosts !== null &&
                     totalPosts > (blogPosts ? blogPosts.length : 0) && (
                        <div className="my-10">
                           <button
                              disabled={isFetching}
                              onClick={handleLoadMoreClick}
                              className={`${
                                 isFetching && "bg-wh-300 animate-bounce"
                              } w-full px-5 py-2 mt-5 font-semibold md:w-auto bg-accent-red hover-bg-wh-500 text-black`}>
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
                     <div className="pb-10">No Posts to fetch</div>
                  )}
               </div>

               <div className="md:pl-8 md:border-l md:basis-2/5 lg:basis1/4 border-foreground/40 lg:px-6">
                  <Sidebar type="home" />
               </div>
            </div>
         </section>
      </main>
   );
};

export default page;
