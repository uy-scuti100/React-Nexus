import { Post } from "../../../types";
import PostCardSkeleton from "../../components/myComponents/skeletons/PostCardSkeleton";
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
            } = post;

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
      </div>
   );
};

export default CategoryCard;
