import Navbar from "../../components/myComponents/global/Navbar";
import PostCardSkeleton from "../../components/myComponents/skeletons/PostCardSkeleton";

const Page = () => {
   return (
      <main>
         <Navbar />
         <div className="pt-32 px-6">
            <PostCardSkeleton />
         </div>
      </main>
   );
};

export default Page;

{
   /* <div className="fixed bottom-0 left-0 right-0 flex items-center justify-center bg-white top-20">
<div className="relative w-full md:w-[500px] h-[500px]">
   <img
      src="/internalerror.svg"
      alt="loading-image"
      className="object-cover"
   />
</div>
</div> */
}
