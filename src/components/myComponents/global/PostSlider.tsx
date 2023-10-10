import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

import { useEffect, useState } from "react";
import supabase from "../../../lib/supabaseClient";
import { Badge } from "../../ui/badge";
import { useNavigate } from "react-router-dom";

interface PostCardProp {
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
}

type Prop = {
   id: string | null | undefined;
   userId: string | null | undefined;
   name: string | null | undefined;
};

const PostSlider = ({ prop }: { prop: Prop }) => {
   const [posts, setPosts] = useState<Array<PostCardProp>>([]);

   useEffect(() => {
      const fetchOtherPosts = async () => {
         const { data, error } = await supabase
            .from("posts")
            .select("*")
            .eq("profile_id", prop.userId);
         if (data && !error) {
            setPosts(data);
         } else {
            console.error("error fetching posts:", error?.message);
         }
      };
      fetchOtherPosts();
   }, [prop.userId, prop.id]);

   if (!posts) {
      return null; // or return a placeholder or an error message
   }
   const navigate = useNavigate();
   const navigateAndRefresh = (id: string) => {
      // Navigate to the new page
      navigate(`/post/${id}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
   };

   const filteredPosts = posts.filter((post) => post.id !== prop.id);

   return (
      <>
         {filteredPosts.length && (
            <div className="mt-5 text-xl font-bold text-center md:text-left">
               {" "}
               More posts from {prop.name}
            </div>
         )}
         <Swiper
            modules={[Navigation]}
            loop={false}
            navigation={true}
            breakpoints={{
               320: {
                  slidesPerView: 1,
                  spaceBetween: 30,
               },
               768: {
                  slidesPerView: 2,
                  spaceBetween: 30,
               },
               1024: {
                  slidesPerView: 2,
                  spaceBetween: 30,
               },
               1440: {
                  slidesPerView: 5,
                  spaceBetween: 30,
               },
            }}
            pagination={{
               clickable: true,
            }}
            className="flex mx-auto productSlider">
            {filteredPosts.map((post) => {
               const { id, image, title } = post;

               return (
                  <SwiperSlide
                     key={id}
                     className="flex items-center flex-col justify-center h-[300px]">
                     <div
                        onClick={() => navigateAndRefresh(id)}
                        className="cursor-pointer">
                        <div className="relative">
                           <img
                              src={image}
                              alt=""
                              className="object-cover w-[450px] h-[200px]"
                           />
                           <Badge className="absolute top-2 right-2">
                              {title.substring(0, 23)}...
                           </Badge>
                        </div>
                     </div>
                  </SwiperSlide>
               );
            })}
         </Swiper>
      </>
   );
};

export default PostSlider;
