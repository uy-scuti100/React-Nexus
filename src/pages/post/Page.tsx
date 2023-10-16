import { useParams } from "react-router-dom";
import Navbar from "../../components/myComponents/global/Navbar";
import { useFetchSinglePost } from "../../hooks/useFetchSinglePost";
import Content from "./Content";

const Post = () => {
   const { id } = useParams();
   const { post, isError, isLoading } = useFetchSinglePost(id as string);

   return (
      <main className="relative leading-7">
         <Navbar />
         <div className="gap-10 px-6 pt-24 mb-5 md:px-32">
            <div className="max-w-[43rem] mx-auto">
               <Content post={post} loading={isLoading} />
            </div>
         </div>
      </main>
   );
};

export default Post;
