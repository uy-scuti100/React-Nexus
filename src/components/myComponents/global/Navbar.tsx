import { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, ChevronUp, Mail, X } from "lucide-react";
import SideNav from "./SideNav";
import { Link, useNavigate } from "react-router-dom";
import { useFetchUser } from "../../../hooks/useFetchUser";
import { buttonVariants } from "../../ui/button";
import supabase from "../../../lib/supabaseClient";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
   FollowerNotification,
   PostNotification,
} from "./NotificationsComponent";
dayjs.extend(relativeTime);

interface CommonNotificationProps {
   id: string;
   created_at: string;
   profile_id: string | null;
   content: string | null;
   link: string | null;
   is_read: boolean;
}

interface NotificationProp extends CommonNotificationProps {
   follower_image: string | null;
}

interface PostNotificationProp extends CommonNotificationProps {
   notification_type: string;
   post_id: string;
   display_name: string | null;
   display_pic: string | null;
}

const Navbar = () => {
   const [sidenav, setSidenav] = useState(false);
   const navigate = useNavigate();
   const sidenavRef = useRef(null);
   const { user } = useFetchUser();
   const userId = user?.id;
   const [combinedNotifications, setCombinedNotifications] = useState<
      (NotificationProp | PostNotificationProp)[]
   >([]);
   const [combinedNotificationCount, setCombinedNotificationCount] =
      useState(0);
   const [showNotificationsModal, setShowNotificationsModal] = useState(false);

   useEffect(() => {
      const fetchCombinedNotifications = async () => {
         try {
            const { data: regularData, error: regularError } = await supabase
               .from("notifications")
               .select("*")
               .eq("profile_id", userId)
               .eq("is_read", false)
               .order("created_at", { ascending: false });

            const { data: postData, error: postError } = await supabase
               .from("post_notifications")
               .select("*")
               .eq("profile_id", userId)
               .eq("is_read", false)
               .order("created_at", { ascending: false });

            if (regularError || postError) {
               throw new Error("Failed to fetch notifications");
            }

            const combined = [...(regularData || []), ...(postData || [])];
            setCombinedNotifications(combined);
            setCombinedNotificationCount(combined.length);
         } catch (error) {
            console.error("Error fetching notifications:", error);
         }
      };

      if (userId) {
         fetchCombinedNotifications();
      }
   }, [userId]);

   const deletePostNotification = async (id: string) => {
      try {
         const { error } = await supabase
            .from("post_notifications")
            .delete()
            .eq("id", id);

         if (error) {
            throw new Error("Failed to delete notification");
         }

         setCombinedNotifications((prevNotifications) =>
            prevNotifications.filter((notification) => notification.id !== id)
         );

         setCombinedNotificationCount((prevCount) => prevCount - 1);

         toast.success("Notification deleted");
      } catch (error) {
         console.error("Error deleting notification:", error);
      }
   };
   const deleteNotification = async (id: string) => {
      try {
         const { error } = await supabase
            .from("notifications")
            .delete()
            .eq("id", id);

         if (error) {
            throw new Error("Failed to delete notification");
         }

         setCombinedNotifications((prevNotifications) =>
            prevNotifications.filter((notification) => notification.id !== id)
         );

         setCombinedNotificationCount((prevCount) => prevCount - 1);

         toast.success("Notification deleted");
      } catch (error) {
         console.error("Error deleting notification:", error);
      }
   };

   useEffect(() => {
      const channel = supabase
         .channel("realtime_notifications")
         .on(
            "postgres_changes",
            {
               event: "INSERT",
               schema: "public",
               table: "notifications",
               filter: `profile_id=eq.${userId}`,
            },
            (payload) => {
               setCombinedNotificationCount((prevCount) => prevCount + 1);
               setCombinedNotifications((prevNotifications) => [
                  ...prevNotifications,
                  payload.new as NotificationProp,
               ]);
            }
         )
         .subscribe();

      const postChannel = supabase
         .channel("realtime_post_notifications")
         .on(
            "postgres_changes",
            {
               event: "INSERT",
               schema: "public",
               table: "post_notifications",
               filter: `profile_id=eq.${userId}`,
            },
            (payload) => {
               setCombinedNotificationCount((prevCount) => prevCount + 1);
               setCombinedNotifications((prevNotifications) => [
                  ...prevNotifications,
                  payload.new as PostNotificationProp,
               ]);
            }
         )
         .subscribe();

      return () => {
         supabase.removeChannel(channel);
         supabase.removeChannel(postChannel);
      };
   }, [userId]);

   const toggleSideNav = () => {
      setSidenav((prev) => !prev);
   };

   const closeSideNav = () => {
      setSidenav(false);
   };

   useEffect(() => {
      const handleOutsideClick = (event: MouseEvent) => {
         // @ts-ignore
         if (sidenavRef.current && !sidenavRef.current.contains(event.target)) {
            closeSideNav();
         }
      };

      const handleScroll = () => {
         closeSideNav();
      };

      document.addEventListener("mousedown", handleOutsideClick);
      window.addEventListener("scroll", handleScroll);

      return () => {
         document.removeEventListener("mousedown", handleOutsideClick);
         window.removeEventListener("scroll", handleScroll);
      };
   }, []);

   return (
      <>
         {showNotificationsModal && (
            <div className="fixed inset-0 z-50 h-screen backdrop-blur">
               <div className="fixed grid w-[95%] max-w-lg gap-4 p-6 duration-200 transform -translate-x-1/2 -translate-y-1/2 border rounded shadow-lg left-1/2 top-1/2 bg-background animate-in fade-in-0 ">
                  <div className="h-[550px] overflow-auto fixed left-[50%] top-[50%] z-50  w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full">
                     <div
                        onClick={() => setShowNotificationsModal(false)}
                        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                        <X className="w-4 h-4 cursor-pointer" />
                        <span className="sr-only">Close</span>
                     </div>
                     <div className="text-left">
                        <div className="pb-2 text-lg">Notifications</div>
                        <div className="w-full px-6 border-b border-black/10 dark:border-white/10" />
                     </div>
                     <div className="flex flex-col gap-4 pt-5">
                        {combinedNotifications.length > 0 ? (
                           combinedNotifications.map((notification) => {
                              if ("follower_image" in notification) {
                                 // This is a regular notification
                                 const {
                                    id,
                                    link,
                                    content,
                                    created_at,
                                    is_read,
                                    follower_image,
                                    profile_id,
                                 } = notification;

                                 return (
                                    <FollowerNotification
                                       key={id}
                                       notification={{
                                          id,
                                          link,
                                          content,
                                          created_at,
                                          is_read,
                                          profile_id,
                                          follower_image,
                                       }}
                                       deleteNotification={() =>
                                          deleteNotification(id)
                                       }
                                       removeModal={() =>
                                          setShowNotificationsModal(false)
                                       }
                                    />
                                 );
                              } else if ("display_pic" in notification) {
                                 // This is a post notification
                                 const {
                                    id,
                                    link,
                                    content,
                                    created_at,
                                    is_read,
                                    display_pic,
                                    profile_id,
                                 } = notification;

                                 return (
                                    <PostNotification
                                       key={id}
                                       notification={{
                                          id,
                                          link,
                                          content,
                                          created_at,
                                          is_read,
                                          profile_id,
                                          display_pic,
                                       }}
                                       removeModal={() =>
                                          setShowNotificationsModal(false)
                                       }
                                       deletePostNotification={() =>
                                          deletePostNotification(id)
                                       }
                                    />
                                 );
                              }

                              // Handle other notification types here if needed
                              return null;
                           })
                        ) : (
                           <div className="text-lg">
                              You have no notifications
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         )}

         <nav className="fixed z-40 flex items-center self-center max-w-[1440px] justify-between w-full px-6 py-6 pt-6 bg-white border-b border-black/20 dark:bg-background ">
            <div
               className="text-3xl cursor-pointer md:text-4xl logo"
               onClick={() => navigate("/posts")}>
               Nexus
            </div>
            {user && (
               <div ref={sidenavRef}>
                  <SideNav
                     className={`${sidenav ? "right-0" : "-right-full"}`}
                     toggleSideNav={toggleSideNav}
                  />
               </div>
            )}
            {!user && (
               <Link
                  to="/"
                  className={`${buttonVariants} px-4 py-2 text-lg transition-colors duration-300 rounded-3xl border bg-black dark:bg-white text-white dark:text-black hover:bg-white hover:dark:text-white hover:dark:bg-black `}>
                  Sign in
               </Link>
            )}
            {user && (
               <div className="flex items-center gap-7">
                  <Link to="/posts">
                     <Mail />
                  </Link>
                  {user && (
                     <div
                        className="relative"
                        onClick={() => setShowNotificationsModal(true)}>
                        {combinedNotificationCount !== null &&
                           combinedNotificationCount > 0 && (
                              <div className="absolute px-1 text-xs font-bold text-white rounded-sm shadow-2xl left-3 -top-3 bg-accent-orange shadow-white">
                                 {combinedNotificationCount}
                              </div>
                           )}
                        <Bell className="cursor-pointer" />
                     </div>
                  )}
                  <div className="flex items-center">
                     <img
                        src={
                           user ? (user?.display_pic as string) : "/avatar.jpg"
                        }
                        width={40}
                        height={40}
                        alt="user-profile-img"
                        className="rounded-full border border-accent w-[40px] h-[40px]  hover:scale-110 transition duration-300 cursor-pointer object-cover"
                     />
                     {user && !sidenav ? (
                        <ChevronDown
                           className={`${
                              sidenav ? "rotate-180" : "rotate-0"
                           }  transition-transform duration-500 cursor-pointer ml-4 ${
                              sidenav && "hidden"
                           }`}
                           onClick={() => setSidenav(true)}
                        />
                     ) : (
                        <ChevronUp
                           className={`transition-transform duration-500 cursor-pointer ml-4 ${
                              !sidenav && "hidden"
                           }`}
                           onClick={() => setSidenav(false)}
                        />
                     )}
                  </div>
               </div>
            )}
         </nav>
      </>
   );
};

export default Navbar;
