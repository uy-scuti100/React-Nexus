import { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import Sidebar from "../../components/myComponents/global/Sidebar";
import { Post } from "../../../types";
import Navbar from "../../components/myComponents/global/Navbar";
import supabase from "../../lib/supabaseClient";
import TopicSlider from "../../components/myComponents/global/TopicSlider";
import PostCard from "../posts/PostCard";
import { calculateReadTime } from "../../lib/readTime";
import PostCardSkeleton from "../../components/myComponents/skeletons/PostCardSkeleton";
import { useFetchFollowingPosts } from "../../hooks/useFetchFollowingPosts";
import { useFetchUser } from "../../hooks/useFetchUser";
import MinimalPostCard from "../../components/myComponents/global/MinimalPostCard";

const Page = () => {
   const { user } = useFetchUser();
   const currentUserId = user?.id;
   const [followingIds, setFollowingIds] = useState<string[] | null>([]);
   const { posts, isLoading, isError } = useFetchFollowingPosts(
      followingIds as string[]
   );
   const [followingPosts, setFollowingPosts] = useState<
      Post[] | null | undefined
   >([]);
   console.log(followingPosts);
   console.log(followingIds);
   const [totalCount, setTotalCount] = useState<number | null>(0);
   console.log(totalCount);
   const [isFetching, setIsFetching] = useState<boolean>(false);
   const from = Number(followingPosts?.length);
   const [scrollPosition, setScrollPosition] = useState(0);

   useEffect(() => {
      if (typeof window !== "undefined" && posts !== null) {
         setFollowingPosts(posts);
      }
   }, [posts]);

   const fetchFollowingIds = async (userId: string) => {
      try {
         const { data, error } = await supabase
            .from("follow")
            .select("following_id")
            .eq("follower_id", userId);

         if (error) {
            throw new Error(error.message);
         }

         if (data) {
            // Transform the data into an array of strings
            const followingIds = data.map((item) => item.following_id);
            setFollowingIds(followingIds);
         } else {
            setFollowingIds([]);
         }
      } catch (error) {
         console.error(error);
      }
   };

   useEffect(() => {
      fetchFollowingIds(currentUserId as string);
   }, []);
   useEffect(() => {
      // Fetch the total count of posts for the category
      async function fetchTotalCount() {
         try {
            if (followingIds) {
               const { data, error } = await supabase
                  .from("posts")
                  .select("*")
                  .in("profile_id", followingIds);

               if (error) {
                  throw new Error(error.message);
               }

               const totalCount = data.length;
               setTotalCount(totalCount);
               console.log(totalCount);
            }
         } catch (error) {
            console.error(error);
         }
      }

      if (followingIds) {
         fetchTotalCount();
      }
   }, [followingIds]);

   const fetchMorePosts = async () => {
      if (isFetching) {
         return;
      }
      setIsFetching(true);
      try {
         if (followingIds) {
            const { data, error } = await supabase
               .from("posts")
               .select("*")
               .in("profile_id", followingIds)
               .range(from, from + 4)
               .order("created_at", { ascending: false });

            if (error) {
               throw new Error("Failed to fetch more posts");
            }

            setFollowingPosts((prevPosts) => [...(prevPosts || []), ...data]);
         }
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
                  {/* <RecommendedPosts /> */}
                  <div className="flex flex-col w-full gap-5 mt-20">
                     {followingPosts?.map((post: Post, i: number) => {
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

                  {followingPosts === null ||
                     (Array.isArray(followingPosts) &&
                        followingPosts.length === 0 && (
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
