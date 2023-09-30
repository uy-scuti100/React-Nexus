import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetchCategoryPost } from "../../hooks/useFetchCategoryPost";
import CategoryCard from "./Categories";
import Subscribe from "../../components/myComponents/global/Subscribe";
import Sidebar from "../../components/myComponents/global/Sidebar";
import { Post } from "../../../types";
import Category from "../../components/myComponents/global/Category";
import Navbar from "../../components/myComponents/global/Navbar";

const Page = () => {
   const { id } = useParams();
   const paramsId = id;
   // console.log(paramsId);
   const { posts } = useFetchCategoryPost(paramsId as string);
   const [categoryPosts, setCategoryPosts] = useState<
      Post[] | null | undefined
   >([]);
   useEffect(() => {
      setCategoryPosts(posts);
   }, [paramsId, posts]);
   return (
      <main className="relative">
         <Navbar />
         <section className="px-6 pt-24">
            <Category />
            <div className="gap-10 px-6 pt-10 mb-5 md:flex">
               <div className="basis-3/5">
                  {/* posts */}
                  <CategoryCard categoryPosts={categoryPosts} />
                  <div className="hidden md:block">
                     <Subscribe />
                  </div>
               </div>
               <div className="basis-2/5">
                  <Sidebar type="home" />
               </div>
            </div>
         </section>
      </main>
   );
};

export default Page;
