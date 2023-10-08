import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Hashtag } from "../../../types";
import { useHashtag } from "../../hooks/useHashtags";

const HashtagComp = () => {
   const { isError, isLoading, hashtags } = useHashtag();

   return (
      <div className="flex items-center gap-6 px-6 py-4 overflow-x-auto border-b border-black/20">
         <div>
            <Plus />
         </div>
         {hashtags?.map((hashtag: Hashtag) => {
            const { name, id } = hashtag;
            return (
               <Link to={`/hashtags/${id}`} key={id}>
                  <Button className="px-2 py-2 transition-transform duration-300 rounded hover:scale-105 w-max whitespace-nowrap ">
                     {name}
                  </Button>
               </Link>
            );
         })}
      </div>
   );
};

export default HashtagComp;
