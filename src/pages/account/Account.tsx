import debounce from "lodash.debounce";
import { useEffect, useState } from "react";
import supabase from "../../lib/supabaseClient";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import {
   Briefcase,
   CalendarPlus,
   User2,
   ExternalLink,
   Hash,
   Mail,
   MapPin,
   MessageSquare,
   ScrollText,
   GraduationCap,
   X,
   MoreVertical,
   Trash2,
} from "lucide-react";
import { fetchSingleProfile } from "../../lib/fetchSingleProfile";
import { User } from "../../../types";
import { useFetchUser } from "../../hooks/useFetchUser";
import { Settings } from "./Settings";
import PostCardSkeleton from "../../components/myComponents/skeletons/PostCardSkeleton";
import { Badge } from "../../components/ui/badge";
import { calculateReadTime } from "../../lib/readTime";
import MinimalPostCard from "../../components/myComponents/global/MinimalPostCard";
interface PostCardProps {
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
   category_Ids: string[];
   content: string;
}

interface HashtagProp {
   user_id: string;
   hashtag_id: string;
   name: string;
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
   dateStyle: "medium",
});

const Account = () => {
   const { id: paramsId } = useParams();
   const { user: currentUser } = useFetchUser();
   const [isFollowing, setIsFollowing] = useState(false);
   const [followersCount, setFollowersCount] = useState<number | null>(null);
   const [followingCount, setFollowingCount] = useState<number | null>(null);
   const currentUserId = currentUser?.id;
   const [showSettings, setShowSettings] = useState(false);
   const [user, setUser] = useState<User | null | undefined>(null);
   const [name, setName] = useState<string | null | undefined>("");
   const [userHashtags, setUserHashtags] = useState<HashtagProp[] | null>([]);
   const [email, setEmail] = useState<string | null | undefined>("");
   const [showMoreDetails, setShowMoreDetails] = useState(false);
   const [avatar, setAvatar] = useState("");

   const [bio, setBio] = useState<string | null | undefined>("");
   const [postCount, setPostCount] = useState<number | null | undefined>(null);
   const [tagsCount, setTagsCount] = useState<number | null | undefined>(null);
   const [username, setUsername] = useState<string | null | undefined>(null);
   const [id, setId] = useState<string | null | undefined>(null);
   const [joinedDate, setJoinedDate] = useState<string | null | undefined>(
      null
   );
   const [location, setLocation] = useState<string | null | undefined>(null);
   const [website, setWebsite] = useState<string | null | undefined>(null);
   const [skills, setSkills] = useState<string | null | undefined>(null);
   const [pronouns, setPronouns] = useState<string | null | undefined>(null);
   const [work, setWork] = useState<string | null | undefined>(null);
   const [education, setEducation] = useState<string | null | undefined>(null);
   const [learning, setLearning] = useState<string | null | undefined>(null);
   const [building, setBuilding] = useState<string | null | undefined>(null);
   const [availability, setAvailability] = useState<string | null | undefined>(
      null
   );
   const [bannerPic, setBannerPic] = useState<string | null | undefined>(null);
   const [isVerified, setIsVerified] = useState<boolean | null | undefined>(
      null
   );
   const [showEmail, setShowEmail] = useState<boolean | null | undefined>(null);
   const [commentCount, setCommentCount] = useState<number | null | undefined>(
      null
   );
   const [scrollPosition, setScrollPosition] = useState(0);
   const [totalCount, setTotalCount] = useState<number | null>(null);
   const [isFetching, setIsFetching] = useState<boolean>(false);
   const [error, setError] = useState<string | null>(null);
   const [isLoading, setIsLoading] = useState(false);
   const [showFollowersModal, setShowFollowersModal] = useState(false);
   const [showFollowingModal, setShowFollowingModal] = useState(false);
   const [posts, setPosts] = useState<PostCardProps[]>([]);
   const [followerProfiles, setFollowerProfiles] = useState<Array<User>>([]);
   const [followingProfiles, setFollowingProfiles] = useState<Array<User>>([]);
   const [followerIds, setFollowerIds] = useState<Array<string>>([]);
   const [followingIds, setFollowingIds] = useState<Array<string>>([]);
   const navigate = useNavigate();
   const [isFollowedBy, setIsFollowedBy] = useState(false);
   const [criticalInfo, setCriticalInfo] = useState(false);
   const [isFollowingMutual, setIsFollowingMutual] = useState<{
      [key: string]: boolean;
   }>({});
   const [isFollowerMutual, setIsFollowerMutual] = useState<{
      [key: string]: boolean;
   }>({});

   useEffect(() => {
      async function checkFollowerMutual() {
         const followerMutualStatus: { [key: string]: boolean } = {};

         for (const user of followerProfiles) {
            const { data, error } = await supabase
               .from("follow")
               .select("*")
               .eq("follower_id", currentUserId)
               .eq("following_id", user.id);

            if (error) {
               console.error("Error checking follow status:", error);
               return;
            }

            if (user.id) {
               followerMutualStatus[user.id] = !!(data && data.length > 0);
            }
         }

         setIsFollowerMutual(followerMutualStatus);
      }

      checkFollowerMutual();
   }, [currentUserId, followerProfiles]);

   useEffect(() => {
      async function checkFollowingMutual() {
         const followingMutualStatus: { [key: string]: boolean } = {};

         for (const user of followingProfiles) {
            const { data, error } = await supabase
               .from("follow")
               .select("*")
               .eq("follower_id", currentUserId)
               .eq("following_id", user.id);

            if (error) {
               console.error("Error checking follow status:", error);
               return;
            }

            if (user.id) {
               followingMutualStatus[user.id] = !!(data && data.length > 0);
            }
         }

         setIsFollowingMutual(followingMutualStatus);
      }

      checkFollowingMutual();
   }, [currentUserId, followingProfiles]);

   const handleFollowUnfollowForMutualFollowing = async (
      userId: string,
      isFollowingMutual: boolean,
      username: string | null | undefined
   ) => {
      if (isFollowingMutual) {
         // If it's mutual, unfollow
         const { error } = await supabase
            .from("follow")
            .delete()
            .eq("follower_id", currentUserId)
            .eq("following_id", userId)
            .select();

         if (!error) {
            // Update the state for this specific user
            setIsFollowingMutual((prevState) => ({
               ...prevState,
               [userId]: false,
            }));
         }
      } else {
         // If it's not mutual, follow
         const { data, error } = await supabase
            .from("follow")
            .insert([
               {
                  follower_id: currentUserId,
                  following_id: userId,
                  follower_username: currentUser?.username,
                  following_username: username,
               },
            ])
            .select();

         if (data && !error) {
            // Update the state for this specific user
            setIsFollowingMutual((prevState) => ({
               ...prevState,
               [userId]: true,
            }));
         }
      }
   };

   const handleFollowUnfollowForMutualFollowers = async (
      userId: string,
      isFollowerMutual: boolean,
      username: string | null | undefined
   ) => {
      if (isFollowerMutual) {
         // If it's mutual, unfollow
         const { error } = await supabase
            .from("follow")
            .delete()
            .eq("follower_id", currentUserId)
            .eq("following_id", userId)
            .select();

         if (!error) {
            // Update the state for this specific user
            setIsFollowerMutual((prevState) => ({
               ...prevState,
               [userId]: false,
            }));
         }
      } else {
         // If it's not mutual, follow
         const { data, error } = await supabase
            .from("follow")
            .insert([
               {
                  follower_id: currentUserId,
                  following_id: userId,
                  follower_username: currentUser?.username,
                  following_username: username,
               },
            ])
            .select();

         if (data && !error) {
            // Update the state for this specific user
            setIsFollowerMutual((prevState) => ({
               ...prevState,
               [userId]: true,
            }));
         }
      }
   };

   useEffect(() => {
      async function fetchFollowerProfiles() {
         const { data: followerProfilesData, error: followerProfilesError } =
            await supabase.from("profiles").select("*").in("id", followerIds);

         if (!followerProfilesError) {
            setFollowerProfiles(followerProfilesData);
         }
      }

      if (paramsId || followerIds.length > 0) {
         fetchFollowerProfiles();
      }
   }, [paramsId, followerIds]);

   // useEffect to fetch following profiles
   useEffect(() => {
      async function fetchFollowingProfiles() {
         const { data: followingProfilesData, error: followingProfilesError } =
            await supabase.from("profiles").select("*").in("id", followingIds);

         if (!followingProfilesError) {
            setFollowingProfiles(followingProfilesData);
         }
      }

      if (paramsId || followingIds.length > 0) {
         fetchFollowingProfiles();
      }
   }, [paramsId, followingIds]);

   // check following
   useEffect(() => {
      async function checkFollowing() {
         const { data, error } = await supabase
            .from("follow")
            .select()
            .eq("follower_id", currentUserId)
            .eq("following_id", paramsId);

         if (data && data.length > 0) {
            setIsFollowing(true);
         } else {
            setIsFollowing(false);
         }
      }

      async function checkFollowedBy() {
         const { data, error } = await supabase
            .from("follow")
            .select()
            .eq("follower_id", paramsId)
            .eq("following_id", currentUserId);

         if (data && data.length > 0) {
            setIsFollowedBy(true);
         } else {
            setIsFollowedBy(false);
         }
      }

      if (currentUserId && paramsId) {
         checkFollowing();
         checkFollowedBy();
      }
   }, [currentUserId, paramsId]);

   // Function to handle the follow/unfollow action
   const handleFollow = async () => {
      if (isFollowing) {
         // If already following, unfollow
         const { error } = await supabase
            .from("follow")
            .delete()
            .eq("follower_id", currentUserId)
            .eq("following_id", paramsId);

         if (!error) {
            setIsFollowing(false);
            setFollowersCount((prevCount) => (prevCount as number) - 1);
         }
      } else {
         // If not following, follow
         const { error } = await supabase.from("follow").insert([
            {
               follower_id: currentUserId,
               following_id: paramsId,
               follower_username: currentUser?.username,
               following_username: username,
            },
         ]);

         if (!error) {
            setIsFollowing(true);
            setFollowersCount((prevCount) => (prevCount as number) + 1);
         }
      }
   };

   const goHome = () => {
      navigate("/");
   };
   // funtion to manage following count
   useEffect(() => {
      async function fetchCounts() {
         // Fetch the followers count
         const { data: followersData, error: followersError } = await supabase
            .from("follow")
            .select("follower_id")
            .eq("following_id", paramsId);

         if (!followersError) {
            setFollowersCount(followersData.length);
         }

         // Fetch the following count
         const { data: followingData, error: followingError } = await supabase
            .from("follow")
            .select("following_id")
            .eq("follower_id", paramsId);

         if (!followingError) {
            setFollowingCount(followingData.length);
         }
      }

      fetchCounts();
   }, [paramsId]);

   // New useEffect to fetch and set follower and following IDs
   useEffect(() => {
      async function fetchFollowerAndFollowingIds() {
         // Fetch follower IDs for the user specified by paramsId
         const { data: followerData, error: followerError } = await supabase
            .from("follow")
            .select("follower_id")
            .eq("following_id", paramsId);

         if (!followerError) {
            const followerIds = followerData.map((item) => item.follower_id);
            setFollowerIds(followerIds);
         }

         // Fetch following IDs for the user specified by paramsId
         const { data: followingData, error: followingError } = await supabase
            .from("follow")
            .select("following_id")
            .eq("follower_id", paramsId);

         if (!followingError) {
            const followingIds = followingData.map((item) => item.following_id);
            setFollowingIds(followingIds);
         }
      }

      // Fetch follower and following IDs when paramsId changes
      if (paramsId) {
         fetchFollowerAndFollowingIds();
      }
   }, [paramsId]);

   useEffect(() => {
      const fetchProfilePosts = async () => {
         setIsLoading(true);
         const id = user?.id;
         try {
            const { data: profilePosts, error } = await supabase
               .from("posts")
               .select("*")
               .range(0, 9)
               .eq("profile_id", id as string)
               .order("created_at", { ascending: false });
            if (profilePosts) {
               setPosts(profilePosts);
            } else if (error) {
               setError(error.message);
               console.error("Error fetching profile posts:", error.message);
            }
         } catch (error) {
            setError("An error occurred while fetching profile posts.");
            console.error("Unexpected error:", error);
         } finally {
            setIsLoading(false);
         }
      };

      if (id) {
         fetchProfilePosts();
      }
   }, [id]);

   useEffect(() => {
      if (user) {
         const name = user?.display_name;
         const image = user?.display_pic;
         const email = user?.email;
         const id = user?.id;
         const bio = user?.bio;
         const work = user?.work;
         const pronouns = user?.pronouns;
         const education = user?.education;
         setAvatar(image as string);
         setName(name);
         setBio(bio);
         setEmail(email);
         setWork(work);
         setPronouns(pronouns);
         setEducation(education);

         const fetchUserHashtags = async () => {
            let { data: user_hashtags, error } = await supabase
               .from("user_hashtags")
               .select("*")
               .eq("user_id", id);
            if (user_hashtags) {
               setUserHashtags(user_hashtags);
            }
         };
         fetchUserHashtags();
      }
   }, [user]);

   useEffect(() => {
      if (id) {
         const fetchData = async () => {
            try {
               // Fetch comment count
               const { data: commentCount, error: commentError } =
                  await supabase
                     .from("comments")
                     .select("count", { count: "exact" })
                     .eq("profile_id", id);

               if (commentCount) {
                  setCommentCount(commentCount[0].count);
               }
               if (commentError) {
                  console.error(
                     "Error fetching comment count:",
                     commentError.message
                  );
               }

               // Fetch post count
               const { data: postCount, error: postError } = await supabase
                  .from("posts")
                  .select("count", { count: "exact" })
                  .eq("profile_id", id);

               if (postCount) {
                  setPostCount(postCount[0].count);
               }
               if (postError) {
                  console.error(
                     "Error fetching post count:",
                     postError.message
                  );
               }

               // Fetch tags count
               const { data: tagsCount, error: tagsError } = await supabase
                  .from("user_hashtags")
                  .select("count", { count: "exact" })
                  .eq("user_id", id);

               if (tagsCount) {
                  setTagsCount(tagsCount[0].count);
               }
               if (tagsError) {
                  console.error(
                     "Error fetching tags count:",
                     tagsError.message
                  );
               }
            } catch (err) {
               console.error("Unexpected error:", err);
            }
         };

         fetchData();
      }
   }, [id]);

   const fetchUserData = async () => {
      const userData = await fetchSingleProfile(paramsId as string);
      if (userData !== null) {
         setUser(userData);
         setUsername(userData.username);
         setId(userData.id);
         setJoinedDate(userData.created_at);
         setLocation(userData.location);
         setWebsite(userData.website);
         setSkills(userData.skills_and_languages);
         setLearning(userData.currently_learning);
         setBuilding(userData.currently_building);
         setAvailability(userData.availability);
         setBannerPic(userData.banner_pic);
         setIsVerified(userData.isVerified?.valueOf());
         setShowEmail(userData.show_email?.valueOf());
      } else {
         // Handle the case where user data is not found
         console.error("User not found");
      }
   };

   useEffect(() => {
      fetchUserData();
   }, [paramsId]);

   const handleShowMore = () => {
      setShowMoreDetails(true);
   };

   const handleShowSettings = () => {
      setShowSettings((prev) => !prev);
   };

   const fetchMorePosts = async () => {
      setIsFetching(true);
      const from = Number(posts.length);
      try {
         const { data, error } = await supabase
            .from("posts")
            .select("*")
            .range(from, from + 10)
            .eq("profile_id", paramsId);

         if (data) {
            setPosts((prevPosts) => [...prevPosts, ...data]);
         } else if (error) {
            setError(error.message);
            console.error(
               "Error fetching user's profile posts:",
               error.message
            );
         }
      } catch (error) {
         setError("An error occurred while fetching user's profile posts.");
         console.error("Unexpected error:", error);
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
      <main className="">
         <div className="relative flex justify-center max-w-5xl mx-auto h-52">
            {bannerPic ? (
               <img
                  src={bannerPic as string}
                  alt="banner"
                  className="object-cover w-full"
               />
            ) : (
               <div className="w-full h-full duration-1000 animate-pulse bg-wh-300"></div>
            )}

            <div className="absolute w-full p-4 top-32 -bottom-32 ">
               {avatar ? (
                  <div className="w-32 h-32 overflow-hidden border-2 border-[#F5F5F5] rounded-full">
                     <img
                        src={avatar as string}
                        alt={`${name}'s profile image`}
                        className="object-cover w-full h-full"
                     />
                  </div>
               ) : (
                  <div className="overflow-hidden border-4 border-black rounded-full duration-2000 animate-pulse w-36 h-36">
                     {" "}
                     <img src="/png.png" alt="" />
                  </div>
               )}
            </div>
         </div>

         <div className="px-3 mt-32 mb-8">
            {currentUserId === paramsId && (
               <button
                  className="w-full px-5 py-2 mt-5 font-semibold text-black rounded-full md:hidden md:w-auto bg-accent-red "
                  onClick={handleShowSettings}>
                  Edit profile
               </button>
            )}
         </div>
         <div className="px-3 mt-12 mb-8">
            {currentUserId ? (
               currentUserId !== paramsId && (
                  <button
                     onClick={handleFollow}
                     className="w-full px-5 py-2 mt-5 font-semibold text-black rounded-full md:hidden md:w-auto bg-accent-red">
                     {isFollowing ? "Unfollow" : "Follow"}
                  </button>
               )
            ) : (
               <a href="/">
                  <button className="w-full px-5 py-2 mt-5 font-semibold text-black rounded-full md:hidden md:w-auto bg-accent-red">
                     Follow
                  </button>
               </a>
            )}
         </div>

         <div className="max-w-5xl px-3 py-8 mx-3 mb-4 rounded bg-background md:px-4 md:mx-4 lg:mx-auto text-foreground">
            <div className="items-center md:flex md:justify-between">
               <h1 className="flex items-center gap-1 text-2xl font-bold text-center md:text-left">
                  <span className="capitalize">{name}</span>
                  <span>
                     {isVerified && (
                        <img
                           src="/bluecheck-removebg-preview.png"
                           alt="checkmark"
                           height={16}
                           width={16}
                        />
                     )}
                  </span>
               </h1>

               {currentUserId === paramsId && (
                  <button
                     className="hidden w-full px-5 py-2 mt-5 font-semibold text-black rounded-full md:w-auto bg-accent-red md:block"
                     onClick={handleShowSettings}>
                     Edit profile
                  </button>
               )}

               {paramsId && currentUserId !== paramsId && (
                  <button
                     onClick={currentUserId ? handleFollow : goHome}
                     className="hidden w-full px-5 py-2 mt-5 font-semibold text-black rounded-full md:w-auto bg-accent-red md:block">
                     {isFollowing ? "Unfollow" : "Follow"}
                  </button>
               )}
            </div>
            {username ? (
               username && !username.startsWith("@") ? (
                  <div className="flex items-center gap-2 pt-2 pb-3">
                     <p className="opacity-75 "> @{username}</p>
                     {isFollowedBy && (
                        <p>
                           <Badge>Follows you</Badge>
                        </p>
                     )}
                  </div>
               ) : (
                  <div className="flex items-center gap-2 pt-2 pb-3">
                     <p className="opacity-75 "> {username}</p>
                     {isFollowedBy && (
                        <p>
                           <Badge>Follows you</Badge>
                        </p>
                     )}
                  </div>
               )
            ) : (
               <div className="w-3/4 h-6 mb-3 duration-300 animate-pulse bg-wh-300"></div>
            )}

            <div className="flex justify-between gap-3 py-2">
               <div className="flex items-center gap-3">
                  <p
                     className="font-bold cursor-pointer"
                     onClick={() => setShowFollowersModal(true)}>
                     {followersCount}{" "}
                     <span className="opacity-50">Followers</span>{" "}
                  </p>
                  <p
                     className="font-bold"
                     onClick={() => setShowFollowingModal(true)}>
                     {followingCount}{" "}
                     <span className="opacity-50 cursor-pointer">
                        Following
                     </span>{" "}
                  </p>
               </div>
               <div
                  className="relative"
                  onClick={() => setCriticalInfo((prev) => !prev)}>
                  <MoreVertical className="w-6 h-6 opacity-75 cursor-pointer hover:opacity-100" />
                  {/* {currentUserId === paramsId} */}
                  {criticalInfo && currentUserId === paramsId && (
                     <Button
                        variant="outline"
                        className="z-10 rounded absolute right-0 flex items-center p-4 w-max -top-[70px] bg-black text-white dark:bg-white dark:text-black">
                        Delete your account
                        <Trash2 className="w-6 h-6 ml-3 text-red-600" />
                     </Button>
                  )}
               </div>
               {/* followers */}
               {showFollowersModal && (
                  <div className="fixed inset-0 z-50 h-screen backdrop-blur">
                     <div className="fixed grid w-[95%] max-w-lg gap-4 p-6 duration-200 transform -translate-x-1/2 -translate-y-1/2 border rounded shadow-lg left-1/2 top-1/2 bg-background animate-in fade-in-0">
                        <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full">
                           <div
                              onClick={() => setShowFollowersModal(false)}
                              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                              <X className="w-4 h-4 cursor-pointer" />
                              <span className="sr-only">Close</span>
                           </div>
                           <div className="text-left">
                              <div className="text-lg">{name}</div>
                              <p className="text-sm opacity-50">{username}</p>
                              <div className="pb-2">Followers</div>
                              <div className="w-full px-6 border-b border-black/10 dark:border-white/10" />
                           </div>
                           <div className="gap-2 py-4 overflow-auto" key={id}>
                              {followerProfiles.length ? (
                                 <div
                                    key={id}
                                    className="flex flex-col max-h-[500px] gap-5"
                                    style={{ overflowY: "auto" }}>
                                    {followerProfiles?.map((follower) => {
                                       const {
                                          display_pic,
                                          display_name,
                                          username,
                                          id,
                                       } = follower;

                                       return (
                                          <div
                                             className="flex items-center justify-between"
                                             key={id}>
                                             <Link
                                                to={`/account/${id}`}
                                                onClick={() =>
                                                   setShowFollowersModal(false)
                                                }>
                                                <div className="flex items-center rounded">
                                                   <div>
                                                      {display_pic ? (
                                                         <img
                                                            src={
                                                               display_pic as string
                                                            }
                                                            alt={`${display_name}'s display image`}
                                                            className="rounded-full w-[50px] h-[50px] mr-2"
                                                         />
                                                      ) : (
                                                         <div className="rounded-full w-[50px] h-[50px] mr-2 uppercase font-bold text-lg border-foreground">
                                                            {display_name?.substring(
                                                               0,
                                                               1
                                                            )}
                                                         </div>
                                                      )}
                                                   </div>
                                                   <div className="flex flex-col pl-5 transition hover-bg-foreground/5">
                                                      <h1 className="text-lg">
                                                         {display_name}
                                                      </h1>
                                                      <p className="text-sm opacity-50">
                                                         {username}
                                                      </p>
                                                   </div>
                                                </div>
                                             </Link>
                                             <div>
                                                {currentUserId !== id && (
                                                   <button
                                                      className="w-full px-3 py-2 text-xs font-semibold text-black rounded-full md:px-5 md:w-auto bg-accent-red hover-bg-wh-500"
                                                      onClick={() =>
                                                         handleFollowUnfollowForMutualFollowers(
                                                            id as string,
                                                            isFollowerMutual[
                                                               id as string
                                                            ] || false, // Pass isFollowerMutual for this specific user
                                                            username
                                                         )
                                                      }>
                                                      {isFollowerMutual[
                                                         id as string
                                                      ]
                                                         ? "Unfollow"
                                                         : "Follow"}
                                                   </button>
                                                )}
                                             </div>
                                          </div>
                                       );
                                    })}
                                 </div>
                              ) : (
                                 <div className="text-lg animate-pulse">
                                    Fetching....... please wait
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {/* following */}
               {showFollowingModal && (
                  <div className="fixed inset-0 z-50 h-screen backdrop-blur">
                     <div className="fixed grid w-[95%] max-w-lg gap-4 p-6 duration-200 transform -translate-x-1/2 -translate-y-1/2 border rounded-sm shadow-lg left-1/2 top-1/2 bg-background animate-in fade-in-0">
                        <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full">
                           <div
                              onClick={() => setShowFollowingModal(false)}
                              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                              <X className="w-4 h-4 cursor-pointer" />
                              <span className="sr-only">Close</span>
                           </div>
                           <div className="text-left">
                              <div className="text-xl">{name}</div>
                              <p className="text-xs opacity-50">{username}</p>
                              <div className="pb-2 text-sm">Following</div>
                              <div className="w-full px-6 border-b border-black/10 dark:border-white/10" />
                           </div>
                           <div className="gap-2 py-4 overflow-auto">
                              {followingProfiles.length > 0 ? (
                                 <div
                                    key={id}
                                    className="flex flex-col max-h-[500px] gap-5"
                                    style={{ overflowY: "auto" }}>
                                    {followingProfiles?.map((followingUser) => {
                                       const {
                                          display_pic,
                                          display_name,
                                          username,
                                          id,
                                       } = followingUser;

                                       return (
                                          <div
                                             className="flex items-center justify-between"
                                             key={id}>
                                             <Link
                                                to={`/account/${id}`}
                                                onClick={() =>
                                                   setShowFollowingModal(false)
                                                }>
                                                <div
                                                   className="flex items-center rounded"
                                                   key={id}>
                                                   <div>
                                                      <img
                                                         src={
                                                            display_pic as string
                                                         }
                                                         alt={`${display_name}'s display image`}
                                                         className="rounded-full w-[50px] h-[50px] mr-2"
                                                      />
                                                   </div>
                                                   <div className="flex flex-col pl-5 transition hover-bg-foreground/5">
                                                      <h1 className="text-lg">
                                                         {display_name}
                                                      </h1>
                                                      <p className="text-sm opacity-50">
                                                         {username}
                                                      </p>
                                                   </div>
                                                </div>
                                             </Link>
                                             <div>
                                                {currentUserId !== id && (
                                                   <button
                                                      className="w-full px-3 py-2 text-xs font-semibold text-black rounded-full md:px-5 md:w-auto bg-accent-red hover-bg-wh-500"
                                                      onClick={() =>
                                                         handleFollowUnfollowForMutualFollowing(
                                                            id as string,
                                                            isFollowingMutual[
                                                               id as string
                                                            ] || false, // Pass isFollowingMutual for this specific user
                                                            username
                                                         )
                                                      }>
                                                      {isFollowingMutual[
                                                         id as string
                                                      ]
                                                         ? "Unfollow"
                                                         : "Follow"}
                                                   </button>
                                                )}
                                             </div>
                                          </div>
                                       );
                                    })}
                                 </div>
                              ) : (
                                 <div>Not following anybody at the moment</div>
                              )}
                           </div>
                        </div>
                     </div>
                  </div>
               )}
            </div>

            <div className="w-full px-6 border-b border-black/10 dark:border-white/10" />
            {bio ? (
               <p className="pt-6 pb-12 text-lg leading-8 md:text-center">
                  {bio}
               </p>
            ) : (
               <div className="w-full h-20 mb-6 duration-300 animate-pulse bg-wh-300"></div>
            )}

            <div className="w-full px-6 border-b border-black/10 dark:border-white/10" />

            <div className="flex flex-col gap-8 py-8 md:flex-row md:flex-wrap md:justify-center">
               {location ? (
                  <div className="flex gap-4">
                     <MapPin className="w-6 h-6 opacity-75" />
                     <p>{location}</p>
                  </div>
               ) : (
                  <div className="flex gap-4">
                     <MapPin className="w-6 h-6 opacity-75" />
                     <p className="w-1/4 h-6 mb-3 duration-300 animate-pulse bg-wh-300"></p>
                  </div>
               )}
               <div className="flex gap-4">
                  <CalendarPlus className="w-6 h-6 opacity-75" />
                  {joinedDate ? (
                     <p>
                        <div className="flex items-center gap-2">
                           <p>
                              Joined on{" "}
                              {dateFormatter.format(new Date(joinedDate))}
                           </p>
                           <p
                              suppressHydrationWarning
                              className="text-xs opacity-75">
                              {" "}
                              (
                              {dayjs().diff(joinedDate, "seconds", true) < 30
                                 ? "just now"
                                 : dayjs(joinedDate).fromNow()}
                              )
                           </p>
                        </div>
                     </p>
                  ) : (
                     <div className="w-1/4 h-6 mb-3 duration-300 animate-pulse bg-wh-300"></div>
                  )}
               </div>

               {showEmail ? (
                  email ? (
                     <Link to={`mailto:${email}`} className="flex gap-4">
                        <Mail className="w-6 h-6 opacity-75" />
                        <p>{email}</p>
                     </Link>
                  ) : (
                     <div className="flex gap-4">
                        <Mail className="w-6 h-6 opacity-75" />
                        <div className="w-1/4 h-6 mb-3 duration-300 animate-pulse bg-wh-300" />
                     </div>
                  )
               ) : null}
               <div className="flex gap-4">
                  <ExternalLink className="w-6 h-6 opacity-75" />
                  {website ? (
                     <a href={website as string} target="_blank">
                        {website}
                     </a>
                  ) : (
                     <div className="w-1/4 h-6 mb-3 duration-300 animate-pulse bg-wh-300"></div>
                  )}
               </div>
            </div>
            <div className="w-full px-6 border-b border-black/10 dark:border-white/10" />
            <div className="flex flex-col gap-8 py-8 md:flex-row md:flex-wrap md:justify-center">
               <div className="flex gap-4">
                  <User2 className="w-6 h-6 opacity-75" />
                  {pronouns ? (
                     <p>{pronouns}</p>
                  ) : (
                     <div className="w-1/4 h-6 mb-3 duration-300 animate-pulse bg-wh-300"></div>
                  )}
               </div>
               <div className="flex gap-4">
                  <Briefcase className="w-6 h-6 opacity-75" />
                  {work ? (
                     <p>{work}</p>
                  ) : (
                     <div className="w-1/4 h-6 mb-3 duration-300 animate-pulse bg-wh-300"></div>
                  )}
               </div>
               <div className="flex gap-4">
                  <GraduationCap className="w-6 h-6 opacity-75" />
                  {education ? (
                     <p>{education}</p>
                  ) : (
                     <div className="w-1/4 h-6 mb-3 duration-300 animate-pulse bg-wh-300"></div>
                  )}
               </div>
            </div>

            {/* mobile only */}
            <div
               className={`px-3 pt-8 mx-2 mb-4 transition-all duration-700 ease-in rounded bg-background text-foreground opacity-0 h-0 md:hidden ${
                  showMoreDetails && "opacity-100 h-auto"
               }`}>
               <h3 className="font-bold">Skills/Languages: </h3>
               {skills ? (
                  <div className="py-4 my-3 text-sm italic border-y border-black/10 dark:border-white/10">
                     {skills}
                  </div>
               ) : (
                  <div className="w-3/4 h-6 mb-3 duration-300 animate-pulse bg-wh-300"></div>
               )}

               <h3 className="font-bold">Currently learning: </h3>
               {learning ? (
                  <div className="py-4 my-3 text-sm italic border-y border-black/10 dark:border-white/10">
                     {learning}
                  </div>
               ) : (
                  <div className="w-3/4 h-6 mb-3 duration-300 animate-pulse bg-wh-300"></div>
               )}

               <h3 className="font-bold">Currently building</h3>
               {building ? (
                  <div className="py-4 my-3 text-sm italic border-y border-black/1 dark:border-white/10">
                     {building}
                  </div>
               ) : (
                  <div className="w-3/4 h-6 mb-3 duration-300 animate-pulse bg-wh-300"></div>
               )}

               <h3 className="font-bold">Available for: </h3>
               {availability ? (
                  <div className="py-4 my-3 text-sm italic border-y border-black/10 dark:border-white/10">
                     {availability}
                  </div>
               ) : (
                  <div className="w-3/4 h-6 mb-3 duration-300 animate-pulse bg-wh-300"></div>
               )}

               <div className="flex flex-col pt-3 gap-7">
                  <p className="flex items-center gap-3">
                     <ScrollText className="opacity-70" />
                     <p>
                        {postCount
                           ? `${postCount} posts published`
                           : "Loading..."}
                     </p>
                  </p>
                  <p className="flex items-center gap-3">
                     <MessageSquare className="opacity-70" />
                     <p>
                        {commentCount
                           ? `${commentCount} comment(s) written`
                           : "Loading..."}
                     </p>
                  </p>
                  <p className="flex items-center gap-3">
                     <Hash className="opacity-70" />
                     <p>
                        {tagsCount
                           ? `${tagsCount} tags followed`
                           : "Loading..."}
                     </p>
                  </p>
               </div>
            </div>

            <div onClick={handleShowMore}>
               <Button
                  variant="outline"
                  className={`w-full text-base md:hidden ${
                     showMoreDetails && "hidden"
                  } `}>
                  More info about {username}
               </Button>
            </div>
            {/* end here  */}
         </div>
         <div className="relative max-w-5xl grid-cols-3 gap-4 py-6 pb-32 md:grid md:mx-4 lg:mx-auto ">
            <div className="col-span-1 px-1 mx-2 mb-4 md:mx-0 text-foreground md:sticky md:top-[100px] hidden md:block ml-3">
               <div className="flex flex-col gap-4 p-3 mb-4 rounded bg-background">
                  <h3 className="font-bold">Skills/Languages: </h3>
                  {skills ? (
                     <div className="py-4 my-3 text-sm italic border-y border-black/10 dark:border-white/10">
                        {skills}
                     </div>
                  ) : (
                     <div className="w-3/4 h-6 mb-3 duration-300 animate-pulse bg-wh-300"></div>
                  )}
               </div>
               <div className="flex flex-col gap-4 p-3 mb-4 rounded bg-background">
                  <h3 className="font-bold">Currently learning: </h3>
                  {learning ? (
                     <div className="py-4 my-3 text-sm italic border-y border-black/10 dark:border-white/10">
                        {learning}
                     </div>
                  ) : (
                     <div className="w-3/4 h-6 mb-3 duration-300 animate-pulse bg-wh-300"></div>
                  )}
               </div>
               <div className="flex flex-col gap-4 p-3 mb-4 rounded bg-background">
                  <h3 className="font-bold">Currently building</h3>
                  {building ? (
                     <div className="py-4 my-3 text-sm italic border-y border-black/10 dark:border-white/10">
                        {building}
                     </div>
                  ) : (
                     <div className="w-3/4 h-6 mb-3 duration-300 animate-pulse bg-wh-300"></div>
                  )}
               </div>
               <div className="flex flex-col gap-4 p-3 mb-4 rounded bg-background">
                  <h3 className="font-bold">Available for: </h3>
                  {availability ? (
                     <div className="py-4 my-3 text-sm italic border-y border-black/10 dark:border-white/10">
                        {availability}
                     </div>
                  ) : (
                     <div className="w-3/4 h-6 mb-3 duration-300 animate-pulse bg-wh-300"></div>
                  )}
               </div>

               <div className="flex flex-col p-3 pt-3 mb-4 rounded gap-7 bg-background">
                  <p className="flex items-center gap-3">
                     <ScrollText className="opacity-70" />
                     <p>
                        {postCount
                           ? `${postCount} post(s) published`
                           : "Not available"}
                     </p>
                  </p>
                  <p className="flex items-center gap-3">
                     <MessageSquare className="opacity-70" />
                     <p>
                        {commentCount
                           ? `${commentCount} comment(s) written`
                           : "Not available"}
                     </p>
                  </p>
                  <p className="flex items-center gap-3">
                     <Hash className="opacity-70" />
                     <p>
                        {tagsCount
                           ? `${tagsCount} hashtags followed`
                           : "Not available"}
                     </p>
                  </p>
               </div>
            </div>
            <div className="col-span-2 px-3 pt-10 pb-24 mr-3 rounded bg-background">
               {isLoading && (
                  <div className="flex flex-col w-full gap-5">
                     {Array.from({ length: 5 }).map((_, index) => (
                        <div className="w-full mb-4" key={index}>
                           <PostCardSkeleton />
                        </div>
                     ))}
                  </div>
               )}

               {!isLoading && (
                  <div className="flex flex-col w-full gap-5">
                     {posts && posts.length > 0 ? (
                        // Render posts if there are any
                        posts.map((post, index) => {
                           const readTime = calculateReadTime(post?.content);
                           return (
                              <MinimalPostCard
                                 key={post.id}
                                 author={post.author}
                                 id={post.id}
                                 image={post.image}
                                 snippet={post.snippet}
                                 title={post.title}
                                 author_image={post.author_image}
                                 bookmark_count={post.bookmark_count}
                                 created_at={post.created_at}
                                 likes_count={post.likes_count}
                                 comment_count={post.comment_count}
                                 profile_id={post.profile_id}
                                 category_Ids={post.category_Ids}
                                 readTime={readTime}
                                 content={post.content}
                              />
                           );
                        })
                     ) : (
                        // Render the "No posts" div when there are no posts
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
                              {name} has no Post yet
                           </div>
                        </div>
                     )}
                  </div>
               )}
               {isLoading && (
                  <div className="flex flex-col w-full gap-5">
                     {skeletonElements}
                  </div>
               )}
            </div>
         </div>
         {showSettings && (
            <div className="fixed inset-0 z-40 flex justify-center px-3 pt-20 overflow-auto bg-black/95">
               <Settings
                  handleShowSettings={handleShowSettings}
                  fetchUserData={fetchUserData}
                  prop={{
                     id,
                     bio,
                     name,
                     username,
                     location,
                     email,
                     website,
                     skills,
                     learning,
                     building,
                     availability,
                     pronouns,
                     work,
                     education,
                     avatar,
                     bannerPic,
                     showEmail,
                  }}
               />
            </div>
         )}
      </main>
   );
};
export default Account;
