import { BadgeCheck, CalendarIcon, Heart, MessageCircle } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { useState, useEffect } from "react";
import { useTheme } from "../../components/providers/theme/theme-provider";
import { useFetchUser } from "../../hooks/useFetchUser";
import supabase from "../../lib/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
   HoverCard,
   HoverCardContent,
   HoverCardTrigger,
} from "../../components/ui/hover-card";
import {
   Avatar,
   AvatarFallback,
   AvatarImage,
} from "../../components/ui/avatar";
dayjs.extend(relativeTime);

const dateFormatter = new Intl.DateTimeFormat(undefined, {
   dateStyle: "medium",
});

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
   profile_id: string;
}

const PostCard = ({
   author,
   id,
   image,
   snippet,
   title,
   created_at,
   category_name,
   author_image,
   bookmark_count,
   profile_id,
   likes_count,
   comment_count,
}: PostCardProp) => {
   const { theme } = useTheme();
   const [isAuthorized, setIsAuthorized] = useState<boolean | undefined>(
      undefined
   );
   const [bookmarkCount, setBookmarkCount] = useState(bookmark_count);
   const [likeCount, setLikeCount] = useState(likes_count);
   const [commentCount, setCommentcount] = useState(comment_count);
   const [isBookmarked, setIsBookmarked] = useState(false);
   const [isLiked, setIsLiked] = useState(false);
   const { user } = useFetchUser();
   const userId = user?.id;
   const postId = id;
   const [bio, setBio] = useState("");
   const [username, setUsername] = useState("");
   const [joinedDate, setJoinedDate] = useState("");
   const { user: currentUser } = useFetchUser();
   const [isFollowing, setIsFollowing] = useState(false);
   const [followersCount, setFollowersCount] = useState(0);
   const [followingCount, setFollowingCount] = useState(0);
   const currentUserId = currentUser?.id;
   const navigate = useNavigate();

   // check following
   useEffect(() => {
      async function checkFollowing() {
         const { data, error } = await supabase
            .from("follow")
            .select()
            .eq("follower_id", currentUserId)
            .eq("following_id", profile_id);

         if (data && data.length > 0) {
            setIsFollowing(true);
         } else {
            setIsFollowing(false);
         }
      }

      if (currentUserId && profile_id) {
         checkFollowing();
      }
   }, [currentUserId, profile_id]);

   const handleFollow = async () => {
      if (isFollowing) {
         // If already following, unfollow
         const { error } = await supabase
            .from("follow")
            .delete()
            .eq("follower_id", currentUserId)
            .eq("following_id", profile_id);

         if (!error) {
            setIsFollowing(false);
            setFollowersCount((prevCount) => prevCount - 1);
         }
      } else {
         // If not following, follow
         const { error } = await supabase.from("follow").insert([
            {
               follower_id: currentUserId,
               following_id: profile_id,
               follower_username: currentUser?.username,
               following_username: username,
            },
         ]);

         if (!error) {
            setIsFollowing(true);
            setFollowersCount((prevCount) => prevCount + 1);
         }
      }
   };

   // funtion to manage following count ]]==
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

         // Fetch the following count
         const { data: followingData, error: followingError } = await supabase
            .from("follow")
            .select("following_id")
            .eq("follower_id", profile_id);

         if (!followingError) {
            setFollowingCount(followingData.length);
         }
      }

      if (currentUserId) {
         fetchCounts();
      }
   }, [currentUserId, profile_id]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const { data: profiles, error } = await supabase
               .from("profiles")
               .select("*")
               .eq("id", profile_id)
               .single();

            if (error) {
               console.error("Error fetching profile:", error);
            } else {
               const bio = profiles?.bio;
               const joinedDate = profiles?.created_at;
               const username = profiles?.username;
               const isAuthorized = profiles?.isVerified === true;
               setBio(bio);
               setUsername(username);
               setIsAuthorized(isAuthorized);
               setJoinedDate(joinedDate);
            }
         } catch (error) {
            console.error("An error occurred:", error);
         }
      };
      fetchData();
   }, [profile_id]);

   //    check for bookmark based on user

   useEffect(() => {
      const checkBookmarkStatus = async () => {
         if (postId && userId) {
            const { data, error } = await supabase
               .from("bookmarks")
               .select("*")
               .eq("profile_id", userId)
               .eq("post_id", postId);

            if (data && data.length > 0) {
               setIsBookmarked(true);
            }
         }
      };

      checkBookmarkStatus();
   }, [postId, userId]);

   // Check if the user has liked the post
   const checkLikeStatus = async () => {
      if (postId && userId) {
         const { data, error } = await supabase
            .from("likes")
            .select("*")
            .eq("profile_id", userId)
            .eq("post_id", postId);

         if (data && data.length > 0) {
            setIsLiked(true);
         }
      }
   };

   useEffect(() => {
      checkLikeStatus();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [postId, userId]);

   //    toggle bookmark
   const toggleBookmark = async () => {
      if (isBookmarked) {
         // Remove the bookmark
         await supabase
            .from("bookmarks")
            .delete()
            .eq("profile_id", userId)
            .eq("post_id", postId);

         setIsBookmarked(false);
         // Decrement the bookmark_count
         setBookmarkCount((prevCount) => prevCount - 1);
      } else {
         // Add the bookmark
         await supabase.from("bookmarks").insert([
            {
               profile_id: userId,
               post_id: postId,
            },
         ]);

         setIsBookmarked(true);
         // Increment the bookmark_count
         setBookmarkCount((prevCount) => prevCount + 1);
      }
   };

   // Toggle the like
   const toggleLike = async () => {
      if (isLiked) {
         // Remove the like
         await supabase
            .from("likes")
            .delete()
            .eq("profile_id", userId)
            .eq("post_id", postId);

         setIsLiked(false);
         // Decrement the like_count (if you have it)
         setLikeCount((prevCount: any) => prevCount - 1);
      } else {
         // Add the like
         await supabase.from("likes").insert([
            {
               profile_id: userId,
               post_id: postId,
            },
         ]);

         setIsLiked(true);
         // Increment the like_count (if you have it)
         setLikeCount((prevCount: any) => prevCount + 1);
      }
   };

   const goHome = () => {
      navigate("/");
   };

   return (
      <div key={id} className="mb-10">
         <Link to={`/post/${id}`}>
            <div className="relative w-full h-56 mb-6 md:h-96">
               {image ? (
                  <img
                     src={image}
                     alt="post image"
                     style={{
                        objectFit: "cover",
                        maxWidth: "100%",
                        maxHeight: "100%",
                        width: "100%",
                        height: "100%",
                     }}
                     className="duration-700 ease-in-out"
                  />
               ) : (
                  <div className="relative w-full h-56 mb-6 duration-300 bg-gray-300 md:h-96 animate-pulse" />
               )}
               <Badge variant="secondary" className="absolute top-2 right-2">
                  {category_name}
               </Badge>
            </div>
         </Link>
         <div className="w-full px-6 border-b border-black/10 dark:border-white/10" />
         <Link to={`/post/${id}`}>
            <div className="py-4 text-2xl font-bold capitalize">{title}</div>
         </Link>
         <div className="w-full px-6 border-b border-black/10 dark:border-white/10" />
         <div className="flex items-center justify-between py-3">
            <HoverCard>
               <HoverCardTrigger asChild>
                  <Link
                     to={`/account/${profile_id}`}
                     className="flex items-center gap-3 capitalize">
                     <img
                        src={author_image}
                        width={50}
                        height={50}
                        alt="user-profile-img"
                        className="border border-accent w-[50px] h-[50px] rounded-full cursor-pointer"
                     />
                     <div className="flex items-center gap-2">
                        <p>{author} </p>
                        <span>
                           {isAuthorized && <BadgeCheck className="w-4 h-4" />}
                        </span>
                     </div>
                  </Link>
               </HoverCardTrigger>
               <HoverCardContent className="w-[380px]">
                  <div className="flex justify-between space-x-4">
                     <Link to={`/account/${profile_id}`}>
                        <Avatar>
                           <AvatarImage src={author_image} />
                           <AvatarFallback className="uppercase">
                              {author.substring(0, 2)}
                           </AvatarFallback>
                        </Avatar>
                     </Link>
                     <div className="space-y-1">
                        <div className="flex justify-between gap-5">
                           <Link to={`/account/${profile_id}`}>
                              <h4 className="font-semibold">{author}</h4>
                           </Link>
                           {profile_id !== userId && (
                              <button
                                 onClick={handleFollow}
                                 type="submit"
                                 className="px-4 py-1 font-semibold bg-accent-red hover:bg-wh-500 text-wh-10 dark:text-black">
                                 {isFollowing ? "Unfollow" : "Follow"}
                              </button>
                           )}
                        </div>
                        <Link to={`/account/${profile_id}`}>
                           <h4 className="text-xs opacity-90">{username}</h4>
                        </Link>
                        <p className="pt-2 text-sm">{bio}</p>
                        <div className="flex gap-3 py-2 text-sm">
                           <p className="font-bold ">
                              {followersCount}{" "}
                              <span className="opacity-50">Followers</span>{" "}
                           </p>
                           <p className="font-bold">
                              {followingCount}{" "}
                              <span className="opacity-50">Following</span>{" "}
                           </p>
                        </div>
                        <div className="flex items-center pt-2">
                           <CalendarIcon className="w-4 h-4 mr-2 opacity-70" />
                           <span className="text-xs text-muted-foreground">
                              <p suppressHydrationWarning>
                                 {joinedDate && (
                                    <div className="flex items-center gap-2">
                                       <p>
                                          Joined on{" "}
                                          {dateFormatter.format(
                                             new Date(joinedDate)
                                          )}
                                       </p>
                                       <p
                                          suppressHydrationWarning
                                          className="text-[10px]">
                                          {" "}
                                          (
                                          {dayjs().diff(
                                             joinedDate,
                                             "seconds",
                                             true
                                          ) < 30
                                             ? "just now"
                                             : dayjs(joinedDate).fromNow()}
                                          )
                                       </p>
                                    </div>
                                 )}
                              </p>
                           </span>
                        </div>
                     </div>
                  </div>
               </HoverCardContent>
            </HoverCard>

            <div className="text-wh-300">
               {/* <p suppressHydrationWarning>
                  {dateFormatter.format(Date.parse(created_at))}
               </p>{" "} */}
               <p suppressHydrationWarning>
                  {dayjs().diff(created_at, "seconds", true) < 30
                     ? "just now"
                     : dayjs(created_at).fromNow()}
               </p>
            </div>
         </div>
         <div className="pt-3 pb-8 text-lg font-medium capitalize">
            {snippet.substring(0, 120)}...
         </div>
         <div className="w-full px-6 border-b border-black/10 dark:border-white/10" />
         <div className="flex items-center justify-between pt-5 md:justify-normal md:gap-20">
            <div className="flex items-center gap-1">
               <button onClick={user ? toggleBookmark : goHome}>
                  {isBookmarked ? (
                     // Bookmarked
                     <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        // @ts-ignore
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
                        fill={theme === "dark" ? "#ffffff" : "#000"}
                        // @ts-ignore
                        className="no">
                        <title>bookmark</title>
                        <path
                           d="M17.5 1.25a.5.5 0 0 1 1 0v2.5H21a.5.5 0 0 1 0 1h-2.5v2.5a.5.5 0 0 1-1 0v-2.5H15a.5.5 0 0 1 0-1h2.5v-2.5zm-11 4.5a1 1 0 0 1 1-1H11a.5.5 0 0 0 0-1H7.5a2 2 0 0 0-2 2v14a.5.5 0 0 0 .8.4l5.7-4.4 5.7 4.4a.5.5 0 0 0 .8-.4v-8.5a.5.5 0 0 0-1 0v7.48l-5.2-4a.5.5 0 0 0-.6 0l-5.2 4V5.75z"
                           fill="currentcolor"></path>
                     </svg>
                  )}
               </button>
               <p>{bookmarkCount > 0 ? <p>{bookmarkCount}</p> : ""}</p>
            </div>
            <Link to={user ? `/post/${postId}` : "/"}>
               <div className="flex items-center gap-1">
                  <MessageCircle className="w-6 h-6 opacity-70" />
                  <p>{commentCount > 0 ? <p>{commentCount}</p> : ""}</p>
               </div>
            </Link>

            <div className="flex items-center gap-1">
               <button onClick={user ? toggleLike : goHome}>
                  {isLiked ? (
                     <svg
                        aria-label="Unlike"
                        // @ts-ignore
                        class="x1lliihq x1n2onr6"
                        color="rgb(255, 48, 64)"
                        fill={theme === "dark" ? "#ffffff" : "#000"}
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
               <p>{likeCount > 0 ? <p>{likeCount}</p> : ""}</p>
            </div>
         </div>
      </div>
   );
};

export default PostCard;
