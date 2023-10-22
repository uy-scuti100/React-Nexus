const PostCardSkeleton = () => {
   return (
      <div className="p-4 px-6 mb-10 bg-gray-800 animate-pulse">
         {/* Loader content goes here */}
         <div className="flex items-center gap-10">
            <div className="w-16 h-16 bg-gray-600 rounded-full"></div>
            <div className="flex items-center gap-3 text-xs font-medium text-gray-600">
               <div className="w-20 h-4 bg-gray-600 rounded"></div>
               <div className="w-10 h-4 bg-gray-600 rounded"></div>
            </div>

            <div>
               <div className="h-20 bg-gray-600 rounded-lg w-28 animate-pulse"></div>
            </div>
         </div>

         <div className="flex items-center justify-between pt-3">
            <div className="flex items-center gap-5">
               <div className="flex flex-wrap items-center gap-4">
                  <div className="w-20 h-6 bg-gray-600 rounded-full"></div>
                  <div className="w-12 h-4 bg-gray-600 rounded"></div>
               </div>
               <div className="w-10 h-4 bg-gray-600 rounded"></div>
            </div>
            <div className="flex items-center gap-3">
               <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
               <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
               <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
            </div>
         </div>
         <div className="w-full px-6 pb-4 border-b border-gray-600" />
      </div>
   );
};

export default PostCardSkeleton;
