import { TrendingUp } from "lucide-react";
import React from "react";
import {
   LargePostComponent,
   TrendingPostComponent,
} from "./TrendingPostComponent";
import CategoriesComponent from "./CategoriesComponent";

export default function OnBoardTrendingPost() {
   return (
      <section className="pt-10">
         <div className="flex items-center gap-3 px-6">
            <span className="p-2 border border-black/30 dark:border-primary rounded-xl">
               <TrendingUp className="w-4 h-4 " />
            </span>
            Trending on Nexus
         </div>
         <TrendingPostComponent />
         {/* seperator */}
         <div className="border-b border-black/30 dark:border-white/20"></div>
         <div className="grid gap-16 md:px-6 md:grid-cols-3 pt-14">
            <div className="relative md:order-2 md:col-span-1">
               <CategoriesComponent />
            </div>
            <div className="w-full md:order-1 md:col-span-2">
               <LargePostComponent />
            </div>
         </div>
      </section>
   );
}
