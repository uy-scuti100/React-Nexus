import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
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
	const [combinedNotificationCount, setCombinedNotificationCount] = useState(0);
	const [showNotificationsModal, setShowNotificationsModal] = useState(false);

	const handleProfileClick = (e: { stopPropagation: () => void }) => {
		e.stopPropagation(); // Prevent click from bubbling up
		setSidenav((prev) => !prev);
	};

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

	const scrollToTop = () => {
		window.scrollTo({ top: 0 });
	};

	useEffect(() => {
		const followChannel = supabase
			.channel("realtime_follow_notifications")
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
			supabase.removeChannel(postChannel);
			supabase.removeChannel(followChannel);
		};
	}, [userId]);

	const toggleSideNav = () => {
		setSidenav((prev) => !prev);
	};

	const closeSideNav = () => {
		setSidenav(false);
	};

	// useEffect(() => {
	// 	// const handleOutsideClick = (event: MouseEvent) => {
	// 	// 	// @ts-ignore
	// 	// 	if (sidenavRef.current && !sidenavRef.current.contains(event.target)) {
	// 	// 		closeSideNav();
	// 	// 	}
	// 	// };

	// 	const handleScroll = () => {
	// 		closeSideNav();
	// 	};

	// 	document.addEventListener("mousedown", handleOutsideClick);
	// 	window.addEventListener("scroll", handleScroll);

	// 	return () => {
	// 		document.removeEventListener("mousedown", handleOutsideClick);
	// 		window.removeEventListener("scroll", handleScroll);
	// 	};
	// }, []);

	return (
		<>
			{showNotificationsModal && (
				<div className="fixed inset-0 z-50 h-screen backdrop-blur">
					<div className="fixed grid w-[95%] max-w-lg gap-4 p-6 duration-200 transform -translate-x-1/2 -translate-y-1/2 border rounded shadow-lg left-1/2 top-1/2 bg-background animate-in fade-in-0 ">
						<div className="h-[550px] overflow-auto fixed left-[50%] top-[50%] z-50  w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full">
							<div
								onClick={() => setShowNotificationsModal(false)}
								className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
							>
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
													deleteNotification={() => deleteNotification(id)}
													removeModal={() => setShowNotificationsModal(false)}
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
													removeModal={() => setShowNotificationsModal(false)}
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
									<div className="text-lg">You have no notifications</div>
								)}
							</div>
						</div>
					</div>
				</div>
			)}

			<nav className="fixed z-40 flex items-center justify-between  max-w-[1440px] px-6 w-full h-[57px] bg-white border-b border-black/20 dark:bg-background ">
				<div className="flex items-center gap-5">
					<h2
						className="text-3xl cursor-pointer md:text-4xl logo"
						onClick={() => {
							navigate("/posts");
							scrollToTop();
						}}
					>
						Nexus
					</h2>

					{/* <TooltipProvider>
                  <Tooltip>
                     <TooltipTrigger> */}
					<p
						className="hidden cursor-pointer md:block"
						onClick={() => navigate("/search")}
					>
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							aria-label="Search"
							className="cursor-pointer"
						>
							<title>Search</title>
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M4.1 11.06a6.95 6.95 0 1 1 13.9 0 6.95 6.95 0 0 1-13.9 0zm6.94-8.05a8.05 8.05 0 1 0 5.13 14.26l3.75 3.75a.56.56 0 1 0 .8-.79l-3.74-3.73A8.05 8.05 0 0 0 11.04 3v.01z"
								fill="currentColor"
							></path>
						</svg>
					</p>
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
						className={`${buttonVariants} px-4 text-lg transition-colors duration-300  border bg-black dark:bg-white text-white dark:text-black hover:text-black hover:bg-white hover:dark:text-white hover:dark:bg-black rounded-full `}
					>
						Sign in
					</Link>
				)}
				{user && (
					<div className="flex items-center gap-7">
						{user && (
							<>
								<Link
									to={user ? "/write" : "/"}
									onClick={() => {
										toggleSideNav();
										scrollToTop();
									}}
								>
									<li className="items-center hidden gap-4 cursor-pointer md:block hover:opacity-75">
										<svg
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											aria-label="Write"
										>
											<path
												d="M14 4a.5.5 0 0 0 0-1v1zm7 6a.5.5 0 0 0-1 0h1zm-7-7H4v1h10V3zM3 4v16h1V4H3zm1 17h16v-1H4v1zm17-1V10h-1v10h1zm-1 1a1 1 0 0 0 1-1h-1v1zM3 20a1 1 0 0 0 1 1v-1H3zM4 3a1 1 0 0 0-1 1h1V3z"
												fill="currentColor"
											></path>
											<title>Write</title>
											<path
												d="M17.5 4.5l-8.46 8.46a.25.25 0 0 0-.06.1l-.82 2.47c-.07.2.12.38.31.31l2.47-.82a.25.25 0 0 0 .1-.06L19.5 6.5m-2-2l2.32-2.32c.1-.1.26-.1.36 0l1.64 1.64c.1.1.1.26 0 .36L19.5 6.5m-2-2l2 2"
												stroke="currentColor"
											></path>
										</svg>
									</li>
								</Link>
								<Link to="/search" className="md:hidden">
									<li className="flex items-center gap-4 cursor-pointer hover:opacity-75">
										<svg
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											aria-label="Search"
											className="cursor-pointer"
										>
											<title>Search</title>
											<path
												fill-rule="evenodd"
												clip-rule="evenodd"
												d="M4.1 11.06a6.95 6.95 0 1 1 13.9 0 6.95 6.95 0 0 1-13.9 0zm6.94-8.05a8.05 8.05 0 1 0 5.13 14.26l3.75 3.75a.56.56 0 1 0 .8-.79l-3.74-3.73A8.05 8.05 0 0 0 11.04 3v.01z"
												fill="currentColor"
											></path>
										</svg>
									</li>
								</Link>
							</>
						)}

						{user && (
							<div
								className="relative"
								onClick={() => setShowNotificationsModal(true)}
							>
								{combinedNotificationCount !== null &&
									combinedNotificationCount > 0 && (
										<div className="absolute px-1 text-xs font-bold text-white rounded-sm shadow-2xl left-3 -top-3 bg-accent-orange shadow-white">
											{combinedNotificationCount}
										</div>
									)}
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									aria-label="Notifications"
									className="cursor-pointer"
								>
									<path
										d="M15 18.5a3 3 0 1 1-6 0"
										stroke="currentColor"
										stroke-linecap="round"
									></path>
									<title>Notifications</title>
									<path
										d="M5.5 10.53V9a6.5 6.5 0 0 1 13 0v1.53c0 1.42.56 2.78 1.57 3.79l.03.03c.26.26.4.6.4.97v2.93c0 .14-.11.25-.25.25H3.75a.25.25 0 0 1-.25-.25v-2.93c0-.37.14-.71.4-.97l.03-.03c1-1 1.57-2.37 1.57-3.79z"
										stroke="currentColor"
										stroke-linejoin="round"
									></path>
								</svg>
							</div>
						)}
						<div className="flex items-center">
							<img
								src={user ? (user?.display_pic as string) : "/avatar.jpg"}
								width={40}
								height={40}
								alt="user-profile-img"
								className="rounded-full border border-accent w-[40px] h-[40px]  hover:scale-110 transition duration-300 cursor-pointer object-cover"
								onClick={handleProfileClick}
							/>
							{/* {user && !sidenav ? (
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
							)} */}
						</div>
					</div>
				)}
			</nav>
		</>
	);
};

export default Navbar;
