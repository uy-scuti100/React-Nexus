import { useContext } from "react";
import Category from "../../components/myComponents/global/Category";
import Navbar from "../../components/myComponents/global/Navbar";
import Sidebar from "../../components/myComponents/global/Sidebar";
import Subscribe from "../../components/myComponents/global/Subscribe";
import {
   ModalContext,
   ModalContextProp,
} from "../../state/context/modalContext";
import HomeCard from "./HomeCard";
import PostForm from "../../components/myComponents/global/PostForm";

const page = () => {
   const { openJotter } = useContext(ModalContext) as ModalContextProp;
   return (
      <main className="relative">
         {openJotter && <PostForm />}
         <Navbar />
         <section className="px-6 pt-24">
            <Category />
            <div className="gap-10 pt-20 mb-5 md:flex">
               <div className="md:basis-3/5 lg:basis-3/4">
                  {/* posts */}
                  <HomeCard />
                  <div className="hidden md:block">
                     <Subscribe />
                  </div>
               </div>
               <div className="md:basis-2/5 lg:basis1/4">
                  <Sidebar type="home" />
               </div>
            </div>
         </section>
      </main>
   );
};

export default page;
