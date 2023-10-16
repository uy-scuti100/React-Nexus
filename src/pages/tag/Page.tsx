import { useParams } from "react-router-dom";
import Navbar from "../../components/myComponents/global/Navbar";
import CategorySlider from "../../components/myComponents/global/categorySlider";
import supabase from "../../lib/supabaseClient";
import { useEffect, useState } from "react";
import { unknown } from "zod";
import { Post } from "../../../types";
import { calculateReadTime } from "../../lib/readTime";
import PostCard from "../posts/PostCard";
import PostCardSkeleton from "../../components/myComponents/skeletons/PostCardSkeleton";

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
export default function Page() {
   const { id } = useParams();
   const [subtopics, setSubtopics] = useState<TopicProp[] | null>([]);
   const [loading, setLoading] = useState(false);
   const [fetching, setLoasetFetchingding] = useState(false);
   const [topic, setTopic] = useState<Topic>(initialTopic);
   const [posts, setPosts] = useState<Post[] | null>([]);
   useEffect(() => {
      const fetchSubtopics = async () => {
         setLoading(true);
         try {
            const { data: subtopics, error } = await supabase
               .from("subtopics")
               .select("*")
               .eq("parent_topic_id", id);

            if (subtopics && !error) {
               const formattedSubtopics: TopicProp[] = subtopics.map(
                  (subtopic: any) => ({
                     id: subtopic.id,
                     name: subtopic.name,
                     created_at: subtopic.created_at,
                  })
               );
               setSubtopics(formattedSubtopics);
            } else {
               return null;
            }
         } catch (error) {
            console.error("Error fetching subtopics:", error);
            return null;
         } finally {
            setLoading(false);
         }
      };

      fetchSubtopics();
   }, [id]);

   useEffect(() => {
      const fetchTopic = async () => {
         const { data, error } = await supabase
            .from("topics")
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

   const skeletonElements = Array.from({ length: 5 }, (_, index) => (
      <PostCardSkeleton key={index} />
   ));

   return (
      <main>
         <div>
            <Navbar />
         </div>
         <div className="pt-14">
            <CategorySlider channel="subtopic" prop={subtopics} />
         </div>
         <div className="text-center pt-10 mt-3 mb-[5px] text-[2rem] md:text-[2.625rem] leading-10 break-words box-border font-bold capitalize lead">
            {topic.name}
         </div>
         <p className="mt-5 text-center">{topic.description}</p>
         <div className="flex items-center justify-center gap-2 pt-4 text-sm font-normal">
            <p>Topic</p> <p> 2.3M Followers</p> <p>953K Stories</p>
         </div>
         <div className="flex items-center justify-center pt-4">
            <button className="px-4 py-2 text-black border rounded-full border-foreground/10 bg-accent-red">
               Follow
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
            {loading && (
               <div className="flex flex-col w-full px-6">
                  {skeletonElements}
               </div>
            )}

            {posts === null ||
               (Array.isArray(posts) && posts.length === 0 && (
                  <div className="px-6">
                     <div className="flex items-center justify-center mb-10 bg-white">
                        <div className="relative w-full md:w-[500px] h-[500px]">
                           <img
                              src="/No data-amico.svg"
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
         </section>
      </main>
   );
}
