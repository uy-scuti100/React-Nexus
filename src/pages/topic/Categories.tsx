import { Post } from "../../../types";
import PostCardSkeleton from "../../components/myComponents/skeletons/PostCardSkeleton";
import { calculateReadTime } from "../../lib/readTime";
import PostCard from "../posts/PostCard";

const CategoryCard = ({
   categoryPosts,
   isLoading,
}: {
   categoryPosts: Post[] | null | undefined;
   isLoading: boolean;
}) => {
   const skeletonElements = Array.from({ length: 5 }, (_, index) => (
      <PostCardSkeleton key={index} />
   ));
   return (
      <div className="flex flex-col w-full gap-5">
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

         {isLoading && (
            <div className="flex flex-col w-full gap-5">{skeletonElements}</div>
         )}

         {categoryPosts === null ||
            (Array.isArray(categoryPosts) && categoryPosts.length === 0 && (
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
                     No posts in this Category
                  </div>
               </div>
            ))}
      </div>
   );
};

export default CategoryCard;
