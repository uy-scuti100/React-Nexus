import { motion } from "framer-motion";
import PostCard from "./PostCard";
import PostCardSkeleton from "../../components/myComponents/skeletons/PostCardSkeleton";
import { Post } from "../../../types";

export default function HomeCard({
   blogPosts,
   isLoading,
   totalPosts,
}: {
   blogPosts: Post[] | null | undefined;
   isLoading: boolean;
   totalPosts: number | null;
}) {
   // Create an array of skeleton elements based on the expected number of posts
   const skeletonElements = Array.from(
      { length: totalPosts || 5 },
      (_, index) => <PostCardSkeleton key={index} />
   );

   return (
      <>
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
               } = post;

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
                     />
                  </motion.div>
               );
            })}
            {isLoading && (
               <div className="flex flex-col w-full">{skeletonElements}</div>
            )}
         </div>
      </>
   );
}
