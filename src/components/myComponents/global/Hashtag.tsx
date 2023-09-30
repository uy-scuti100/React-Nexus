//;

import { Button } from "../../ui/button";
import { useHashtag } from "@/hooks/useHashtag";
import { Plus } from "lucide-react";
import Link from "next/link";

const Category = () => {
   const { isError, isLoading, hashtags } = useHashtag();

   return (
      <div className="flex items-center gap-6 px-6 py-4 overflow-x-auto border-b border-black/20">
         <div>
            <Plus />
         </div>
         {hashtags?.map((hashtag) => {
            const { name, id } = hashtag;
            return (
               <Link href={`/hashtags/${id}`} key={id}>
                  <Button className="px-2 py-2 transition-transform duration-300 rounded hover:scale-105 w-max whitespace-nowrap ">
                     {name}
                  </Button>
               </Link>
            );
         })}
      </div>
   );
};

export default Category;
