import { useEffect, useState } from "react";
import SocialLinks from "./SocialLinks";
import Subscribe from "./Subscribe";
import { useFetchUser } from "../../../hooks/useFetchUser";
import { useTheme } from "../../providers/theme/theme-provider";

interface SidebarProp {
   type: "home" | "post";
}

const Sidebar = (props: SidebarProp) => {
   const [image, setImage] = useState("");
   const [username, setUsername] = useState("");
   const [bio, setBio] = useState("");
   const { user, isLoading } = useFetchUser();
   const { theme } = useTheme();
   const id = user?.id;
   useEffect(() => {
      const image = user?.display_pic;
      const name = user?.display_name;
      const bio = user?.bio;
      setImage(image as string);
      setBio(bio as string);
      setUsername(name as string);
   }, [user]);

   return (
      <section className="sticky top-[-80px]">
         <h4 className="px-5 py-3 text-xs font-bold text-center bg-wh-900 text-wh-50">
            Subscribe and Follow
         </h4>
         <div className="mx-5 my-5">
            {theme === "dark" ? <SocialLinks /> : <SocialLinks isDark={true} />}
         </div>
         <div className="mb-4">
            <Subscribe />
         </div>
         <img
            className="hidden w-full my-8 md:block"
            alt="advert-2"
            placeholder="blur"
            src="/ad2.jpg"
            width={500}
            height={1000}
         />
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
               <p className="text-sm text-center text-wh-500">
                  {bio?.substring(0, 80)}...
               </p>
            </>
         )}
      </section>
   );
};

export default Sidebar;
