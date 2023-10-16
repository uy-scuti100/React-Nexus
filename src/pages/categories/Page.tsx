import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetchCategoryPost } from "../../hooks/useFetchCategoryPost";
import CategoryCard from "./Categories";
import Subscribe from "../../components/myComponents/global/Subscribe";
import Sidebar from "../../components/myComponents/global/Sidebar";
import { Post } from "../../../types";
import Category from "../../components/myComponents/global/Category";
import Navbar from "../../components/myComponents/global/Navbar";
import supabase from "../../lib/supabaseClient";

const Page = () => {
   const { id } = useParams();
   const paramsId = id;
   const { posts, isLoading } = useFetchCategoryPost(paramsId as string);
   const [categoryPosts, setCategoryPosts] = useState<
      Post[] | null | undefined
   >([]);
   const [totalCount, setTotalCount] = useState<number | null>(null);
   const [isFetching, setIsFetching] = useState<boolean>(false);
   const from = Number(categoryPosts?.length);

   useEffect(() => {
      // Fetch the total count of posts for the category
      async function fetchTotalCount() {
         try {
            const { data, error } = await supabase
               .from("posts")
               .select("*")
               .contains("category_Ids", [paramsId]);

            if (error) {
               throw new Error("Failed to fetch total count");
            }

            const totalCount = data.length;
            setTotalCount(totalCount);
            console.log(totalCount);
         } catch (error) {
            console.error(error);
         }
      }

      fetchTotalCount();
   }, [paramsId]);

   useEffect(() => {
      setCategoryPosts(posts);
   }, [paramsId, posts]);

   const fetchMorePosts = async () => {
      setIsFetching(true);
      try {
         const { data, error } = await supabase
            .from("posts")
            .select()
            .range(from, from + 10)
            .eq("category_id", paramsId); // Adjust the column name and condition as needed

         if (error) {
            throw new Error("Failed to fetch more posts");
         }

         setCategoryPosts((prevPosts) => [...(prevPosts || []), ...data]);
      } catch (error) {
         console.error(error);
      } finally {
         setIsFetching(false);
      }
   };

   return (
      <main className="relative">
         <Navbar />
         <section className="px-6 pt-24">
            <Category />
            <div className="gap-10 pt-20 mb-5 md:flex md:px-20">
               <div className="px-4 md:basis-3/5 lg:basis-3/4 md:px-0 lg:px-24">
                  {/* posts */}
                  <CategoryCard
                     isLoading={isLoading}
                     categoryPosts={categoryPosts}
                  />
                  {categoryPosts &&
                     totalCount !== null &&
                     categoryPosts.length < totalCount && (
                        <button
                           disabled={isFetching}
                           onClick={fetchMorePosts}
                           className={`${
                              isFetching && "bg-wh-300 animate-bounce"
                           } w-full px-5 py-2 mt-5 font-semibold md:w-auto bg-accent-red hover:bg-wh-500 text-wh-10 dark:text-black`}>
                           {isFetching ? "Loading More..." : " Load More"}
                        </button>
                     )}
                  <div className="hidden md:block">
                     <Subscribe />
                  </div>
               </div>
               <div className="pl-8 border-l md:basis-2/5 lg:basis1/4 border-foreground/40 lg:px-6">
                  <Sidebar type="home" />
               </div>
            </div>
         </section>
      </main>
   );
};

export default Page;
