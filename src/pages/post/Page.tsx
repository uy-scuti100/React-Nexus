import { useNavigate } from "react-router-dom";
import Navbar from "../../components/myComponents/global/Navbar";
import { useFetchSinglePost } from "../../hooks/useFetchSinglePost";
import Content from "./Content";

const Post = () => {
   const pathname = window.location.pathname;
   const id = pathname.split("/")[2];
   const navigate = useNavigate();
   const { post, isError, isLoading } = useFetchSinglePost(id);

   if (isLoading) {
      return <div>Loading</div>;
   }

   if (isError) {
      // Check if post is null to handle the case where it doesn't exist
      if (post === null) {
         navigate("/posts");
         return <div>Post not found</div>;
      }

      // Handle other errors here
      return <div>Error fetching post</div>;
   }

   return (
      <main className="relative leading-7">
         <Navbar />
         <div className="gap-10 px-6 pt-32 mb-5 md:px-32">
            <div className="">
               <Content post={post} loading={isLoading} />
            </div>
         </div>
      </main>
   );
};

export default Post;
