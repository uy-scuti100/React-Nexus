import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetchCategoryPost } from "../../hooks/useFetchCategoryPost";
import CategoryCard from "./Categories";
import Subscribe from "../../components/myComponents/global/Subscribe";
import Sidebar from "../../components/myComponents/global/Sidebar";
import { Post } from "../../../types";
import Navbar from "../../components/myComponents/global/Navbar";
import supabase from "../../lib/supabaseClient";
import TopicSlider from "../../components/myComponents/global/TopicSlider";
import PostCard from "../posts/PostCard";
import { calculateReadTime } from "../../lib/readTime";
import PostCardSkeleton from "../../components/myComponents/skeletons/PostCardSkeleton";

const Page = () => {
   const { id } = useParams();
   const paramsId = id;
   // const pathname = window.location.pathname.split("/")[2];
   const { posts, isLoading } = useFetchCategoryPost(paramsId as string);
   const [categoryPosts, setCategoryPosts] = useState<
      Post[] | null | undefined
   >([]);
   const [totalCount, setTotalCount] = useState<number | null>(null);
   const [isFetching, setIsFetching] = useState<boolean>(false);
   const from = Number(categoryPosts?.length);

   useEffect(() => {
      setCategoryPosts(posts);
   }, [paramsId]);

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
            // console.log(totalCount);
         } catch (error) {
            console.error(error);
         }
      }

      fetchTotalCount();
   }, [paramsId]);
   // useEffect(() => {
   //    const fetchTopicPosts = async () => {
   //       setIsLoading(true);
   //       try {
   //          const { data, error } = await supabase
   //             .from("posts")
   //             .select("*")
   //             .contains("category_Ids", [path]);

   //          if (error) {
   //             console.error("Error fetching posts:", error);
   //             return;
   //          }

   //          if (data && data.length > 0) {
   //             setCategoryPosts(data);
   //          } else {
   //             console.error("No post found for the given ID.");
   //          }
   //       } catch (e) {
   //          console.error("An unexpected error occurred:", e);
   //       } finally {
   //          setIsLoading(false);
   //       }
   //    };

   //    fetchTopicPosts();
   // }, [id]);

   const fetchMorePosts = async () => {
      setIsFetching(true);
      try {
         const { data, error } = await supabase
            .from("posts")
            .select()
            .range(from, from + 10)
            .contains("category_Ids", [paramsId]); // Adjust the column name and condition as needed

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
   const skeletonElements = Array.from({ length: 5 }, (_, index) => (
      <PostCardSkeleton key={index} />
   ));
   return (
      <main className="relative">
         <Navbar />
         <section className="px-6 pt-16">
            <div className="gap-10 pt-5 mb-5 md:flex md:px-20">
               <div className="overflow-x-hidden md:basis-3/5 lg:basis-3/4 md:px-0 lg:px-24 ">
                  <TopicSlider />

                  <div className="flex flex-col w-full gap-5">
                     {posts?.map((post: Post, i: number) => {
                        const {
                           author,
                           id,
                           image,
                           snippet,
                           category_Ids,
                           title,
                           created_at,
                           profile_id,
                           author_image,
                           bookmark_count,
                           likes_count,
                           comment_count,
                           content,
                        } = post;

                        const readTime = calculateReadTime(content);

                        return (
                           <PostCard
                              content={content}
                              key={id}
                              readTime={readTime}
                              author={author}
                              id={id}
                              image={image}
                              snippet={snippet}
                              title={title}
                              author_image={author_image}
                              bookmark_count={bookmark_count}
                              category_Ids={category_Ids}
                              created_at={created_at}
                              likes_count={likes_count}
                              comment_count={comment_count}
                              profile_id={profile_id}
                           />
                        );
                     })}
                  </div>
                  {isLoading && (
                     <div className="flex flex-col w-full gap-5">
                        {skeletonElements}
                     </div>
                  )}
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

                  {categoryPosts === null ||
                     (Array.isArray(categoryPosts) &&
                        categoryPosts.length === 0 && (
                           <div>
                              <div className="flex items-center justify-center">
                                 <div className="relative w-full md:w-[500px] h-[500px]">
                                    <img
                                       src="/No data-amico.png"
                                       alt="loading-image"
                                       className="object-cover"
                                    />
                                 </div>
                              </div>
                              <div className="pb-10 text-2xl font-bold text-center">
                                 No Article from this topic
                              </div>
                           </div>
                        ))}
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
