import {
   HoverCard,
   HoverCardContent,
   HoverCardTrigger,
} from "../../components/ui/hover-card";
import {
   Avatar,
   AvatarFallback,
   AvatarImage,
} from "../../components/ui/avatar";
import { Link } from "react-router-dom";
import { useFetchUser } from "../../hooks/useFetchUser";
import { CalendarIcon } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const dateFormatter = new Intl.DateTimeFormat(undefined, {
   dateStyle: "medium",
});

interface HoverCardprops {
   profile_id: string;
   author_image: string;
   author: string;
   isFollowing: boolean;
   isAuthorized: boolean | undefined;
   handleFollow: () => void;
   username: string;
   followingCount: number;
   followersCount: number;
   joinedDate: string;
   bio: string;
}

const scrollToTop = () => {
   window.scrollTo({ top: 0, behavior: "smooth" });
};
const Hover = ({
   author,
   author_image,
   isAuthorized,
   isFollowing,
   username,
   followersCount,
   followingCount,
   handleFollow,
   joinedDate,
   bio,
   profile_id,
}: HoverCardprops) => {
   const { user } = useFetchUser();
   const userId = user?.id;
   return (
      <HoverCard>
         <HoverCardTrigger asChild>
            <Link
               to={`/account/${profile_id}`}
               className="flex items-center gap-3 capitalize"
               onClick={scrollToTop}>
               <img
                  src={author_image}
                  width={24}
                  height={24}
                  alt="user-profile-img"
                  className="object-cover border  w-[24px] h-[24px]  rounded-full cursor-pointer border-accent"
               />
               <div className="flex items-center gap-2 text-sm">
                  <p>{author} </p>
                  <span>
                     {isAuthorized && (
                        <img
                           src="/bluecheck-removebg-preview.png"
                           alt="checkmark"
                           height={16}
                           width={16}
                        />
                     )}
                  </span>
               </div>
            </Link>
         </HoverCardTrigger>
         <HoverCardContent className="w-[380px]">
            <div className="flex space-x-4">
               <Link to={`/account/${profile_id}`} onClick={scrollToTop}>
                  <Avatar>
                     <AvatarImage src={author_image} className="object-cover" />
                     <AvatarFallback className="uppercase">
                        {author.substring(0, 2)}
                     </AvatarFallback>
                  </Avatar>
               </Link>
               <div className="space-y-1">
                  <div className="flex justify-between gap-5">
                     <Link to={`/account/${profile_id}`} onClick={scrollToTop}>
                        <h4 className="font-semibold">{author}</h4>
                     </Link>
                     {profile_id !== userId && (
                        <button
                           onClick={handleFollow}
                           type="submit"
                           className="justify-end px-4 py-1 font-semibold bg-accent-red hover:bg-wh-500 text-wh-10 dark:text-black">
                           {isFollowing ? "Unfollow" : "Follow"}
                        </button>
                     )}
                  </div>
                  <Link to={`/account/${profile_id}`} onClick={scrollToTop}>
                     <h4 className="text-xs opacity-90">{username}</h4>
                  </Link>
                  <p className="pt-2 text-sm">{bio}</p>
                  <div className="flex gap-3 py-2 text-sm">
                     <p className="font-bold ">
                        {followersCount}{" "}
                        <span className="opacity-50">Followers</span>{" "}
                     </p>
                     <p className="font-bold">
                        {followingCount}{" "}
                        <span className="opacity-50">Following</span>{" "}
                     </p>
                  </div>
                  <div className="flex items-center pt-2">
                     <CalendarIcon className="w-4 h-4 mr-2 opacity-70" />
                     <span className="text-xs text-muted-foreground">
                        <p suppressHydrationWarning>
                           {joinedDate && (
                              <div className="flex items-center gap-2">
                                 <p>
                                    Joined on{" "}
                                    {dateFormatter.format(new Date(joinedDate))}
                                 </p>
                                 <p
                                    suppressHydrationWarning
                                    className="text-[10px]">
                                    {" "}
                                    (
                                    {dayjs().diff(joinedDate, "seconds", true) <
                                    30
                                       ? "just now"
                                       : dayjs(joinedDate).fromNow()}
                                    )
                                 </p>
                              </div>
                           )}
                        </p>
                     </span>
                  </div>
               </div>
            </div>
         </HoverCardContent>
      </HoverCard>
   );
};

export default Hover;
