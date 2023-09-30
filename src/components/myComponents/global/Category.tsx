import { Button } from "../../ui/button";
import { Plus } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useCategory } from "../../../hooks/useCategory";

const Category = () => {
   const { isError, isLoading, categories } = useCategory();
   const params = useParams();
   const paramsId = params.categoriesId;
   const pathname = window.location.pathname;
   const path = pathname.split("/")[1];
   // console.log(path);

   return (
      <div className="flex items-center gap-6 px-6 py-4 overflow-x-auto border-b border-black/20">
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
      </div>
   );
};

export default Category;
