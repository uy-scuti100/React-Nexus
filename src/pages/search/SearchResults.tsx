import { Link } from "react-router-dom";

interface SearchResult {
   // people
   id: string;
   display_name?: string;
   username?: string;
   display_pic?: string;
   // post
   title?: string;
   snippet?: string;
   author?: string;
   image?: string;
   // topics
   name?: string;
}
const SearchResult = ({
   result,
   category,
}: {
   result: SearchResult;
   category: string;
}) => {
   if (category === "people") {
      return (
         <Link to={`/account/${result.id}`} className=" p-2 mb-2">
            <div className="flex gap-4 items-center">
               <img
                  src={result.display_pic}
                  alt={result.display_name}
                  height={50}
                  width={50}
                  className="border border-accent-orange w-[50px] h-[50px] rounded-full cursor-pointer object-cover"
               />
               <div className="flex flex-col">
                  <p className="text-xl font-bold ">{result.display_name}</p>
                  <p className="text-xs opacity-75"> {result.username}</p>
               </div>
            </div>
            <div className="w-full px-6 py-4 border-b border-black/10 dark:border-white/10" />
         </Link>
      );
   } else if (category === "posts") {
      return (
         <Link to={`/post/${result.id}`} className=" p-2 my-2">
            <div className="flex gap-4 items-center">
               <img
                  src={result.image}
                  alt={result.display_name}
                  height={100}
                  width={150}
                  className="w-[150px] h-[100px] cursor-pointer object-contain"
               />
               <div className="flex flex-col gap-4">
                  <p className="font-bold text-xl ">{result.title}</p>
                  <p className="opacity-80">{result.snippet}</p>
                  <p className="text-xs"> by: {result.author}</p>
               </div>
            </div>
            <div className="w-full px-6 py-4 border-b border-black/10 dark:border-white/10" />
         </Link>
      );
   } else if (category === "topics") {
      return (
         <div className="border p-2 mb-2">
            <p>{result.name}</p>
         </div>
      );
   }

   // Return null if the category is not recognized
   return null;
};

export default SearchResult;
