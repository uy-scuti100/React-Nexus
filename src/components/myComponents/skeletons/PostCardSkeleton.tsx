const PostCardSkeleton = () => {
   return (
      <div className="mb-10">
         <div className="relative w-full h-56 mb-6 bg-gray-300 duration-2000 md:h-52 animate-pulse" />
         <div className="w-full h-2 px-6 bg-gray-200 duration-2000 animate-pulse" />
         <div className="h-6 py-4 text-2xl font-bold capitalize bg-gray-200 duration-2000 animate-pulse" />
         <div className="w-full h-2 px-6 bg-gray-200 border-b duration-2000 border-black/10 dark:border-white/10 animate-pulse" />
         <div className="flex items-center justify-between py-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full duration-2000 animate-pulse" />
            <div className="flex items-center gap-2">
               <div className="w-20 h-6 bg-gray-200 duration-2000 animate-pulse" />
            </div>
         </div>
         <div className="h-12 pt-3 pb-8 text-lg font-medium capitalize bg-gray-200 duration-2000 animate-pulse" />
         <div className="w-full h-2 px-6 bg-gray-200 border-b duration-2000 border-black/10 dark:border-white/10 animate-pulse" />
         <div className="flex items-center justify-between pt-5 md:justify-normal md:gap-20">
            <div className="flex items-center gap-1">
               <div className="w-6 h-6 bg-gray-300 rounded-full duration-2000 animate-pulse" />
               <div className="w-6 h-6 bg-gray-200 duration-2000 animate-pulse" />
            </div>
            <div className="flex items-center gap-1">
               <div className="w-6 h-6 bg-gray-300 rounded-full duration-2000 animate-pulse" />
               <div className="w-6 h-6 bg-gray-200 duration-2000 animate-pulse" />
            </div>
            <div className="flex items-center gap-1">
               <div className="w-6 h-6 bg-gray-300 rounded-full duration-2000 animate-pulse" />
               <div className="w-6 h-6 bg-gray-200 duration-2000 animate-pulse" />
            </div>
         </div>
      </div>
   );
};

export default PostCardSkeleton;
