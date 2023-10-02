import { useEffect, useState } from "react";

import supabase from "../../lib/supabaseClient";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import {
   CalendarPlus,
   ExternalLink,
   Hash,
   Mail,
   MapPin,
   MessageSquare,
   ScrollText,
   Verified,
} from "lucide-react";
import { fetchSingleProfile } from "../../lib/fetchSingleProfile";
import { User } from "../../../types";

interface HashtagProp {
   user_id: string;
   hashtag_id: string;
   name: string;
}
// interface HashtagIdProp {
//    hashtag_id: string[];
// }

const dateFormatter = new Intl.DateTimeFormat(undefined, {
   dateStyle: "medium",
});

const Account = () => {
   const { id: paramsId } = useParams();
   const navigate = useNavigate();
   const [user, setUser] = useState<User | null | undefined>(null);
   const [name, setName] = useState<string | null | undefined>("");
   const [userHashtags, setUserHashtags] = useState<HashtagProp[] | null>([]);
   const [email, setEmail] = useState<string | null | undefined>("");
   const [showMoreDetails, setShowMoreDetails] = useState(false);
   const [avatar, setAvatar] = useState("");
   const [bio, setBio] = useState<string | null | undefined>("");
   const [postCount, setPostCount] = useState<number | null | undefined>(null);
   const [tagsCount, setTagsCount] = useState<number | null | undefined>(null);
   const [username, setUsername] = useState<string | null | undefined>(null);
   const [id, setId] = useState<string | null | undefined>(null);
   const [joinedDate, setJoinedDate] = useState<string | null | undefined>(
      null
   );
   const [location, setLocation] = useState<string | null | undefined>(null);
   const [website, setWebsite] = useState<string | null | undefined>(null);
   const [skills, setSkills] = useState<string | null | undefined>(null);
   const [learning, setLearning] = useState<string | null | undefined>(null);
   const [building, setBuilding] = useState<string | null | undefined>(null);
   const [availability, setAvailability] = useState<string | null | undefined>(
      null
   );
   const [bannerPic, setBannerPic] = useState<string | null | undefined>(null);
   const [isVerified, setIsVerified] = useState<boolean | null | undefined>(
      null
   );
   const [commentCount, setCommentCount] = useState<number | null | undefined>(
      null
   );

   const handleShowMore = () => {
      setShowMoreDetails(true);
   };

   useEffect(() => {
      if (user) {
         const name = user?.display_name;
         const image = user?.display_pic;
         const email = user?.email;
         const id = user?.id;
         const bio = user?.bio;
         setAvatar(image as string);
         setName(name);
         setBio(bio);
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

   useEffect(() => {
      if (id) {
         const fetchData = async () => {
            try {
               // Fetch comment count
               const { data: commentCount, error: commentError } =
                  await supabase
                     .from("comments")
                     .select("count", { count: "exact" })
                     .eq("profile_id", id);

               if (commentCount) {
                  setCommentCount(commentCount[0].count);
               }
               if (commentError) {
                  console.error(
                     "Error fetching comment count:",
                     commentError.message
                  );
               }

               // Fetch post count
               const { data: postCount, error: postError } = await supabase
                  .from("posts")
                  .select("count", { count: "exact" })
                  .eq("profile_id", id);

               if (postCount) {
                  setPostCount(postCount[0].count);
               }
               if (postError) {
                  console.error(
                     "Error fetching post count:",
                     postError.message
                  );
               }

               // Fetch tags count
               const { data: tagsCount, error: tagsError } = await supabase
                  .from("user_hashtags")
                  .select("count", { count: "exact" })
                  .eq("user_id", id);

               if (tagsCount) {
                  setTagsCount(tagsCount[0].count);
               }
               if (tagsError) {
                  console.error(
                     "Error fetching tags count:",
                     tagsError.message
                  );
               }
            } catch (err) {
               console.error("Unexpected error:", err);
            }
         };

         fetchData();
      }
   }, [id]);

   useEffect(() => {
      const fetchData = async () => {
         const userData = await fetchSingleProfile(paramsId as string);
         if (userData !== null) {
            setUser(userData);
            setUsername(userData.username);
            setId(userData.id);
            setJoinedDate(userData.created_at);
            setLocation(userData.location);
            setWebsite(userData.website);
            setSkills(userData.skills_and_languages);
            setLearning(userData.currently_learning);
            setBuilding(userData.currently_building);
            setAvailability(userData.availability);
            setBannerPic(userData.banner_pic);
            setIsVerified(userData.isVerified?.valueOf());
         } else {
            // Handle the case where user data is not found
            console.error("User not found");
         }
      };

      fetchData();
   }, [paramsId]);

   return (
      <main className="pt-24">
         <div className="relative flex w-full h-52">
            <img
               src={bannerPic as string}
               alt="banner"
               className="object-cover w-full h-full"
            />
            <div className="absolute flex items-end justify-center w-full p-4 -bottom-20 ">
               <div className=" w-36 h-36 overflow-hidden border-[5px] border-white/40 rounded-full">
                  <img
                     src={avatar}
                     alt={`${name}'s profile image`}
                     className="object-cover w-full h-full"
                  />
               </div>
            </div>
         </div>
         <div className="px-3 mt-24 mb-8 ">
            <Button className="w-full md:w-auto md:hidden">Edit profile</Button>
         </div>
         <div className="max-w-5xl px-3 py-8 mx-2 mb-4 rounded bg-background md:px-4 md:mx-4 lg:mx-auto text-foreground">
            <div className="items-center md:flex md:justify-between">
               <h1 className="flex items-center gap-1 text-2xl font-bold text-center md:text-left">
                  <span>{name}</span>
                  <span>
                     {isVerified && <Verified className="w-6 h-6 ml-4" />}
                  </span>
               </h1>
               <Button className="hidden w-full md:w-auto md:block">
                  Edit profile
               </Button>
            </div>
            <p className="pb-6 opacity-75">@{username}</p>
            <div className="w-full px-6 border-b border-black/10 dark:border-white/10" />
            <p className="pt-6 pb-12 text-lg leading-8 md:text-center">{bio}</p>

            <div className="w-full px-6 border-b border-black/10 dark:border-white/10" />

            <div className="flex flex-col gap-8 py-8 md:flex-row md:flex-wrap md:justify-center">
               <div className="flex gap-4">
                  <MapPin className="w-6 h-6" />
                  <p>{location}</p>
               </div>
               <div className="flex gap-2">
                  <CalendarPlus className="w-6 h-6" />
                  <p suppressHydrationWarning>
                     {joinedDate && (
                        <div className="flex items-center gap-3">
                           <p>
                              Joined on{" "}
                              {dateFormatter.format(new Date(joinedDate))}
                           </p>
                           <p suppressHydrationWarning>
                              {" "}
                              (
                              {dayjs().diff(joinedDate, "seconds", true) < 30
                                 ? "just now"
                                 : dayjs(joinedDate).fromNow()}
                              )
                           </p>
                        </div>
                     )}
                  </p>
               </div>

               <Link to={`mailto:${email}`} className="flex gap-4">
                  <Mail className="w-6 h-6" />
                  <p>{email}</p>
               </Link>
               <div className="flex gap-4">
                  <ExternalLink className="w-6 h-6" />
                  <p>{website}</p>
               </div>
            </div>
            {/* mobile only */}
            <div
               className={`px-3 pt-8 mx-2 mb-4 transition-all duration-700 ease-in rounded bg-background text-foreground opacity-0 h-0 md:hidden ${
                  showMoreDetails && "opacity-100 h-auto"
               }`}>
               <h3 className="font-bold">Skills/Languages: </h3>
               <div className="py-4 my-3 border-y border-black/10 dark:border-white/10">
                  {skills}
               </div>
               <h3 className="font-bold">Currently learning: </h3>
               <div className="py-4 my-3 border-y border-black/10 dark:border-white/10">
                  {learning}
               </div>
               <h3 className="font-bold">Currently building</h3>
               <div className="py-4 my-3 border-y border-black/1 dark:border-white/10">
                  {building}
               </div>
               <h3 className="font-bold">Available for: </h3>
               <div className="py-4 my-3 border-y border-black/10 dark:border-white/10">
                  {availability}
               </div>

               <div className="flex flex-col pt-3 gap-7">
                  <p className="flex items-center gap-3">
                     <ScrollText className="opacity-70" />
                     <p>{postCount} posts published</p>
                  </p>
                  <p className="flex items-center gap-3">
                     <MessageSquare className="opacity-70" />
                     <p>{commentCount} comment(s) written</p>
                  </p>
                  <p className="flex items-center gap-3">
                     <Hash className="opacity-70" />
                     <p>{tagsCount} tags followed</p>
                  </p>
               </div>
            </div>
            <Button
               variant="outline"
               className={`w-full text-base md:hidden ${
                  showMoreDetails && "hidden"
               } `}
               onClick={handleShowMore}>
               More info about {username}
            </Button>
            {/* end here  */}
         </div>
         <div className="relative max-w-5xl grid-cols-3 pt-10 pb-10 md:grid md:mx-4 lg:mx-auto">
            <div className="col-span-1 px-3 py-4 mx-2 mb-4 rounded md:mx-0 bg-background text-foreground sticky top-[100px] hidden md:block h-[700px]">
               <h3 className="font-bold">Skills/Languages: </h3>
               <div className="py-4 my-3 border-y border-black/10 dark:border-white/10">
                  {skills}
               </div>
               <h3 className="font-bold">Currently learning: </h3>
               <div className="py-4 my-3 border-y border-black/10 dark:border-white/10">
                  {learning}
               </div>
               <h3 className="font-bold">Currently building</h3>
               <div className="py-4 my-3 border-y border-black/1 dark:border-white/10">
                  {building}
               </div>
               <h3 className="font-bold">Available for: </h3>
               <div className="py-4 my-3 border-y border-black/10 dark:border-white/10">
                  {availability}
               </div>

               <div className="flex flex-col pt-3 gap-7">
                  <p className="flex items-center gap-3">
                     <ScrollText className="opacity-70" />
                     <p>{postCount} posts published</p>
                  </p>
                  <p className="flex items-center gap-3">
                     <MessageSquare className="opacity-70" />
                     <p>{commentCount} comment(s) written</p>
                  </p>
                  <p className="flex items-center gap-3">
                     <Hash className="opacity-70" />
                     <p>{tagsCount} tags followed</p>
                  </p>
               </div>
            </div>
            <div className="col-span-2 px-3">
               {" "}
               users' posts Lorem ipsum dolor sit amet consectetur adipisicing
               elit. Voluptatibus, minus? Magni impedit voluptatem rem a velit
               sint eligendi provident adipisci eos, tenetur at unde illo
               suscipit nisi minus accusantium, quidem, voluptatum molestias
               atque laborum necessitatibus perspiciatis cumque. Laborum facilis
               placeat minus nihil fuga suscipit voluptatibus libero
               perferendis, pariatur veniam! Reiciendis officia, distinctio
               mollitia earum dolorum veniam asperiores atque eveniet ipsum,
               expedita voluptates minima repellat tempore fuga dolores. Error
               ducimus ipsam voluptate, rem, vel ratione quasi odit, ullam
               necessitatibus doloremque quo sit iste sunt inventore? Cum dicta
               possimus commodi nam officiis expedita unde adipisci autem
               laudantium, mollitia eligendi, aliquid odio. Nostrum, quos
               tempora laudantium recusandae vero quasi illo ut ad beatae
               voluptate. Repellendus voluptatibus quaerat a reprehenderit ab
               Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tenetur
               eaque ex cum reprehenderit neque a aut unde nisi quia obcaecati
               pariatur deleniti odio dolorem magni, modi ipsam eos sequi
               architecto nam consectetur et? Laudantium odio nobis unde eaque
               animi, iste aliquam quasi cum ullam odit neque blanditiis minima
               quisquam quaerat, eveniet facere quia incidunt dolorem cumque qui
               asperiores officia delectus esse quibusdam. Deleniti, maxime,
               quas quasi error sint quia repudiandae, non officiis odit
               voluptatum fuga ullam autem neque? Voluptate deleniti quam
               mollitia quo quibusdam quidem ipsum repellendus sapiente quas
               doloremque. Magni ad inventore, nihil iste explicabo ratione in
               provident officia laboriosam, aspernatur nemo error possimus!
               Accusantium quo consequuntur nulla voluptas odio voluptate nam
               facere necessitatibus? Itaque, sunt repellat facilis blanditiis
               deserunt similique nemo provident qui quis id delectus nisi
               suscipit in harum illum impedit debitis hic. Nulla tempora
               impedit quasi nisi enim recusandae possimus consequatur eligendi
               nesciunt, labore vel corporis est nobis minima iste eos nam quis
               non numquam aliquid porro velit. Dolore repellat voluptas,
               molestiae nihil voluptatem excepturi eos culpa quam, ratione quod
               voluptatum, tempore ducimus aliquid enim eligendi eveniet eum
               iure facilis. Sunt deserunt dolorum eius possimus! Exercitationem
               esse minus odit! Repellendus quasi, dolores error nobis
               laboriosam illo, aspernatur assumenda quae facilis quidem
               dolorum. Aspernatur rem laudantium quae eaque sapiente dolor,
               perspiciatis voluptates tempora quisquam iste laboriosam aliquam
               ipsam. Voluptates incidunt eum sapiente assumenda nostrum
               expedita minima sequi veritatis maiores inventore provident modi
               nihil repellendus similique, distinctio maxime nulla enim ut
               dolore quam debitis et unde. Corporis est molestias tenetur iusto
               velit officiis possimus ex, quia delectus vitae cumque asperiores
               dolore, suscipit atque odio aut? Nemo exercitationem ut tempora
               id! Optio a, corrupti repellat recusandae itaque expedita
               necessitatibus cum sint magni aut ut animi asperiores tenetur
               soluta unde, porro quia iste adipisci cupiditate, molestiae earum
               dolor ipsum. Minus, tempore soluta fugiat nobis, vero id laborum
               reiciendis modi cupiditate nisi, voluptatem iure corporis!
               Eligendi neque autem beatae. Debitis totam nostrum aliquam
               eligendi pariatur, voluptas consectetur rem quas quidem saepe
               provident. Quisquam minima aperiam vero magni suscipit autem eius
               cupiditate neque illum eligendi natus fuga sapiente blanditiis
               officia nobis vel veniam ex, cumque expedita voluptate molestiae
               labore itaque amet temporibus. Adipisci debitis nulla asperiores
               cupiditate magni eveniet voluptatum ducimus amet iste nobis
               incidunt voluptatibus itaque deserunt voluptates quibusdam,
               libero rem! Expedita autem eius, officiis natus quos fugiat a.
               Totam, optio. Minus, eum. Numquam voluptates molestias
               consectetur natus quam quidem iste, tenetur voluptatibus magnam
               quas laborum quis impedit dolores molestiae placeat nemo culpa
               dignissimos veniam, repellat deleniti eum maxime? Quas similique
               veritatis laudantium atque id consectetur, molestias omnis vitae
               impedit repellendus facere ad, adipisci error perferendis commodi
               mollitia nisi, exercitationem blanditiis harum sed explicabo
               aliquid fuga. Iusto, nam. Nulla, sint. Sunt dolores sint deserunt
               obcaecati quo at provident quod quidem. Ipsa repudiandae aliquid
               iure ad quaerat dolore inventore quasi error quos nisi porro
               veritatis totam consequuntur, suscipit sunt? Deserunt nam illum
               fuga velit non totam tempora nesciunt in error, pariatur expedita
               quam esse a aspernatur rem, alias architecto eos aliquid optio
               inventore ipsa. Corrupti omnis magnam explicabo libero ea
               consectetur cupiditate, aperiam tempore, numquam doloremque quam
               velit, culpa ab illum tempora? Aspernatur adipisci magni nesciunt
               quos commodi, excepturi fugiat expedita pariatur aut illum
               exercitationem quibusdam aliquid dolore doloremque, rem vero
               molestias laudantium optio ducimus quis sint fugit? Consectetur
               nam corporis minus temporibus voluptatibus, iusto et explicabo
               perferendis reiciendis nesciunt, aliquam obcaecati unde facere
               corrupti repudiandae voluptates! Dolorum voluptatibus nesciunt
               unde vel sequi, nisi quisquam est, rerum, ex non quibusdam autem
               facere veniam? Assumenda, unde eveniet, alias magni tenetur
               placeat laudantium pariatur delectus nesciunt autem porro! Unde
               omnis minus voluptatibus obcaecati blanditiis.
            </div>
         </div>
      </main>
   );
};
export default Account;

// <ul className="flex flex-col gap-7">
//                {userHashtags?.map((hashtag: HashtagProp, i: number) => {
//                   const { name, hashtag_id } = hashtag;
//                   return (
//                      <Button key={i} to={`/hashtags/${hashtag_id}`}>
//                         <li className={`${buttonVariants}`}>{name}</li>
//                      </Button>
//                   );
//                })}
//             </ul>
//             <div className="py-20">
//                <Button onClick={logOff} disabled={loggingOut}>
//                   Log Out
//                </Button>
// </div>

// const logOff = async () => {
//    setLoggingOut(true);
//    try {
//       const { error } = await supabase.auth.signOut();

//       if (error) {
//          console.error("Error signing out:", error);
//       } else {
//          navigate("/");
//       }
//    } catch (error) {
//       console.error("Error signing out:", error);
//    }
// };
