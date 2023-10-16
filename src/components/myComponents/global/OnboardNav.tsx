//;
import { useContext, useEffect, useState } from "react";
import { Button } from "../../ui/button";
import {
   ModalContext,
   ModalContextProp,
} from "../../../state/context/modalContext";

const OnboardNav = () => {
   const { toggleWelcomeFormModal, toggleJoinFormModal } = useContext(
      ModalContext
   ) as ModalContextProp;
   const [navColor, setNavColor] = useState(false);
   useEffect(() => {
      const navColorChange = () => {
         let screenHeight = window.scrollY;
         if (screenHeight >= window.innerHeight) {
            setNavColor(true);
         } else {
            setNavColor(false);
         }
      };
      window.addEventListener("scroll", navColorChange);
      return () => {
         window.removeEventListener("scroll", navColorChange);
      };
   }, []);

   return (
      <nav
         className={`z-20 transition-colors duration-700 fixed w-full px-6 py-4 ${
            navColor ? "bg-background" : "bg-[#51b045]"
         }  border-b border-black/30 dark:border-white/20`}>
         <div className="flex items-center self-center justify-between md:max-w-[1192px] mx-auto">
            <div className="text-2xl md:text-5xl logo ">Nexus</div>
            <div className="flex items-center gap-4">
               {/* <ModeToggle /> */}
               <Button
                  variant="link"
                  className="hidden text-xs text-black dark:text-white md:block"
                  onClick={toggleWelcomeFormModal}>
                  Sign In
               </Button>
               <Button
                  size="sm"
                  className="text-xs transition-colors duration-300 bg-black rounded-full"
                  onClick={toggleJoinFormModal}>
                  Get started
               </Button>
            </div>
         </div>
      </nav>
   );
};

export default OnboardNav;
