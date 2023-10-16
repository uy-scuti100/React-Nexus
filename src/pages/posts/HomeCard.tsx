import { motion } from "framer-motion";
import PostCard from "./PostCard";
import PostCardSkeleton from "../../components/myComponents/skeletons/PostCardSkeleton";
import { Post } from "../../../types";
import { calculateReadTime } from "../../lib/readTime";
import { Link, useParams } from "react-router-dom";

export default function HomeCard({
   blogPosts,
   isLoading,
   totalPosts,
}: {
   blogPosts: Post[] | null | undefined;
   isLoading: boolean;
   totalPosts: number | null;
}) {
   const { id } = useParams();
   const paramsId = id;
   const pathname = window.location.pathname;
   const path = pathname.split("/")[1];

   const skeletonElements = Array.from(
      { length: totalPosts || 5 },
      (_, index) => <PostCardSkeleton key={index} />
   );

   return (
      <main>
         <div className="flex items-center gap-6 py-6">
            <Link to={`/explore-topics`}>
               <svg
                  width="19"
                  height="19"
                  // @ts-ignore
                  class="hi hj hk"
                  className="cursor-pointer">
                  <path
                     d="M9 9H3v1h6v6h1v-6h6V9h-6V3H9v6z"
                     fill="currentcolor"></path>
               </svg>
            </Link>
            <button
               className={` ${
                  path === "posts" && "bg-accent-orange"
               } px-2 py-2 transition-transform duration-300 hover:scale-105 w-max whitespace-nowrap text-black text-sm`}>
               {" "}
               Recommended
            </button>
         </div>
         <div className="flex flex-col w-full">
            {blogPosts?.map((post: Post, index: number) => {
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
                  <motion.div
                     key={post.id}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{
                        duration: 0,
                        ease: [0.25, 0.25, 0, 1],
                        delay: index / 15,
                     }}>
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
                  </motion.div>
               );
            })}
            {isLoading && (
               <div className="flex flex-col w-full">{skeletonElements}</div>
            )}
         </div>
      </main>
   );
}
