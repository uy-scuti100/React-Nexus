import { categories } from "../posts/posts";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../../../lib/supabaseClient";

interface SuggestionProp {
   id: string;
   name: string;
}

const CategoriesComponent = () => {
   const [topics, setTopics] = useState<SuggestionProp[] | null>([]);
   useEffect(() => {
      const fetchTopics = async () => {
         const { data: topics, error: topicsError } = await supabase
            .from("topics")
            .select("*");

         if (topics && !topicsError) {
            setTopics(topics);
         }
      };

      fetchTopics();
   });
   return (
      <section className="py-3 md:py-10 md:sticky md:top-[80px] px-6">
         <div className="pb-10 text-xl">
            Explore the World of Knowledge, One Byte at a Time
         </div>
         <div className="flex flex-wrap items-center gap-6 mb-10">
            {topics?.slice(0, 6).map((cat) => (
               <Link key={cat.id} to={`/topic/${cat.id}`}>
                  <Badge
                     key={cat.id}
                     className="py-2 transition-transform duration-300 bg-black hover:bg-black/30 hover:scale-105 dark:bg-primary dark:hover:bg-eccentric">
                     {cat.name}
                  </Badge>
               </Link>
            ))}
         </div>

         <Link to={`/explore-topics`} className="py-6 text-sm text-eccentric">
            <Button variant="secondary">Explore more exciting topics</Button>
         </Link>
      </section>
   );
};

export default CategoriesComponent;
