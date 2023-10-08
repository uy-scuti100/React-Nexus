const PostCardSkeleton = () => {
   return (
      <div className="mb-10">
         <div className="relative w-full h-56 mb-6 duration-300 bg-gray-300 md:h-96 animate-pulse" />
         <div className="w-full h-2 px-6 duration-300 bg-gray-200 border-b border-black/10 dark:border-white/10 animate-pulse" />
         <div className="h-6 py-4 text-2xl font-bold capitalize duration-300 bg-gray-200 animate-pulse" />
         <div className="w-full h-2 px-6 duration-300 bg-gray-200 border-b border-black/10 dark:border-white/10 animate-pulse" />
         <div className="flex items-center justify-between py-3">
            <div className="w-10 h-10 duration-300 bg-gray-300 rounded-full animate-pulse" />
            <div className="flex items-center gap-2">
               <div className="w-20 h-6 duration-300 bg-gray-200 animate-pulse" />
            </div>
         </div>
         <div className="h-12 pt-3 pb-8 text-lg font-medium capitalize duration-300 bg-gray-200 animate-pulse" />
         <div className="w-full h-2 px-6 duration-300 bg-gray-200 border-b border-black/10 dark:border-white/10 animate-pulse" />
         <div className="flex items-center justify-between pt-5 md:justify-normal md:gap-20">
            <div className="flex items-center gap-1">
               <div className="w-6 h-6 duration-300 bg-gray-300 rounded-full animate-pulse" />
               <div className="w-6 h-6 duration-300 bg-gray-200 animate-pulse" />
            </div>
            <div className="flex items-center gap-1">
               <div className="w-6 h-6 duration-300 bg-gray-300 rounded-full animate-pulse" />
               <div className="w-6 h-6 duration-300 bg-gray-200 animate-pulse" />
            </div>
            <div className="flex items-center gap-1">
               <div className="w-6 h-6 duration-300 bg-gray-300 rounded-full animate-pulse" />
               <div className="w-6 h-6 duration-300 bg-gray-200 animate-pulse" />
            </div>
         </div>
      </div>
   );
};

export default PostCardSkeleton;
