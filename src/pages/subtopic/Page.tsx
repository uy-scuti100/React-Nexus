import { useEffect, useState } from "react";
import supabase from "../../lib/supabaseClient";
import { useParams } from "react-router-dom";
import Navbar from "../../components/myComponents/global/Navbar";
import CategorySlider from "../../components/myComponents/global/categorySlider";
import PostCard from "../posts/PostCard";
import { calculateReadTime } from "../../lib/readTime";
import { Post } from "../../../types";
import PostCardSkeleton from "../../components/myComponents/skeletons/PostCardSkeleton";
import toast from "react-hot-toast";
import { useFetchUser } from "../../hooks/useFetchUser";
export interface TopicProp {
   name: string | null;
   id: string | null;
   created_at: string | null;
}

interface Topic {
   id: string;
   name: string;
   description: string;
   type: string;
   created_at: string;
}
const initialTopic = {
   id: "",
   name: "",
   description: "",
   type: "",
   created_at: "",
};
const Page = () => {
   const { id } = useParams();
   const [subSubtopics, setSusSubtopics] = useState<TopicProp[] | null>([]);
   const [loading, setLoading] = useState(false);
   const [fetching, setLoasetFetchingding] = useState(false);
   const [topic, setTopic] = useState<Topic>(initialTopic);
   const [posts, setPosts] = useState<Post[] | null>([]);
   const { user } = useFetchUser();
   const userId = user?.id;
   const [isFollowing, setIsFollowing] = useState(false);
   const [followersCount, setFollowersCount] = useState<number | null>(null);
   const [postCount, setPostCount] = useState<number | null | undefined>(null);

   useEffect(() => {
      const fetchSubSubtopics = async () => {
         try {
            const { data: subsubtopics, error } = await supabase
               .from("subsubtopics")
               .select("*")
               .eq("parent_subtopic_id", id);

            if (subsubtopics && !error) {
               const formattedSubSubtopics: TopicProp[] = subsubtopics.map(
                  (subsubtopic: any) => ({
                     id: subsubtopic.id,
                     name: subsubtopic.name,
                     created_at: subsubtopic.created_at,
                  })
               );
               setSusSubtopics(formattedSubSubtopics);
            } else {
               return null;
            }
         } catch (error) {
            console.error("Error fetching subtopics:", error);
            return null;
         }
      };

      fetchSubSubtopics();
   }, [id]);

   useEffect(() => {
      const fetchTopic = async () => {
         const { data, error } = await supabase
            .from("subtopics")
            .select("*")
            .eq("id", id);

         if (data && !error) {
            if (data.length > 0) {
               setTopic(data[0]);
            } else {
               console.error("No topic found for the given ID.");
            }
         }
      };

      fetchTopic();
   }, [id]);
   useEffect(() => {
      const fetchTopicPosts = async () => {
         try {
            const { data, error } = await supabase
               .from("posts")
               .select("*")
               .contains("category_Ids", [id]);

            if (error) {
               console.error("Error fetching posts:", error);
               return;
            }

            if (data && data.length > 0) {
               setPosts(data);
            } else {
               console.error("No post found for the given ID.");
            }
         } catch (e) {
            console.error("An unexpected error occurred:", e);
         }
      };

      fetchTopicPosts();
   }, [id]);

   // Check if the user is already following the topic
   useEffect(() => {
      async function checkIsFollowing() {
         const { data, error } = await supabase
            .from("topicfellowship")
            .select()
            .eq("user_id", userId)
            .eq("subtopic_id", id)
            .single();

         if (data) {
            setIsFollowing(true);
         } else {
            setIsFollowing(false);
         }
      }

      checkIsFollowing();
   }, [userId, id]);

   async function followTopic(type: string) {
      try {
         if (isFollowing) {
            // If the user is already following, unfollow the topic
            const { data, error } = await supabase
               .from("topicfellowship")
               .delete()
               .eq("user_id", userId)
               .eq("subtopic_id", id);

            if (!error) {
               // Record successfully deleted
               setIsFollowing(false);
               setFollowersCount((prevCount) => (prevCount as number) - 1);
               toast.success("Unfollowed");
            } else {
               // Handle errors here, e.g., display an error message
               toast.error("Failed to unfollow the topic.");
               console.log(error);
            }
         } else {
            // If the user is not following, follow the topic
            const { data, error } = await supabase
               .from("topicfellowship")
               .insert([
                  {
                     user_id: userId,
                     subtopic_id: id,
                     type,
                     topicname: topic.name,
                  },
               ])
               .select();

            if (data) {
               setIsFollowing(true);
               setFollowersCount((prevCount) => (prevCount as number) + 1);
               toast.success(`Following ${topic.name}.`);
            } else {
               toast.error("Failed to follow the topic.");
               console.log(error);
            }
         }
      } catch (error) {
         console.error("An error occurred:", error);
      }
   }
   const skeletonElements = Array.from({ length: 5 }, (_, index) => (
      <PostCardSkeleton key={index} />
   ));

   useEffect(() => {
      const fetchFollowCount = async () => {
         const { data, error } = await supabase
            .from("topicfellowship")
            .select("user_id")
            .eq("subtopic_id", id);

         if (!error) {
            setFollowersCount(data.length);
         }

         const { data: postCount, error: postError } = await supabase
            .from("posts")
            .select("count", { count: "exact" })
            .contains("category_Ids", [id]);

         if (postCount) {
            setPostCount(postCount[0].count);
         }
      };
      fetchFollowCount();
   }, [id]);
   return (
      <main>
         <div>
            <Navbar />
         </div>
         <div className="pt-14">
            <CategorySlider channel="subsubtopic" prop={subSubtopics} />
         </div>
         <div className="text-center pt-10 mt-3 mb-[5px] text-[2rem] md:text-[2.625rem] leading-10 break-words box-border font-bold capitalize lead">
            {topic.name}
         </div>
         <p className="mx-2 mt-5 text-center">{topic.description}</p>
         <div className="flex items-center justify-center gap-8 pt-4 text-sm font-normal">
            <p>
               {followersCount}{" "}
               <span className="text-[#1A8917] dark:text-accent-red">
                  Followers
               </span>
            </p>{" "}
            <p>
               {postCount}{" "}
               <span className="text-[#1A8917] dark:text-accent-red">
                  Stories{" "}
               </span>
            </p>
         </div>
         <div className="flex items-center justify-center pt-4">
            <button
               className="px-4 py-2 text-black border rounded-full border-foreground/10 bg-accent-red"
               onClick={() => followTopic("Subtopic")}>
               {isFollowing ? "Unfollow" : "Follow"}
            </button>
         </div>
         <div className="px-6 mt-20 mb-10 ">
            <p className="font-bold">Recommended Posts</p>
         </div>
         <section className="grid-cols-3 gap-10 px-12 md:grid">
            {posts?.map((post: Post, index: number) => {
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
                  content={content}
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
                  />
               );
            })}
         </section>
         {loading && (
            <div className="flex flex-col w-full px-6">{skeletonElements}</div>
         )}

         {posts === null ||
            (Array.isArray(posts) && posts.length === 0 && (
               <div className="px-6">
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
                     No Articles from this Topic
                  </div>
               </div>
            ))}
      </main>
   );
};

export default Page;
