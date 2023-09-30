//;

import React, { ReactNode, useContext } from "react";
import { X } from "lucide-react";
import { ModalContext, ModalContextProp } from "@/state/context/modalContext";

export default function PopUpProvider({ children }: { children: ReactNode }) {
   const { openModal, toggleWelcomeFormModal, toggleJoinFormModal } =
      useContext(ModalContext) as ModalContextProp;
   return (
      <div className="fixed inset-0 z-30 w-full h-full overflow-hidden transition-all duration-300">
         <div className="absolute inset-0 z-40 bg-white backdrop-blur-0 md:bg-white/60 md:backdrop-blur-xl dark:bg-black" />
         <div className="absolute flex justify-center items-center z-50 top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
            <div className="absolute right-0 p-2 top-[-60px] cursor-pointer ">
               <X
                  onClick={
                     openModal ? toggleWelcomeFormModal : toggleJoinFormModal
                  }
               />
            </div>
            {children}
         </div>
      </div>
   );
}
