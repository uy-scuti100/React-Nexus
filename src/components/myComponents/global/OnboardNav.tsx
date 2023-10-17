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
         className={`z-20 transition-colors duration-700 flex items-center justify-between  max-w-[1440px] px-6 w-full h-[57px] ${
            navColor ? "bg-background" : "bg-[#51b045]"
         }  border-b border-black/30 dark:border-white/20`}>
         <h2 className="text-3xl text-black md:text-4xl logo ">Nexus</h2>
         <div className="flex items-center gap-4">
            {/* <ModeToggle /> */}
            <Button
               variant="link"
               className="hidden text-xs text-black md:block"
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
      </nav>
   );
};

export default OnboardNav;
