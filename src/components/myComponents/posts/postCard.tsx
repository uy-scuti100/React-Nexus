import { Link } from "react-router-dom";
import { PostsProp } from "./posts";
import { BadgeCheck } from "lucide-react";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
   dateStyle: "medium",
});
const PostCard: React.FC<PostsProp> = ({
   author,
   user_img,
   title,
   date,
}: PostsProp) => {
   return (
      <div className="px-4 py-4 border border-b rounded-xl w-fit md:min-w-[320px] min-w-[300px]">
         <div className="flex items-center gap-3">
            <Link to="/">
               <img
                  src={user_img}
                  height={20}
                  width={20}
                  alt="author-img"
                  className="object-cover w-5 h-5 "
               />
            </Link>
            <div className="text-sm logo">{author}</div>
         </div>
         <h1 className="py-3 text-lg font-bold">{title}</h1>
         <p suppressHydrationWarning className="text-xs text-foreground/50">
            {dateFormatter.format(Date.parse(date))}
         </p>{" "}
      </div>
   );
};

export default PostCard;
