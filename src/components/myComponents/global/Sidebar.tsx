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
   const { user } = useFetchUser();
   const { theme } = useTheme();
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
         <Subscribe />
         <img
            className="hidden w-full my-8 md:block"
            alt="advert-2"
            placeholder="blur"
            src="/ad2.jpg"
            width={500}
            height={1000}
         />
         <h4 className="px-5 py-3 text-xs font-bold text-center bg-wh-900 text-wh-50">
            About {username?.split(" ")[0]}
         </h4>
         <div className="flex justify-center my-3">
            <img
               alt="about-profile"
               src={image}
               width={500}
               sizes="(max-width: 480px) 100vw, (max-width: 768px) 85vw, (max-width: 1060px) 75vw, 60vw"
               height={250}
               style={{ width: "500px", height: "250px", objectFit: "cover" }}
            />
         </div>
         <h4 className="px-5 py-3 font-bold text-center text-wh-500">
            {username}
         </h4>
         <p className="text-sm text-center text-wh-500">
            {bio?.substring(0, 80)}...
         </p>
      </section>
   );
};

export default Sidebar;
