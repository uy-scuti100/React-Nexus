import { useState, useEffect } from "react";
import supabase from "../../lib/supabaseClient";
import { Post } from "../../../types";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import { calculateReadTime } from "../../lib/readTime";
import { useNavigate } from "react-router-dom";
import { useRecommendedPost } from "../../hooks/useRecommendedPosts";

function shuffleArray(array: any) {
   for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements to shuffle
   }
}

function RecommendedPosts() {
   const [recommendedPosts, setRecommendedPosts] = useState<Post[] | null>([]);

   const { posts, isLoading, isError } = useRecommendedPost();

   useEffect(() => {
      if (typeof window !== "undefined" && posts !== null) {
         const shuffledPosts = [...posts]; // Copy the posts array
         shuffleArray(shuffledPosts); // Shuffle the copied array
         setRecommendedPosts(shuffledPosts); // Update the state with shuffled posts
      }
   }, [posts]);

   const navigate = useNavigate();
   const navigateAndRefresh = (id: string) => {
      // Navigate to the new page
      navigate(`/post/${id}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
   };

   return (
      <Swiper
         modules={[Pagination, Navigation]}
         loop={true}
         navigation={false}
         pagination={{
            clickable: true,
         }}
         slidesPerView={1}
         autoplay={{ delay: 1000, disableOnInteraction: false }}
         className="productSlider">
         <>
            {recommendedPosts?.map((post) => {
               const readTime = calculateReadTime(post.content);
               return (
                  <SwiperSlide
                     key={post.id}
                     className="flex items-center flex-col justify-center w-full h-[300px] md:h-[400px] mt-6 mb-10">
                     <div
                        onClick={() => navigateAndRefresh(post.id)}
                        className="relative w-full h-full cursor-pointer ">
                        <img
                           src={post.image}
                           alt={`${post.title}'s image`}
                           className="absolute inset-0 object-cover w-full h-full -z-20"
                        />
                        <div className="z-50 absolute left-3 right-3 top-[60%] md:top-[70%] text-white">
                           <p className="pb-3 text-2xl font-bold capitalize md:text-3xl">
                              {post.title.substring(0, 20)}...
                           </p>
                           <p className="pb-3 text-sm">
                              {post.snippet.substring(0, 30)}...
                           </p>
                           <p className="text-xs">{readTime} min read time</p>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/95 -z-10" />
                     </div>
                  </SwiperSlide>
               );
            })}

            {isLoading && (
               <div className="h-[300px] bg-gray-800 animate-pulse p-4 mb-10">
                  <div className="w-full h-2 mb-2 bg-gray-600 rounded"></div>
                  <div className="w-3/4 h-2 mb-2 bg-gray-600 rounded"></div>
                  <div className="w-2/3 h-2 bg-gray-600 rounded"></div>
               </div>
            )}
         </>
      </Swiper>
   );
}

export default RecommendedPosts;
