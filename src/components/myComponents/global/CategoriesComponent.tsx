import { categories } from "../posts/posts";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Link } from "react-router-dom";

const CategoriesComponent = () => {
   return (
      <section className="py-3 md:py-10 md:sticky md:top-[80px] px-6">
         <div className="pb-10 text-xl">
            Explore the World of Knowledge, One Byte at a Time
         </div>
         <div className="flex flex-wrap items-center gap-6">
            {categories.slice(0, 12).map((cat: string, index: number) => (
               <Link key={index} to="/">
                  <Badge
                     key={index}
                     className="py-2 transition-transform duration-300 bg-black hover:bg-black/30 hover:scale-105 dark:bg-primary dark:hover:bg-eccentric">
                     {cat}
                  </Badge>
               </Link>
            ))}
         </div>

         <div className="py-6 text-sm text-eccentric">
            <Button variant="secondary">Explore more exciting topics</Button>
         </div>
      </section>
   );
};

export default CategoriesComponent;
