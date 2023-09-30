import { useEffect, useState } from "react";
import { useSingleHashtag } from "../../hooks/useFetchSingleHashtag";
import { useParams } from "react-router-dom";
import Navbar from "../../components/myComponents/global/Navbar";
import HashtagComp from "./Hashtag";

const Page = () => {
   const [hashtagId, setHashtagId] = useState<string | null | undefined>(null);
   const [hashtagName, setHashtagName] = useState<string | null | undefined>(
      null
   );
   const { id } = useParams();

   const { hashtag: hashtagData } = useSingleHashtag(id as string);

   useEffect(() => {
      setHashtagId(hashtagData?.id);
      setHashtagName(hashtagData?.name);
   }, [hashtagData]);

   return (
      <main className="px-6">
         {" "}
         <Navbar />
         <section className="pt-24">
            {" "}
            <HashtagComp />
            <div>{hashtagId}</div>
            <div className="py-20 font-black ">{hashtagName}</div>
         </section>
      </main>
   );
};

export default Page;
