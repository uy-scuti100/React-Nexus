import { useContext } from "react";

import { Send } from "lucide-react";

import OnBoardTrendingPost from "./OnBoardTrendingPost";
import {
   ModalContext,
   ModalContextProp,
} from "../../../state/context/modalContext";
import PopUpProvider from "../../providers/pop-up/PopUpProvider";
import OnboardNav from "./OnboardNav";
import { CreateAccountComponent } from "../auths/CreateAccountComponent";
import { Button } from "../../ui/button";

export default function OnBoard() {
   const { openModal, openJoinModal, toggleJoinFormModal } = useContext(
      ModalContext
   ) as ModalContextProp;

   return (
      <main className="relative">
         {openModal && (
            <PopUpProvider>
               <CreateAccountComponent
                  title=" Welcome back."
                  type="log in"
                  question="No account? "
               />
            </PopUpProvider>
         )}
         {openJoinModal && (
            <PopUpProvider>
               <CreateAccountComponent
                  title=" Join Nexus"
                  type="sign in"
                  question="Already have an account?"
               />
            </PopUpProvider>
         )}
         <OnboardNav />
         <div className="y-8 pt-[63px]">
            <div className="bg-[#51b045] text-white px-6 pt-5 border-b border-black">
               <div className="md:flex block items-center md:max-w-[1192px] justify-between mx-auto pt-10">
                  <div className="flex-1">
                     <div className="">
                        <h1 className="md:text-[70px] text-[50px] font-[miracle] text-center md:text-left">
                           Fuel Your Curio
                           <span className="text-black">sity.</span>
                        </h1>

                        <h3 className="pt-6 text-base font-medium text-white/80 md:text-lg ">
                           Unlock a treasure trove of wisdom, explore
                           captivating narratives, and delve into the minds of
                           experts from various domains right here. We are here
                           to satiate your thirst for knowledge and ignite your
                           curiosity.
                        </h3>
                     </div>
                     <div className="pt-10 text-center md:text-left">
                        <Button
                           className="w-[200px] bg-black p-6 duration-300 transition-colors rounded-none "
                           onClick={toggleJoinFormModal}>
                           Start writing
                           <span className="w-4 h-4 ml-2">
                              <Send />
                           </span>
                        </Button>
                     </div>
                  </div>
                  <div className="flex-1">
                     <img
                        src="/onboard.svg"
                        height={500}
                        width={600}
                        alt="svg"
                        className="h-[500px] "
                     />
                  </div>
               </div>
            </div>
            <div className="px-6">
               <p className="pt-20 text-xl md:text-3xl font-medium text-center max-w-[1192px] mx-auto">
                  Welcome aboard, fellow traveler. Let us embark on this
                  exciting journey together and see where the Nexus takes us.
               </p>
            </div>
         </div>
         <div className="mx-auto max-w-[1192px] pt-14">
            <OnBoardTrendingPost />
         </div>
      </main>
   );
}
