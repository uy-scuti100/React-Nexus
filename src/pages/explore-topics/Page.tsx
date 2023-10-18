import debounce from "lodash.debounce";
import Navbar from "../../components/myComponents/global/Navbar";
import CategorySlider from "../../components/myComponents/global/categorySlider";
import { useHashtag } from "../../hooks/useHashtags";
import supabase from "../../lib/supabaseClient";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GiInspiration } from "react-icons/gi";
import Topics from "./Topics";
import LargeDScreenTopicComp from "./LargeDScreenTopicComp";

interface SuggestionProp {
   id: string;
   name: string;
}
export default function Page() {
   const { hashtags, isLoading, isError } = useHashtag();
   const [categoryInput, setCategoryInput] = useState("");
   const [categorySuggestions, setCategorySuggestions] = useState<
      Array<SuggestionProp>
   >([]);
   const navigate = useNavigate();

   const debouncedHandleCategoryInputChange = debounce(
      async (inputValue: string) => {
         if (inputValue) {
            // Fetch suggestions from Topics, Subtopics, and Subsubtopics separately
            const { data: topics, error: topicsError } = await supabase
               .from("topics")
               .select("id, name, type")
               .ilike("name", `%${inputValue}%`)
               .limit(5);

            const { data: subtopics, error: subtopicsError } = await supabase
               .from("subtopics")
               .select("id, name, type")
               .ilike("name", `%${inputValue}%`)
               .limit(5);

            const { data: subsubtopics, error: subsubtopicsError } =
               await supabase
                  .from("subsubtopics")
                  .select("id, name, type")
                  .ilike("name", `%${inputValue}%`)
                  .limit(5);

            // Combine results from all three tables, handling null data
            const allCategories = [
               ...(topics || []),
               ...(subtopics || []),
               ...(subsubtopics || []),
            ];

            if (topicsError || subtopicsError || subsubtopicsError) {
               console.error(
                  "Error fetching category suggestions:",
                  topicsError,
                  subtopicsError,
                  subsubtopicsError
               );
            } else {
               setCategorySuggestions(allCategories);
            }
         } else {
            setCategorySuggestions([]);
         }
      },
      1000
   );
   const handleCategoryInputChange = async (
      e: React.ChangeEvent<HTMLInputElement>
   ) => {
      const inputValue = e.target.value;
      setCategoryInput(inputValue);

      // Clear category suggestions when the input is empty
      if (!inputValue) {
         setCategorySuggestions([]);
         return; // Exit early to prevent further processing
      }

      // Call the debounced function with the current input value
      debouncedHandleCategoryInputChange(inputValue);
   };
   const handleFocus = (isFocused: boolean) => {
      if (!isFocused) {
         setCategoryInput("");
         setTimeout(() => {
            setCategorySuggestions([]);
         }, 5000); // 5000 milliseconds (5 seconds)
      }
   };

   return (
      <main className="relative max-w-[1440px]">
         <div>
            <Navbar />
         </div>
         <div className="pt-14">
            <CategorySlider channel="tag" prop={hashtags} />
         </div>
         <div className="text-center pt-10 mt-3 mb-[5px] text-[2rem] md:text-[2.625rem] leading-10 break-words box-border font-bold capitalize lead">
            Discover topics
         </div>
         <div className="flex items-center justify-center gap-2 pt-4 text-sm font-normal">
            <p> Find Inspiration Here </p>
            <GiInspiration className="w-6 h-6 opacity-75" />
         </div>

         <div className="flex justify-center px-6">
            <div className=" md:w-[40%] w-full mt-6 px-5 flex items-center border gap-3 rounded-full">
               <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-label="Search"
                  className="cursor-pointer">
                  <path
                     fill-rule="evenodd"
                     clip-rule="evenodd"
                     d="M4.1 11.06a6.95 6.95 0 1 1 13.9 0 6.95 6.95 0 0 1-13.9 0zm6.94-8.05a8.05 8.05 0 1 0 5.13 14.26l3.75 3.75a.56.56 0 1 0 .8-.79l-3.74-3.73A8.05 8.05 0 0 0 11.04 3v.01z"
                     fill="currentColor"></path>
               </svg>
               <input
                  type="text"
                  className="w-full py-3 bg-transparent outline-none md:py-5 placeholder:text-sm "
                  placeholder="Search all topics"
                  value={categoryInput}
                  onChange={handleCategoryInputChange}
                  onFocus={() => handleFocus(true)}
                  onBlur={() => handleFocus(false)}
               />
            </div>
         </div>
         <div className="grid grid-cols-1 px-6 mt-3 justify-items-center ">
            <ul
               className={`${
                  categorySuggestions.length &&
                  "border-2 rounded border-foreground/10 flex flex-col px-6 col-span-1 w-full md:w-[40%]"
               }`}>
               {categorySuggestions.map((category) => (
                  <li
                     onClick={() => navigate(`/topic/${category.id}`)}
                     className="flex items-center w-full gap-2 py-3 mx-2 text-lg border-b cursor-pointer hover:opacity-50 "
                     key={category.id}>
                     <span>
                        <svg width="24" height="24" viewBox="0 0 24 24">
                           <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M5 21V3h14v18H5zM4.75 2a.75.75 0 0 0-.75.75v18.5c0 .41.34.75.75.75h14.5c.41 0 .75-.34.75-.75V2.75a.75.75 0 0 0-.75-.75H4.75zM8 13a.5.5 0 0 0 0 1h8a.5.5 0 0 0 0-1H8zm-.5 3.5c0-.28.22-.5.5-.5h8a.5.5 0 0 1 0 1H8a.5.5 0 0 1-.5-.5zM8.75 10h6.5c.14 0 .25-.11.25-.25v-2.5a.25.25 0 0 0-.25-.25h-6.5a.25.25 0 0 0-.25.25v2.5c0 .14.11.25.25.25z"></path>
                        </svg>
                     </span>
                     <p className="text-sm"> {category.name}</p>
                  </li>
               ))}
            </ul>
            <div className="w-full px-6 py-4 border-b border-black/10 dark:border-white/10" />
         </div>

         <div className="mt-10 md:hidden">
            <Topics />
         </div>
         <div className="hidden mt-10 md:block">
            <LargeDScreenTopicComp />
         </div>
      </main>
   );
}
