import { Link, useNavigate } from "react-router-dom";

import { TopicProp } from "../../../hooks/useHashtags";

const CategorySlider = ({
   prop,
   channel,
}: {
   prop: TopicProp[] | null;
   channel: string;
}) => {
   const navigate = useNavigate();

   return (
      <div className="flex items-center gap-5 py-3 mx-6 overflow-auto scrollbar">
         <Link
            to={`/explore-topics`}
            className="flex items-center p-2 text-xs font-normal text-white transition-transform duration-300 bg-black rounded-full md:px-6 hover:scale-105 w-max whitespace-nowrap dark:bg-white dark:text-black">
            <span className="md:mr-2 ">
               <svg viewBox="0 0 24 24" fill="none" height="24" width="24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor"></circle>
                  <path
                     fill-rule="evenodd"
                     clip-rule="evenodd"
                     d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zm3.94-14.84l.14-1-.88.48-5.9 3.2-.22.12-.03.24-.99 6.64-.14.99.88-.48 5.9-3.2.22-.11.03-.25.99-6.63zM9.2 16l.72-4.85 3.59 2.51L9.2 16zm1.3-5.67l3.58 2.51L14.8 8l-4.3 2.33z"
                     fill="currentColor"></path>
               </svg>
            </span>{" "}
            <span className="hidden md:block"> Discover more</span>
         </Link>
         {prop?.map((topic) => {
            const { id, name } = topic;

            return (
               <Link to={`/${channel}/${id}`}>
                  <button className="flex items-center px-6 py-2 text-sm font-normal text-white transition-transform duration-300 bg-black rounded-full hover:scale-105 w-max whitespace-nowrap dark:bg-white dark:text-black">
                     {name}
                  </button>
               </Link>
            );
         })}
      </div>
   );
};

export default CategorySlider;
