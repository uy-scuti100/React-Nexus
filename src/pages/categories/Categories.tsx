import { Post } from "../../../types";
import PostCard from "../posts/PostCard";

const CategoryCard = ({
   categoryPosts,
}: {
   categoryPosts: Post[] | null | undefined;
}) => {
   return (
      <div className="flex flex-col w-full gap-5">
         {categoryPosts?.map((post: Post, i: number) => {
            const {
               author,
               id,
               image,
               snippet,
               author_verification,
               title,
               created_at,
               profile_id,
               category_name,
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
                  author_verification={author_verification}
                  title={title}
                  category_name={category_name}
                  author_image={author_image}
                  bookmark_count={bookmark_count}
                  created_at={created_at}
                  likes_count={likes_count}
                  comment_count={comment_count}
                  profile_id={profile_id}
               />
            );
         })}
      </div>
   );
};

export default CategoryCard;
