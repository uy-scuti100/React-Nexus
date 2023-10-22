import { useState } from "react";
import Navbar from "../../components/myComponents/global/Navbar";
import supabase from "../../lib/supabaseClient";
import SearchInput from "./SearchInput";
import SearchResult from "./SearchResults";
import { useNavigate } from "react-router-dom";
// Interface for data returned by searchPeople
interface SearchResultProp {
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

const Search = () => {
   const navigate = useNavigate();
   const [selectedCategory, setSelectedCategory] = useState("people");
   const [searchQuery, setSearchQuery] = useState("");
   const [searchResults, setSearchResults] = useState<Array<SearchResultProp>>(
      []
   );
   let searchTimeout: NodeJS.Timeout | undefined;

   const debouncedSearch = (category: string, query: string) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
         if (query) {
            if (category === "people") {
               searchPeople(query);
            } else if (category === "posts") {
               searchPosts(query);
            } else if (category === "topics") {
               searchTopics(query);
            }
         } else {
            setSearchResults([]);
         }
      }, 1000);
   };

   const searchPeople = async (query: string) => {
      const { data, error } = await supabase
         .from("profiles")
         .select("id, display_name, username, display_pic")
         .or(`display_name.ilike.*${query}*,username.ilike.*${query}*`);

      if (error) {
         console.error("Error searching for people:", error.message);
         setSearchResults([]);
         return;
      }

      setSearchResults(data);
   };

   const searchPosts = async (query: string) => {
      const { data, error } = await supabase
         .from("posts")
         .select("*")
         .or(
            `title.ilike.*${query}*,content.ilike.*${query}*,snippet.ilike.*${query}*`
         );

      if (error) {
         console.error("Error searching for people and posts:", error.message);
         setSearchResults([]);
         return;
      }

      setSearchResults(data);
   };

   const searchTopics = async (query: string) => {
      // Assuming topics are associated with posts using a field named 'tags'
      const { data, error } = await supabase
         .from("posts")
         .select("*")
         .ilike("tags", `%${query}%`)
         .range(0, 9);

      if (error) {
         console.error("Error searching for topics:", error.message);
         setSearchResults([]);
         return;
      }

      setSearchResults(data);
   };

   return (
      <main>
         {" "}
         <Navbar />
         <section className="px-6 pt-24">
            <div className="flex items-center gap-10 pb-10">
               <button
                  className={`w-full px-5 py-2 mt-5 font-semibold md:w-auto  dark:text-black ${
                     selectedCategory === "people"
                        ? "bg-accent-red"
                        : "bg-accent-red/40 dark:text-white"
                  }`}
                  onClick={() => {
                     setSelectedCategory("people");
                     setSearchQuery("");
                  }}>
                  People
               </button>
               <button
                  className={`w-full px-5 py-2 mt-5 font-semibold md:w-auto  dark:text-black ${
                     selectedCategory === "posts"
                        ? "bg-accent-red"
                        : "bg-accent-red/40 dark:text-white"
                  }`}
                  onClick={() => {
                     setSelectedCategory("posts");
                     setSearchQuery("");
                  }}>
                  Posts
               </button>
               <button
                  className={`w-full px-5 py-2 mt-5 font-semibold md:w-auto  dark:text-black ${
                     selectedCategory === "topics"
                        ? "bg-accent-red"
                        : "dark:text-white"
                  }`}
                  // onClick={() => {
                  //    setSelectedCategory("topics");
                  //    setSearchQuery("");
                  // }}
                  onClick={() => navigate("/explore-topics")}>
                  Topics
               </button>
            </div>
            <div className="flex items-center gap-3">
               {selectedCategory === "people" && (
                  <SearchInput
                     placeholder="Search People"
                     value={searchQuery}
                     onChange={setSearchQuery}
                     onSearch={(query: string) =>
                        debouncedSearch("people", query)
                     }
                  />
               )}
               {selectedCategory === "posts" && (
                  <SearchInput
                     placeholder="Search Posts"
                     value={searchQuery}
                     onChange={setSearchQuery}
                     onSearch={(query: string) =>
                        debouncedSearch("posts", query)
                     }
                  />
               )}
               {selectedCategory === "topics" && (
                  <SearchInput
                     placeholder="Search Topics"
                     value={searchQuery}
                     onChange={setSearchQuery}
                     onSearch={(query: string) =>
                        debouncedSearch("topics", query)
                     }
                  />
               )}
            </div>
         </section>
         <div className="mt-4 px-6 w-full md:max-w-[50%] ">
            {searchQuery.trim() !== "" &&
               searchResults.map((result, id) => (
                  <SearchResult
                     key={id}
                     result={result}
                     category={selectedCategory}
                  />
               ))}
         </div>
      </main>
   );
};

export default Search;
