import PostCardSkeleton from "../../components/myComponents/skeletons/PostCardSkeleton";

const AccountSkeleton = () => {
   const skeletonElements = Array.from({ length: 3 }, (_, index) => (
      <PostCardSkeleton key={index} />
   ));

   return (
      <main className="pt-24">
         <div className="relative flex w-full h-52">
            {/* Skeleton loader for the banner image */}
            <div className="w-full h-full duration-300 animate-pulse bg-wh-300"></div>
            <div className="absolute flex items-end justify-center w-full p-4 -bottom-20">
               {/* Skeleton loader for the profile image */}
               <div className="duration-300 rounded-full animate-pulse bg-wh-300 w-36 h-36"></div>
            </div>
         </div>

         <div className="px-3 mt-24 mb-8">
            {/* Skeleton loader for the "Edit profile" button */}
            <div className="w-full px-5 py-2 mt-5 font-semibold duration-300 animate-pulse bg-wh-300 md:hidden md:w-auto"></div>
         </div>

         <div className="px-3 mt-24 mb-8">
            {/* Skeleton loader for the "Follow/Unfollow" button */}
            <div className="w-full px-5 py-2 mt-5 font-semibold duration-300 animate-pulse bg-wh-300 md:hidden md:w-auto"></div>
         </div>

         <div className="max-w-5xl px-3 py-8 mx-3 mb-4 rounded bg-background md:px-4 md:mx-4 lg:mx-auto text-foreground">
            {/* Skeleton loader for user information */}
            <div className="w-3/4 h-6 mb-3 duration-300 animate-pulse bg-wh-300"></div>
            <div className="w-1/2 h-6 mb-3 duration-300 animate-pulse bg-wh-300"></div>
            <div className="w-full h-6 mb-3 duration-300 animate-pulse bg-wh-300"></div>

            {/* Skeleton loader for follower and following counts */}
            <div className="w-1/4 h-6 mb-3 duration-300 animate-pulse bg-wh-300"></div>
            <div className="w-1/4 h-6 mb-3 duration-300 animate-pulse bg-wh-300"></div>

            {/* Skeleton loader for bio */}
            <div className="w-full h-20 mb-6 duration-300 animate-pulse bg-wh-300"></div>

            {/* Skeleton loader for user details */}
            <div className="w-1/4 h-6 mb-3 duration-300 animate-pulse bg-wh-300"></div>
            <div className="w-1/4 h-6 mb-3 duration-300 animate-pulse bg-wh-300"></div>
            <div className="w-1/4 h-6 mb-3 duration-300 animate-pulse bg-wh-300"></div>
         </div>

         {/* Skeleton loader for user details (mobile only) */}
         <div
            className={`px-3 pt-8 mx-2 mb-4 transition-all duration-700 ease-in rounded bg-background text-foreground opacity-0 h-0 md:hidden`}>
            {/* Skeleton loader for skills */}
            <div className="w-full h-16 mb-3 duration-300 animate-pulse bg-wh-300"></div>

            {/* Skeleton loader for currently learning */}
            <div className="w-full h-16 mb-3 duration-300 animate-pulse bg-wh-300"></div>

            {/* Skeleton loader for currently building */}
            <div className="w-full h-16 mb-3 duration-300 animate-pulse bg-wh-300"></div>

            {/* Skeleton loader for available for */}
            <div className="w-full h-16 mb-3 duration-300 animate-pulse bg-wh-300"></div>

            {/* Skeleton loader for post, comment, and tags counts */}
            <div className="w-1/3 h-6 mb-3 duration-300 animate-pulse bg-wh-300"></div>
            <div className="w-1/3 h-6 mb-3 duration-300 animate-pulse bg-wh-300"></div>
            <div className="w-1/3 h-6 mb-3 duration-300 animate-pulse bg-wh-300"></div>
         </div>

         <div className="relative max-w-5xl grid-cols-3 gap-4 py-6 pb-32 md:grid md:mx-4 lg:mx-auto">
            <div className="col-span-1 px-1 mx-2 mb-4 md:mx-0 text-foreground md:sticky md:top-[100px] hidden md:block ml-3">
               {/* Skeleton loader for skills */}
               <div className="w-full h-16 mb-3 duration-300 animate-pulse bg-wh-300"></div>

               {/* Skeleton loader for currently learning */}
               <div className="w-full h-16 mb-3 duration-300 animate-pulse bg-wh-300"></div>

               {/* Skeleton loader for currently building */}
               <div className="w-full h-16 mb-3 duration-300 animate-pulse bg-wh-300"></div>

               {/* Skeleton loader for available for */}
               <div className="w-full h-16 mb-3 duration-300 animate-pulse bg-wh-300"></div>

               {/* Skeleton loader for post, comment, and tags counts */}
               <div className="w-1/3 h-6 mb-3 duration-300 animate-pulse bg-wh-300"></div>
               <div className="w-1/3 h-6 mb-3 duration-300 animate-pulse bg-wh-300"></div>
               <div className="w-1/3 h-6 mb-3 duration-300 animate-pulse bg-wh-300"></div>
            </div>

            <div className="col-span-2 px-3 pt-10 pb-24 mr-3 rounded bg-background">
               {/* Skeleton loader for posts */}

               {skeletonElements}
            </div>
         </div>
      </main>
   );
};

export default AccountSkeleton;
