import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

interface CommonNotificationProps {
   id: string;
   created_at: string;
   profile_id: string | null;
   content: string | null;
   link: string | null;
   is_read: boolean;
   follower_image: string | null;
}

interface PostNotificationProp {
   id: string;
   created_at: string;
   profile_id: string | null;
   content: string | null;
   link: string | null;
   is_read: boolean;
   display_pic: string | null;
}
// Follower Notification Component
export const FollowerNotification = ({
   notification,
   deleteNotification,
   removeModal,
}: {
   notification: CommonNotificationProps;
   deleteNotification: (id: string | null) => void;
   removeModal: () => void;
}) => {
   const message = notification.content?.split("-")[0];
   const follower = notification.content?.split("-")[1];
   return (
      <div key={notification.id} className="flex items-center justify-between">
         <Link
            to={`${notification.link}`}
            className="flex items-center"
            onClick={removeModal}>
            {notification.follower_image && (
               <img
                  src={notification.follower_image}
                  width={50}
                  height={50}
                  alt="follower_image"
                  className="w-[50px] h-[50px] rounded-full"
               />
            )}
            <div className="flex flex-col gap-2 ml-3">
               <p className="text-sm md:text-base">{message}</p>
               <p className="text-sm md:text-base">{follower}</p>
            </div>
         </Link>
         <div
            onClick={() => deleteNotification(notification.id)}
            className="flex flex-col gap-2">
            <button className="w-full px-2 py-2 mt-5 text-xs font-semibold text-black rounded-full md:w-auto bg-accent-red whitespace-nowrap ">
               Mark as Read
            </button>
            <p suppressHydrationWarning className="text-[12px]">
               {dayjs().diff(notification.created_at, "seconds", true) < 30
                  ? "just now"
                  : dayjs(notification.created_at).fromNow()}
            </p>
         </div>
      </div>
   );
};

// Post Notification Component
export const PostNotification = ({
   notification,
   deletePostNotification,
   removeModal,
}: {
   notification: PostNotificationProp;
   deletePostNotification: (id: string) => void;
   removeModal: () => void;
}) => {
   return (
      <div key={notification.id} className="flex items-center justify-between">
         <Link
            onClick={removeModal}
            to={`${notification.link}`}
            className="flex items-center justify-between">
            {notification.display_pic && (
               <img
                  src={notification.display_pic}
                  width={50}
                  height={50}
                  alt="display_pic"
                  className="w-[50px] h-[50px] rounded-full"
               />
            )}
            <div className="flex flex-col gap-1 ml-3 ">
               <p className="text-sm md:text-base">{notification.content}</p>
               <p suppressHydrationWarning className="text-[12px] opacity-50">
                  {dayjs().diff(notification.created_at, "seconds", true) < 30
                     ? "just now"
                     : dayjs(notification.created_at).fromNow()}
               </p>
            </div>
         </Link>
         <div
            onClick={() => deletePostNotification(notification.id)}
            className="self-baseline">
            <button className="w-full px-2 py-2 mt-5 text-xs font-semibold text-black rounded-full md:w-auto bg-accent-red whitespace-nowrap ">
               Mark as Read
            </button>
         </div>
      </div>
   );
};
