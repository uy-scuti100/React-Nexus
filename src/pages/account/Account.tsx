import { useEffect, useState } from "react";
import { useFetchUser } from "../../hooks/useFetchUser";
import supabase from "../../lib/supabaseClient";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";

interface HashtagProp {
   user_id: string;
   hashtag_id: string;
   name: string;
}
interface HashtagIdProp {
   hashtag_id: string[];
}
const Account = () => {
   const { user, isLoading, isError } = useFetchUser();
   const [name, setName] = useState<string | null | undefined>("");
   const [userHashtags, setUserHashtags] = useState<HashtagProp[] | null>([]);
   const [id, setId] = useState<string | null | undefined>("");
   const [hashtagId, setHashtagId] = useState<HashtagIdProp>({
      hashtag_id: [],
   });

   const [email, setEmail] = useState<string | null | undefined>("");
   const [loggingOut, setLoggingOut] = useState(false);

   useEffect(() => {
      if (user) {
         const name = user?.fullName;
         const email = user?.email;
         const id = user?.id;
         setName(name);
         setId(id);
         setEmail(email);

         const fetchUserHashtags = async () => {
            let { data: user_hashtags, error } = await supabase
               .from("user_hashtags")
               .select("*")
               .eq("user_id", id);
            if (user_hashtags) {
               setUserHashtags(user_hashtags);
            }
         };
         fetchUserHashtags();
      }
   }, [user]);

   const logOff = async () => {
      setLoggingOut(true);
      try {
         const { error } = await supabase.auth.signOut();

         if (error) {
            console.error("Error signing out:", error);
         } else {
            window.location.href = "/";
         }
      } catch (error) {
         console.error("Error signing out:", error);
      }
   };

   return (
      <main className="px-6 pt-44">
         <h1>
            Your account {email} has an id {id} and name of {name}
         </h1>

         <div className="py-3 text-sm font-black">{name}'s hashtags are:</div>
         <ul className="flex flex-col gap-7">
            {userHashtags?.map((hashtag: HashtagProp, i: number) => {
               const { name, hashtag_id } = hashtag;
               return (
                  <Link key={i} to={`/hashtags/${hashtag_id}`}>
                     <li className="opacity-70">{name}</li>
                  </Link>
               );
            })}
         </ul>
         <div className="py-20">
            <Button onClick={logOff} disabled={loggingOut}>
               Log Out
            </Button>
         </div>
      </main>
   );
};

export default Account;
