import { BadgeDollarSign, Heart, MailPlus, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import {
   Tooltip,
   TooltipContent,
   TooltipProvider,
   TooltipTrigger,
} from "../../components/ui/tooltip";
import { Link, useNavigate } from "react-router-dom";
import { useFetchUser } from "../../hooks/useFetchUser";
import supabase from "../../lib/supabaseClient";
import { Post } from "../../../types";
import { useTheme } from "../../components/providers/theme/theme-provider";
import { calculateReadTime } from "../../lib/readTime";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
interface WriterProp {
   profile_id: string;
   author_image: string;
   author: string;
   isFollowing: boolean;
   isAuthorized: boolean | undefined;
   handleFollow: () => void;
   postId: string;
   categoryIds: string[];
}

const AboutWriter = ({
   profile_id,
   author_image,
   author,
   isAuthorized,
   handleFollow,
   isFollowing,
   postId,
   categoryIds,
}: WriterProp) => {
   const theme = useTheme();
   const [followersCount, setFollowersCount] = useState<number | null>(null);
   const [recommendedPosts, setRecommendedPosts] = useState<Array<Post>>([]);
   const [authorPosts, setAuthorPosts] = useState<Array<Post>>([]);
   // console.log("recommended posts:", recommendedPosts);
   // console.log("recommended catId:", categoryIds);
   const [postStatus, setPostStatus] = useState<{
      [postId: string]: { isBookmarked: boolean; isLiked: boolean };
   }>({});
   const [bio, setBio] = useState<string | null | undefined>("");
   const { user } = useFetchUser();
   const currentUserId = user?.id;
   const image = author_image;
   const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
   };
   const navigate = useNavigate();
   useEffect(() => {
      async function fetchCounts() {
         // Fetch the followers count
         const { data: followersData, error: followersError } = await supabase
            .from("follow")
            .select("follower_id")
            .eq("following_id", profile_id);

         if (!followersError) {
            setFollowersCount(followersData.length);
         }
      }
      fetchCounts();
   }, [profile_id]);

   useEffect(() => {
      async function fetchBio() {
         const { data, error } = await supabase
            .from("profiles")
            .select("bio")
            .eq("id", profile_id)
            .single();

         if (!error) {
            setBio(String(data.bio));
         }
      }

      fetchBio();
   }, [profile_id]);

   // fetch more posts
   useEffect(() => {
      const fetchMorePosts = async () => {
         const { data, error } = await supabase
            .from("posts")
            .select("*")
            .eq("profile_id", profile_id)
            .limit(5)
            .order("created_at", { ascending: false });

         if (data && !error) {
            // Filter out the current post based on postId
            const filteredPosts = data.filter((post) => post.id !== postId);
            setAuthorPosts(filteredPosts);
         }
      };

      fetchMorePosts();
   }, [profile_id, postId]);
   // Toggle the bookmark for moreposts from author
   const toggleBookmark = async (postId: string) => {
      const post = authorPosts.find((p) => p.id === postId);
      if (!post) return;

      if (postStatus[post.id]?.isBookmarked) {
         // Remove the bookmark
         await supabase
            .from("bookmarks")
            .delete()
            .eq("profile_id", currentUserId)
            .eq("post_id", postId);

         setPostStatus((prevStatus) => ({
            ...prevStatus,
            [postId]: { ...prevStatus[postId], isBookmarked: false },
         }));

         // Decrement the bookmark_count
      } else {
         // Add the bookmark
         await supabase.from("bookmarks").insert([
            {
               profile_id: currentUserId,
               post_id: postId,
            },
         ]);

         setPostStatus((prevStatus) => ({
            ...prevStatus,
            [postId]: { ...prevStatus[postId], isBookmarked: true },
         }));

         // Increment the bookmark_count
      }
   };
   // Toggle the like for moreposts from author
   const toggleLike = async (postId: string) => {
      const post = authorPosts.find((p) => p.id === postId);
      if (!post) return;

      if (postStatus[post.id]?.isLiked) {
         // Remove the like
         await supabase
            .from("likes")
            .delete()
            .eq("profile_id", currentUserId)
            .eq("post_id", postId);

         setPostStatus((prevStatus) => ({
            ...prevStatus,
            [postId]: { ...prevStatus[postId], isLiked: false },
         }));

         // Decrement the like_count (if you have it)
      } else {
         // Add the like
         await supabase.from("likes").insert([
            {
               profile_id: currentUserId,
               post_id: postId,
            },
         ]);

         setPostStatus((prevStatus) => ({
            ...prevStatus,
            [postId]: { ...prevStatus[postId], isLiked: true },
         }));

         // Increment the like_count (if you have it)
      }
   };

   const goHome = () => {
      navigate("/");
   };
   // Fetch recommended posts based on currentPost's category_ids
   useEffect(() => {
      // Fetch recommended posts based on currentPost's category_ids
      if (categoryIds) {
         // Query recommended posts based on category_ids of the current post
         const fetchRecommendedPosts = async () => {
            const { data, error } = await supabase
               .from("posts")
               .select("*")
               .contains("category_Ids", categoryIds)
               .limit(4)
               .order("created_at", { ascending: false });

            if (error) {
               console.error(
                  "Error fetching recommended posts:",
                  error.message
               );
               return [];
            }
            const filteredPosts = data.filter((post) => post.id !== postId);

            setRecommendedPosts(filteredPosts);
         };

         fetchRecommendedPosts();
      }
   }, [categoryIds]);

   return (
      <section>
         <div className="w-full px-6 py-4 border-b border-black/10 dark:border-white/10" />
         <Link
            to={`/account/${profile_id}`}
            onClick={scrollToTop}
            className="gap-4 pt-10 md:flex">
            <img
               src={image}
               width={64}
               height={64}
               alt="author_image"
               className="w-[64px] h-[64px] rounded-full cursor-pointer object-cover mb-4 md:mb-0"
            />
            <div className="flex flex-col gap-2">
               <div>{bio}</div>
               <p>
                  {followersCount}{" "}
                  <span className="opacity-75"> Followers</span>{" "}
                  <span className="hidden">Writer for Osiris</span>
               </p>
            </div>
         </Link>
         <div className="justify-between mt-10 md:flex">
            <div className="flex items-center gap-2 pb-5 text-xl font-bold md:pb-0">
               <div className="relative">
                  Written by {author}
                  <p className="absolute top-2 -right-6">
                     {isAuthorized && (
                        <img
                           src="/bluecheck-removebg-preview.png"
                           alt="checkmark"
                           height={14}
                           width={14}
                        />
                     )}
                  </p>
               </div>
            </div>
            <div className="flex items-center gap-5 md:gap-3">
               {profile_id !== currentUserId && (
                  <>
                     <button
                        className="w-auto px-3 py-2 text-xs font-semibold text-black md:px-5 bg-accent-red hover:bg-wh-500 "
                        onClick={handleFollow}>
                        {isFollowing ? "UnFollow" : "Follow"}
                     </button>
                     <TooltipProvider>
                        <Tooltip>
                           <TooltipTrigger>
                              <button
                                 className="p-2 rounded-full text-background bg-foreground"
                                 onClick={() =>
                                    alert(
                                       "Feature coming Soon.. Stay Tuned 😉😁📧"
                                    )
                                 }>
                                 <MailPlus />
                              </button>
                           </TooltipTrigger>
                           <TooltipContent>
                              <p className="text-center">
                                 Subcribe to get an email <br /> whenever{" "}
                                 {author} <br /> publishes an article
                              </p>
                           </TooltipContent>
                        </Tooltip>
                     </TooltipProvider>
                     <TooltipProvider>
                        <Tooltip>
                           <TooltipTrigger>
                              <button
                                 className="p-2 rounded-full text-background bg-foreground "
                                 onClick={() =>
                                    alert(
                                       "Feature coming Soon.. Stay Tuned 😁🤑💲"
                                    )
                                 }>
                                 <BadgeDollarSign />
                              </button>
                           </TooltipTrigger>
                           <TooltipContent>
                              <p>Give a tip to {author}</p>
                           </TooltipContent>
                        </Tooltip>
                     </TooltipProvider>
                  </>
               )}
            </div>
         </div>
         <div className="w-full px-6 py-4 border-b border-black/10 dark:border-white/10" />
         <div>
            {authorPosts.length > 0 && (
               <div className="pt-10 md:pt-20">
                  <p className="pb-5 text-xl font-bold capitalize md:text-3xl">
                     More Articles from {author}
                  </p>

                  <div className="grid-cols-2 gap-20 px-4 py-5 md:grid md:px-0">
                     {authorPosts?.map((post: Post, i: number) => {
                        const readTime = calculateReadTime(post.content);
                        return (
                           <div className="flex flex-col md:h-[360px] ">
                              <Link
                                 to={`/post/${post.id}`}
                                 key={i}
                                 className="mx-2"
                                 onClick={scrollToTop}>
                                 <img
                                    src={post.image}
                                    alt="post-image"
                                    className="w-full h-[200px] mb-5 object-cover"
                                 />
                                 <p className="mb-2 text-xl font-bold capitalize">
                                    {post.title.substring(0, 40)}...
                                 </p>
                                 <p className="text-sm opacity-50 first-letter:uppercase">
                                    {post.snippet.substring(0, 30)}...
                                 </p>
                                 <div className="flex items-center gap-8 pt-2">
                                    <p>{readTime} min read.</p>
                                    <p
                                       suppressHydrationWarning
                                       className="text-[14px]">
                                       {" "}
                                       {dayjs().diff(
                                          post.created_at,
                                          "seconds",
                                          true
                                       ) < 30
                                          ? "just now"
                                          : dayjs(post.created_at).fromNow()}
                                    </p>
                                 </div>
                              </Link>
                              <div className="flex items-center justify-between pt-5 md:justify-normal md:gap-20">
                                 <div className="flex items-center gap-1">
                                    <button
                                       onClick={() =>
                                          user
                                             ? toggleBookmark(post.id)
                                             : goHome
                                       }>
                                       {postStatus[post.id]?.isBookmarked ? (
                                          // Bookmarked
                                          <svg
                                             width="24"
                                             height="24"
                                             viewBox="0 0 24 24"
                                             fill="none"
                                             className="ut">
                                             <title>unbookmark</title>
                                             <path
                                                d="M7.5 3.75a2 2 0 0 0-2 2v14a.5.5 0 0 0 .8.4l5.7-4.4 5.7 4.4a.5.5 0 0 0 .8-.4v-14a2 2 0 0 0-2-2h-9z"
                                                fill="currentcolor"></path>
                                          </svg>
                                       ) : (
                                          // Not bookmarked
                                          <svg
                                             width="24"
                                             height="24"
                                             viewBox="0 0 24 24"
                                             fill={
                                                // @ts-ignore
                                                theme === "dark"
                                                   ? "#ffffff"
                                                   : "#000"
                                             }
                                             className="no">
                                             <title>bookmark</title>
                                             <path
                                                d="M17.5 1.25a.5.5 0 0 1 1 0v2.5H21a.5.5 0 0 1 0 1h-2.5v2.5a.5.5 0 0 1-1 0v-2.5H15a.5.5 0 0 1 0-1h2.5v-2.5zm-11 4.5a1 1 0 0 1 1-1H11a.5.5 0 0 0 0-1H7.5a2 2 0 0 0-2 2v14a.5.5 0 0 0 .8.4l5.7-4.4 5.7 4.4a.5.5 0 0 0 .8-.4v-8.5a.5.5 0 0 0-1 0v7.48l-5.2-4a.5.5 0 0 0-.6 0l-5.2 4V5.75z"
                                                fill="currentcolor"></path>
                                          </svg>
                                       )}
                                    </button>
                                    <p>
                                       <p>
                                          {post.bookmark_count > 0 ? (
                                             <p>{post.bookmark_count}</p>
                                          ) : (
                                             ""
                                          )}
                                       </p>
                                    </p>
                                 </div>
                                 <Link
                                    to={user ? `/post/${post.id}` : "/"}
                                    onClick={scrollToTop}>
                                    <div className="flex items-center gap-1">
                                       <MessageCircle className="w-6 h-6 opacity-70" />
                                       <p>
                                          <p>
                                             {post.comment_count > 0 ? (
                                                <p>{post.comment_count}</p>
                                             ) : (
                                                ""
                                             )}
                                          </p>
                                       </p>
                                    </div>
                                 </Link>
                                 <div className="flex items-center gap-1">
                                    <button
                                       onClick={() =>
                                          user ? toggleLike(post.id) : goHome
                                       }>
                                       {postStatus[post.id]?.isLiked ? (
                                          <svg
                                             aria-label="Unlike"
                                             className="x1lliihq x1n2onr6"
                                             color="rgb(255, 48, 64)"
                                             fill={
                                                // @ts-ignore
                                                theme === "dark"
                                                   ? "#ffffff"
                                                   : "#000"
                                             }
                                             height="20"
                                             role="img"
                                             viewBox="0 0 48 48"
                                             width="20">
                                             <title>Unlike</title>
                                             <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
                                          </svg>
                                       ) : (
                                          <Heart className="w-6 h-6 opacity-70" />
                                       )}
                                    </button>
                                    <p>
                                       <p>
                                          {post.likes_count > 0 ? (
                                             <p>{post.likes_count}</p>
                                          ) : (
                                             ""
                                          )}
                                       </p>
                                    </p>
                                 </div>
                              </div>
                              <div className="w-full py-4 mb-8 border-b md:hidden border-black/10 dark:border-white/10" />
                           </div>
                        );
                     })}
                  </div>
               </div>
            )}
         </div>

         <div className="flex items-center justify-center mt-10">
            <Link to={`/account/${profile_id}`}>
               <button
                  className="w-full px-4 py-3 transition-colors duration-300 border md:w-auto hover:bg-accent-red hover:border-none whitespace-nowrap"
                  onClick={scrollToTop}>
                  See all articles from {author}
               </button>
            </Link>
         </div>
         {recommendedPosts.length > 0 && (
            <div className="py-20 ">
               <h1 className="py-20 text-xl font-bold text-center md:text-left md:text-3xl">
                  Recommendations from Nexus.
               </h1>

               <div className="grid-cols-2 gap-20 px-4 py-5 md:grid md:px-0">
                  {recommendedPosts?.map((post: Post, i: number) => {
                     const readTime = calculateReadTime(post.content);
                     return (
                        <div className="flex flex-col md:h-[360px] ">
                           <Link
                              to={`/post/${post.id}`}
                              key={i}
                              className="mx-2"
                              onClick={scrollToTop}>
                              <img
                                 src={post.image}
                                 alt="post-image"
                                 className="w-full h-[200px] mb-5 object-cover"
                              />
                              <p className="mb-2 text-xl font-bold capitalize">
                                 {post.title.substring(0, 40)}...
                              </p>
                              <p className="text-sm opacity-50 first-letter:uppercase">
                                 {post.snippet.substring(0, 30)}...
                              </p>
                              <div className="flex items-center gap-8 pt-2">
                                 <p>{readTime} min read.</p>
                                 <p
                                    suppressHydrationWarning
                                    className="text-[14px]">
                                    {" "}
                                    {dayjs().diff(
                                       post.created_at,
                                       "seconds",
                                       true
                                    ) < 30
                                       ? "just now"
                                       : dayjs(post.created_at).fromNow()}
                                 </p>
                              </div>
                           </Link>
                           <div className="flex items-center justify-between pt-5 md:justify-normal md:gap-20">
                              <div className="flex items-center gap-1">
                                 <button
                                    onClick={() =>
                                       user ? toggleBookmark(post.id) : goHome
                                    }>
                                    {postStatus[post.id]?.isBookmarked ? (
                                       // Bookmarked
                                       <svg
                                          width="24"
                                          height="24"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          className="ut">
                                          <title>unbookmark</title>
                                          <path
                                             d="M7.5 3.75a2 2 0 0 0-2 2v14a.5.5 0 0 0 .8.4l5.7-4.4 5.7 4.4a.5.5 0 0 0 .8-.4v-14a2 2 0 0 0-2-2h-9z"
                                             fill="currentcolor"></path>
                                       </svg>
                                    ) : (
                                       // Not bookmarked
                                       <svg
                                          width="24"
                                          height="24"
                                          viewBox="0 0 24 24"
                                          fill={
                                             // @ts-ignore
                                             theme === "dark"
                                                ? "#ffffff"
                                                : "#000"
                                          }
                                          className="no">
                                          <title>bookmark</title>
                                          <path
                                             d="M17.5 1.25a.5.5 0 0 1 1 0v2.5H21a.5.5 0 0 1 0 1h-2.5v2.5a.5.5 0 0 1-1 0v-2.5H15a.5.5 0 0 1 0-1h2.5v-2.5zm-11 4.5a1 1 0 0 1 1-1H11a.5.5 0 0 0 0-1H7.5a2 2 0 0 0-2 2v14a.5.5 0 0 0 .8.4l5.7-4.4 5.7 4.4a.5.5 0 0 0 .8-.4v-8.5a.5.5 0 0 0-1 0v7.48l-5.2-4a.5.5 0 0 0-.6 0l-5.2 4V5.75z"
                                             fill="currentcolor"></path>
                                       </svg>
                                    )}
                                 </button>
                                 <p>
                                    <p>
                                       {post.bookmark_count > 0 ? (
                                          <p>{post.bookmark_count}</p>
                                       ) : (
                                          ""
                                       )}
                                    </p>
                                 </p>
                              </div>
                              <Link
                                 to={user ? `/post/${post.id}` : "/"}
                                 onClick={scrollToTop}>
                                 <div className="flex items-center gap-1">
                                    <MessageCircle className="w-6 h-6 opacity-70" />
                                    <p>
                                       <p>
                                          {post.comment_count > 0 ? (
                                             <p>{post.comment_count}</p>
                                          ) : (
                                             ""
                                          )}
                                       </p>
                                    </p>
                                 </div>
                              </Link>
                              <div className="flex items-center gap-1">
                                 <button
                                    onClick={() =>
                                       user ? toggleLike(post.id) : goHome
                                    }>
                                    {postStatus[post.id]?.isLiked ? (
                                       <svg
                                          aria-label="Unlike"
                                          className="x1lliihq x1n2onr6"
                                          color="rgb(255, 48, 64)"
                                          fill={
                                             // @ts-ignore
                                             theme === "dark"
                                                ? "#ffffff"
                                                : "#000"
                                          }
                                          height="20"
                                          role="img"
                                          viewBox="0 0 48 48"
                                          width="20">
                                          <title>Unlike</title>
                                          <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
                                       </svg>
                                    ) : (
                                       <Heart className="w-6 h-6 opacity-70" />
                                    )}
                                 </button>
                                 <p>
                                    <p>
                                       {post.likes_count > 0 ? (
                                          <p>{post.likes_count}</p>
                                       ) : (
                                          ""
                                       )}
                                    </p>
                                 </p>
                              </div>
                           </div>
                           <div className="w-full py-4 mb-8 border-b md:hidden border-black/10 dark:border-white/10" />
                        </div>
                     );
                  })}
               </div>
            </div>
         )}
      </section>
   );
};

export default AboutWriter;
