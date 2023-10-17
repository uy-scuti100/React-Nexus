import { useEffect, useState } from "react";
import { useFetchUser } from "../../../hooks/useFetchUser";
import { useTheme } from "../../providers/theme/theme-provider";
import { Link } from "react-router-dom";
import { CategorySkeleton } from "./Category";
import { useHashtag } from "../../../hooks/useHashtags";
import { useNavigate } from "react-router-dom";

interface SidebarProp {
   type: "home" | "post";
}

const Sidebar = (props: SidebarProp) => {
   const { isError, isLoading: loading, hashtags } = useHashtag();
   const [image, setImage] = useState("");
   const [username, setUsername] = useState("");
   const [bio, setBio] = useState("");
   const { user, isLoading } = useFetchUser();
   const { theme } = useTheme();
   const id = user?.id;
   const navigate = useNavigate();
   useEffect(() => {
      const image = user?.display_pic;
      const name = user?.display_name;
      const bio = user?.bio;
      setImage(image as string);
      setBio(bio as string);
      setUsername(name as string);
   }, [user]);

   const skeletonElements = Array.from({ length: 3 }, (_, index) => (
      <CategorySkeleton key={index} />
   ));
   const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
   };

   return (
      <section className="sticky top-[-80px]">
         <div className="hidden md:block">
            <div>
               <div className="pb-10 text-lg font-bold">
                  Explore the World of Knowledge, One Byte at a Time
               </div>
               <div className="flex flex-wrap items-center gap-6">
                  {hashtags
                     ?.sort((a, b) => {
                        if (a.created_at && b.created_at) {
                           return (
                              new Date(b.created_at).getTime() -
                              new Date(a.created_at).getTime()
                           );
                        }
                        return 0; // Handle null or missing created_at values
                     })
                     .slice(0, 5)
                     .map((cat) => {
                        const { name, id } = cat;
                        return (
                           <Link to={`/tag/${id}`} key={id}>
                              <button className="flex items-center px-4 py-2 text-xs font-normal text-white transition-transform duration-300 bg-black rounded-full hover:scale-105 w-max whitespace-nowrap dark:bg-white dark:text-black ">
                                 {name}
                              </button>
                           </Link>
                        );
                     })}
                  {isLoading && (
                     <div className="flex items-center gap-6 px-6 py-4 overflow-hidden ">
                        {skeletonElements}
                     </div>
                  )}
               </div>

               <div className="py-6 text-sm">
                  <button
                     onClick={() => {
                        navigate("/explore-topics");
                        scrollToTop();
                     }}
                     className="px-5 py-2 text-sm font-bold capitalize transition-transform duration-300 rounded-full hover:scale-105 w-max whitespace-nowrap bg-accent-orange text-white-900">
                     Explore more exciting topics
                  </button>
               </div>
            </div>

            <div className="pb-5">
               <img
                  src="/public/Purple Gradient Consistency Success Motivational Word Banner (1).webp"
                  alt=""
               />
            </div>
         </div>
         <div className="hidden md:block">
            <h1 className="pb-5 text-sm font-bold">
               Disseminate the Idea, Magnify Your Impact!
            </h1>
            <p className="pb-5 text-xs opacity-70">
               Be a part of our mission to foster and embolden writers by
               introducing Nexus to your network. Together, we can nurture a
               thriving community of thinkers and innovators.
            </p>
         </div>
         {id && (
            <>
               {user && (
                  <h4 className="px-5 py-3 text-xs font-bold text-center bg-wh-900 text-wh-50">
                     About {username?.split(" ")[0]}
                  </h4>
               )}
               {isLoading && (
                  <h4 className="px-5 py-5 text-xs font-bold text-center duration-300 text-wh-50 bg-wh-300 animate-pulse"></h4>
               )}
               {user && (
                  <div className="flex justify-center my-3">
                     <img
                        alt="about-profile"
                        src={image}
                        width={500}
                        sizes="(max-width: 480px) 100vw, (max-width: 768px) 85vw, (max-width: 1060px) 75vw, 60vw"
                        height={250}
                        style={{
                           width: "500px",
                           height: "250px",
                           objectFit: "cover",
                        }}
                     />
                  </div>
               )}
               {isLoading && (
                  <div className="flex justify-center my-3">
                     <div className="w-[500px] h-[250px] animate-pulse duration-300 bg-wh-300" />
                  </div>
               )}
               <h4 className="px-5 py-3 font-bold text-center text-wh-500">
                  {username}
               </h4>
               <p className="text-sm text-center opacity-70">
                  {bio?.substring(0, 80)}...
               </p>
            </>
         )}
      </section>
   );
};

export default Sidebar;

{
   /* <img
                           className="hidden w-full my-8 md:block h-[200px]"
                           alt="advert-2"
                           placeholder="blur"
                           src="/ad2.jpg"
                           width={500}
                           height={500}
                        />
                        <h4 className="px-5 py-3 text-xs font-bold text-center bg-wh-900 text-wh-50">
                           Follow Our Socials
                        </h4>
                        <div className="mx-5 my-5">
                           {theme === "dark" ? <SocialLinks /> : <SocialLinks isDark={true} />}
                        </div>
                        <div className="mb-4">
                           <Subscribe />
                        </div> */
}
