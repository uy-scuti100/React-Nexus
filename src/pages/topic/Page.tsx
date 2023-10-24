import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetchCategoryPost } from "../../hooks/useFetchCategoryPost";
import Sidebar from "../../components/myComponents/global/Sidebar";
import { Post } from "../../../types";
import Navbar from "../../components/myComponents/global/Navbar";
import supabase from "../../lib/supabaseClient";
import TopicSlider from "../../components/myComponents/global/TopicSlider";
import PostCard from "../posts/PostCard";
import { calculateReadTime } from "../../lib/readTime";
import PostCardSkeleton from "../../components/myComponents/skeletons/PostCardSkeleton";
import debounce from "lodash.debounce";
import MinimalPostCard from "../../components/myComponents/global/MinimalPostCard";

const Page = () => {
   const { id } = useParams();
   const paramsId = id;
   // const pathname = window.location.pathname.split("/")[2];
   const { posts, isLoading } = useFetchCategoryPost(paramsId as string);
   const [categoryPosts, setCategoryPosts] = useState<
      Post[] | null | undefined
   >([]);
   const [totalCount, setTotalCount] = useState<number | null>(0);
   const from = Number(categoryPosts?.length);
   const [scrollPosition, setScrollPosition] = useState(0);
   const [isFetching, setIsFetching] = useState<boolean>(false);

   useEffect(() => {
      setCategoryPosts(posts);
   }, [paramsId, posts]);

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

         } catch (error) {
            console.error(error);
         }
      }

      fetchTotalCount();
   }, [paramsId]);

   const skeletonElements = Array.from({ length: 5 }, (_, index) => (
      <PostCardSkeleton key={index} />
   ));

   const fetchMorePosts = async () => {
      if (isFetching) {
         return;
      }
      setIsFetching(true);
      try {
         const { data, error } = await supabase
            .from("posts")
            .select()
            .contains("category_Ids", [paramsId])
            .range(from, from + 4)
            .order("created_at", { ascending: false });

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

   useEffect(() => {
      const handleScroll = () => {
         const currentPosition = window.scrollY;

         const viewportHeight = window.innerHeight;
         const scrollThreshold = 1 * viewportHeight;

         if (currentPosition - scrollPosition > scrollThreshold) {
            fetchMorePosts();
            setScrollPosition(currentPosition);
         }
      };

      const debouncedHandleScroll = debounce(handleScroll, 300);

      window.addEventListener("scroll", debouncedHandleScroll);

      return () => {
         window.removeEventListener("scroll", debouncedHandleScroll);
      };
   }, [scrollPosition, fetchMorePosts]);

   return (
      <main className="relative">
         <Navbar />
         <section className="px-6 pt-16">
            <div className="gap-10 pt-5 mb-5 md:flex md:px-20">
               <div className="overflow-x-hidden md:basis-3/5 lg:basis-3/4 md:px-0 lg:px-24 ">
                  <TopicSlider />
                  {/* <RecommendedPosts /> */}
                  <div className="flex flex-col w-full gap-5 mt-10">
                     {categoryPosts?.map((post: Post, i: number) => {
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
                           <MinimalPostCard
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
               <div className="pl-8 md:border-l md:basis-2/5 lg:basis1/4 border-foreground/40 lg:px-6">
                  <Sidebar type="home" />
               </div>
            </div>
         </section>
      </main>
   );
};

export default Page;
