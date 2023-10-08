import { Button } from "../../ui/button";
import { Plus } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useCategory } from "../../../hooks/useCategory";

export const CategorySkeleton = () => {
   return (
      <div className="h-10 px-10 duration-300 bg-gray-300 roundedhover:scale-105 animate-pulse "></div>
   );
};

const Category = () => {
   const { isError, isLoading, categories } = useCategory();
   const { id } = useParams();
   const paramsId = id;
   const pathname = window.location.pathname;
   const path = pathname.split("/")[1];

   const skeletonElements = Array.from({ length: 10 }, (_, index) => (
      <CategorySkeleton key={index} />
   ));

   return (
      <div className="flex items-center gap-6 py-4 overflow-x-auto">
         <div>
            <Plus />
         </div>
         <Link to="/posts">
            <Button
               className={` ${
                  path === "posts" && "bg-accent-orange"
               } px-2 py-2 transition-transform duration-300 rounded hover:scale-105 w-max whitespace-nowrap`}>
               {" "}
               For You
            </Button>
         </Link>
         {categories?.map((cat) => {
            const { name, id } = cat;
            return (
               <Link to={`/categories/${id}`} key={id}>
                  <Button
                     className={`${
                        paramsId === id && "bg-accent-orange"
                     } px-2 py-2 transition-transform duration-300 rounded hover:scale-105 w-max whitespace-nowrap`}>
                     {name}
                  </Button>
               </Link>
            );
         })}
         {isLoading && (
            <div className="flex items-center gap-6 px-6 py-4">
               {skeletonElements}
            </div>
         )}
      </div>
   );
};

export default Category;
