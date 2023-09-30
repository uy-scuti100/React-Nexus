import { LargePostsProp } from "./posts";
import { BadgeCheck, BookmarkPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const LargePostCard: React.FC<LargePostsProp> = ({
   author,
   user_img,
   title,
   date,
   verified,
   post_image,
}: LargePostsProp) => {
   const [divStyles, setDivStyles] = useState({
      height: "100px",
      width: "200px",
      minWidth: "100px",
      marginLeft: "70px",
   });
   useEffect(() => {
      const handleResize = () => {
         if (window.innerWidth <= 768) {
            setDivStyles({
               height: "100px",
               width: "100px",
               minWidth: "100px",
               marginLeft: "20px",
            });
         } else {
            setDivStyles({
               height: "100px",
               width: "200px",
               minWidth: "100px",
               marginLeft: "70px",
            });
         }
      };

      window.addEventListener("resize", handleResize);

      handleResize();

      // Clean up the event listener when the component unmounts
      return () => {
         window.removeEventListener("resize", handleResize);
      };
   }, []);

   return (
      <Link to="/" className="flex items-center justify-between">
         <div className="w-full py-3">
            <div className="flex items-center gap-3">
               <img
                  src={user_img}
                  height={20}
                  width={20}
                  alt="author-img"
                  className="object-cover w-5 h-5"
               />
               <div className="text-sm logo">{author}</div>
               {verified ? <BadgeCheck className="w-4 h-4" /> : ""}
            </div>
            <h1 className="text-lg font-bold">{title}</h1>

            <div className="flex items-center justify-between">
               <p className="text-xs text-foreground/50">{date}</p>
               <BookmarkPlus />
            </div>
         </div>
         {/* post image */}
         <div style={divStyles}>
            <img
               src={post_image}
               alt="post-img"
               width={100}
               height={200}
               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
               style={{ objectFit: "cover", height: "100%", width: "100%" }}
            />
         </div>
      </Link>
   );
};

export default LargePostCard;
