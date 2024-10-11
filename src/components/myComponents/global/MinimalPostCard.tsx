import {
	Copy,
	Edit,
	Heart,
	MessageCircle,
	MoreHorizontal,
	MoreVertical,
	Pin,
	Trash,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import supabase from "../../../lib/supabaseClient";
import { useTheme } from "../../providers/theme/theme-provider";
import { useFetchUser } from "../../../hooks/useFetchUser";
import { Badge } from "../../ui/badge";
import Hover from "../../../pages/posts/Hover";

dayjs.extend(relativeTime);

const dateFormatter = new Intl.DateTimeFormat(undefined, {
	dateStyle: "medium",
});

interface PostCardProp {
	author: string;
	id: string;
	image: string;
	snippet: string;
	title: string;
	created_at: string;
	author_image: string;
	bookmark_count: number;
	likes_count: number;
	comment_count: number;
	profile_id: string;
	category_Ids: string[];
	readTime: number;
	content: string;
}

const MinimalPostCard = ({
	author,
	id,
	image,
	snippet,
	title,
	created_at,
	author_image,
	bookmark_count,
	likes_count,
	profile_id,
	comment_count,
	category_Ids,
	readTime,
	content,
}: PostCardProp) => {
	const { theme } = useTheme();
	const [isAuthorized, setIsAuthorized] = useState<boolean | undefined>(
		undefined
	);
	const [bookmarkCount, setBookmarkCount] = useState(bookmark_count);
	const [likeCount, setLikeCount] = useState(likes_count);
	const [commentCount, setCommentcount] = useState(comment_count);
	const [isBookmarked, setIsBookmarked] = useState(false);
	const [isLiked, setIsLiked] = useState(false);
	const { user } = useFetchUser();
	const userId = user?.id;
	const postId = id;
	const [bio, setBio] = useState("");
	const [username, setUsername] = useState("");
	const [joinedDate, setJoinedDate] = useState("");
	const { user: currentUser } = useFetchUser();
	const [isFollowing, setIsFollowing] = useState(false);
	const [followersCount, setFollowersCount] = useState(0);
	const [followingCount, setFollowingCount] = useState(0);
	const currentUserId = currentUser?.id;
	const navigate = useNavigate();
	const [categoryNames, setCategoryNames] = useState<Array<string>>([]);
	const [postCategories, setPostCategories] = useState<
		Array<{ name: string; id: string; type: string }>
	>([]);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				if (!category_Ids || category_Ids.length === 0) {
					return;
				}

				const topicData = await supabase
					.from("topics")
					.select("id, name")
					.in("id", category_Ids);

				const subtopicData = await supabase
					.from("subtopics")
					.select("id, name")
					.in("id", category_Ids);

				const subsubtopicData = await supabase
					.from("subsubtopics")
					.select("id, name")
					.in("id", category_Ids);

				if (topicData.error || subtopicData.error || subsubtopicData.error) {
					console.error(
						"Error fetching category names:",
						topicData.error,
						subtopicData.error,
						subsubtopicData.error
					);
				} else {
					// Combine the results into one array of category names
					const combinedData = [
						...topicData.data,
						...subtopicData.data,
						...subsubtopicData.data,
					];

					// Extract the names and set the state
					const categoryNames = combinedData.map((category) => category.name);

					setCategoryNames(categoryNames);
				}
				const topicPost = await supabase
					.from("topics")
					.select("id, name, type")
					.in("id", category_Ids);

				const subtopicPost = await supabase
					.from("subtopics")
					.select("id, name, type")
					.in("id", category_Ids);

				const subsubtopicPost = await supabase
					.from("subsubtopics")
					.select("id, name, type")
					.in("id", category_Ids);

				if (topicPost.error || subtopicPost.error || subsubtopicPost.error) {
					console.error(
						"Error fetching category names:",
						topicPost.error,
						subtopicPost.error,
						subsubtopicPost.error
					);
				} else {
					// Combine the results into one array of category names
					const combinedData = [
						...topicPost.data,
						...subtopicPost.data,
						...subsubtopicPost.data,
					];

					// Extract the names and set the state
					const postCategories = combinedData.map((category) => ({
						id: category.id,
						name: category.name,
						type: category.type,
					}));

					setPostCategories(postCategories);
				}
			} catch (error: any) {
				console.error("An error occurred:", error.message);
			}
		};

		fetchCategories();
	}, [category_Ids]);

	// check following
	useEffect(() => {
		async function checkFollowing() {
			const { data, error } = await supabase
				.from("follow")
				.select()
				.eq("follower_id", currentUserId)
				.eq("following_id", profile_id);

			if (data && data.length > 0) {
				setIsFollowing(true);
			} else {
				setIsFollowing(false);
			}
		}

		if (currentUserId && profile_id) {
			checkFollowing();
		}
	}, [currentUserId, profile_id]);

	const handleFollow = async () => {
		if (isFollowing) {
			// If already following, unfollow
			const { error } = await supabase
				.from("follow")
				.delete()
				.eq("follower_id", currentUserId)
				.eq("following_id", profile_id);

			if (!error) {
				setIsFollowing(false);
				setFollowersCount((prevCount) => prevCount - 1);
			}
		} else {
			// If not following, follow
			const { error } = await supabase.from("follow").insert([
				{
					follower_id: currentUserId,
					following_id: profile_id,
					follower_username: currentUser?.username,
					following_username: username,
				},
			]);

			if (!error) {
				setIsFollowing(true);
				setFollowersCount((prevCount) => prevCount + 1);
			}
		}
	};

	// funtion to manage following count ]]==
	useEffect(() => {
		async function fetchCounts() {
			// Fetch the followers count
			const { data: followersData, error: followersError } = await supabase
				.from("follow")
				.select("follower_id")
				.eq("following_id", profile_id);

			if (!followersError) {
				setFollowersCount(followersData.length);
			}

			// Fetch the following count
			const { data: followingData, error: followingError } = await supabase
				.from("follow")
				.select("following_id")
				.eq("follower_id", profile_id);

			if (!followingError) {
				setFollowingCount(followingData.length);
			}
		}

		if (currentUserId) {
			fetchCounts();
		}
	}, [currentUserId, profile_id]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const { data: profiles, error } = await supabase
					.from("profiles")
					.select("*")
					.eq("id", profile_id)
					.single();

				if (error) {
					console.error("Error fetching profile:", error);
				} else {
					const bio = profiles?.bio;
					const joinedDate = profiles?.created_at;
					const username = profiles?.username;
					const isAuthorized = profiles?.isVerified === true;
					setBio(bio);
					setUsername(username);
					setIsAuthorized(isAuthorized);
					setJoinedDate(joinedDate);
				}
			} catch (error) {
				console.error("An error occurred:", error);
			}
		};
		fetchData();
	}, [profile_id]);

	//    check for bookmark based on user

	useEffect(() => {
		const checkBookmarkStatus = async () => {
			if (postId && userId) {
				const { data, error } = await supabase
					.from("bookmarks")
					.select("*")
					.eq("profile_id", userId)
					.eq("post_id", postId);

				if (data && data.length > 0) {
					setIsBookmarked(true);
				}
			}
		};

		checkBookmarkStatus();
	}, [postId, userId]);

	// Check if the user has liked the post
	const checkLikeStatus = async () => {
		if (postId && userId) {
			const { data, error } = await supabase
				.from("likes")
				.select("*")
				.eq("profile_id", userId)
				.eq("post_id", postId);

			if (data && data.length > 0) {
				setIsLiked(true);
			}
		}
	};

	useEffect(() => {
		checkLikeStatus();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [postId, userId]);

	//    toggle bookmark
	const toggleBookmark = async () => {
		if (isBookmarked) {
			// Remove the bookmark
			await supabase
				.from("bookmarks")
				.delete()
				.eq("profile_id", userId)
				.eq("post_id", postId);

			setIsBookmarked(false);
			// Decrement the bookmark_count
			setBookmarkCount((prevCount) => prevCount - 1);
		} else {
			// Add the bookmark
			await supabase.from("bookmarks").insert([
				{
					profile_id: userId,
					post_id: postId,
				},
			]);

			setIsBookmarked(true);
			// Increment the bookmark_count
			setBookmarkCount((prevCount) => prevCount + 1);
		}
	};

	// Toggle the like
	const toggleLike = async () => {
		if (isLiked) {
			// Remove the like
			await supabase
				.from("likes")
				.delete()
				.eq("profile_id", userId)
				.eq("post_id", postId);

			setIsLiked(false);
			// Decrement the like_count (if you have it)
			setLikeCount((prevCount: any) => prevCount - 1);
		} else {
			// Add the like
			await supabase.from("likes").insert([
				{
					profile_id: userId,
					post_id: postId,
				},
			]);

			setIsLiked(true);
			// Increment the like_count (if you have it)
			setLikeCount((prevCount: any) => prevCount + 1);
		}
	};

	const goHome = () => {
		navigate("/");
	};

	const scrollToTop = () => {
		navigate(`/post/${postId}`);
		window.scrollTo({ top: 0 });
	};
	const [divStyles, setDivStyles] = useState({
		height: "100px",
		width: "200px",
		minWidth: "100px",
		marginLeft: "70px",
	});
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth <= 768) {
				setDivStyles({
					height: "56px",
					width: "80px",
					minWidth: "80px",
					marginLeft: "40px",
				});
			} else {
				setDivStyles({
					height: "112px",
					width: "112px",
					minWidth: "112px",
					marginLeft: "70px",
				});
			}
		};

		window.addEventListener("resize", handleResize);

		handleResize();

		// Clean up the event listener when the component unmounts
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<div key={id} className="mb-5">
			<div className="flex items-center gap-3">
				<Hover
					profile_id={profile_id}
					author_image={author_image}
					author={author}
					isFollowing={isFollowing}
					isAuthorized={isAuthorized}
					handleFollow={handleFollow}
					username={username}
					followingCount={followingCount}
					followersCount={followersCount}
					joinedDate={joinedDate}
					bio={bio}
				/>
				<div className="flex items-center gap-3 text-xs font-medium text-wh-300">
					<p suppressHydrationWarning className="hidden md:block">
						{dateFormatter.format(Date.parse(created_at))}
					</p>
					<p suppressHydrationWarning>
						(
						{dayjs().diff(created_at, "seconds", true) < 30
							? "just now"
							: dayjs(created_at).fromNow()}
						)
					</p>
				</div>
			</div>
			<div className="flex justify-between pt-2">
				<div className="flex flex-col">
					<Link to={`/post/${id}`} onClick={scrollToTop}>
						<div className="text-sm font-bold capitalize md:text-base ">
							{title}
						</div>
					</Link>

					<div className="hidden pt-3 pb-4 text-sm font-medium md:block md: first-letter:uppercase dark:text-wh-100">
						{snippet.substring(0, 120)}...
					</div>
				</div>
				<div className="cursor-pointer" style={divStyles}>
					{image ? (
						<img
							src={image}
							alt="post image"
							style={{
								objectFit: "cover",
								height: "100%",
								width: "100%",
							}}
							width={100}
							height={200}
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							className="duration-700 ease-in-out "
							onClick={scrollToTop}
						/>
					) : (
						<div className="relative w-full h-56 mb-6 duration-300 bg-gray-300 md:h-96 animate-pulse" />
					)}
				</div>
			</div>
			<div className="flex items-center justify-between pt-3">
				<div className="flex items-center gap-5">
					<div className="flex flex-wrap items-center gap-4">
						{postCategories.slice(0, 1).map((cat, key) => {
							let type;

							if (cat.type === "Topic") {
								type = "tag";
							} else if (cat.type === "Subtopic") {
								type = "subtopic";
							} else {
								type = "subsubtopic";
							}

							return (
								<Link
									to={`/${type}/${cat.id}`}
									key={cat.id}
									onClick={scrollToTop}
								>
									<Badge className="flex items-center px-3 py-1 text-xs font-normal capitalize border rounded-full">
										{cat.name.substring(0, 18)}
									</Badge>
								</Link>
							);
						})}
					</div>
					<div className="text-xs font-medium">{readTime} min read</div>
				</div>
				<div className="flex items-center gap-3 md:gap-7 ">
					<div className="flex items-center gap-1">
						<button onClick={user ? toggleBookmark : goHome}>
							{isBookmarked ? (
								// Bookmarked
								<svg
									viewBox="0 0 24 24"
									fill="none"
									// @ts-ignore
									className="w-5 h-5 ut"
								>
									<title>unbookmark</title>
									<path
										d="M7.5 3.75a2 2 0 0 0-2 2v14a.5.5 0 0 0 .8.4l5.7-4.4 5.7 4.4a.5.5 0 0 0 .8-.4v-14a2 2 0 0 0-2-2h-9z"
										fill="currentcolor"
									></path>
								</svg>
							) : (
								// Not bookmarked
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill={theme === "dark" ? "#ffffff" : "#000"}
									// @ts-ignore
									className="w-5 h-5 no"
								>
									<title>bookmark</title>
									<path
										d="M17.5 1.25a.5.5 0 0 1 1 0v2.5H21a.5.5 0 0 1 0 1h-2.5v2.5a.5.5 0 0 1-1 0v-2.5H15a.5.5 0 0 1 0-1h2.5v-2.5zm-11 4.5a1 1 0 0 1 1-1H11a.5.5 0 0 0 0-1H7.5a2 2 0 0 0-2 2v14a.5.5 0 0 0 .8.4l5.7-4.4 5.7 4.4a.5.5 0 0 0 .8-.4v-8.5a.5.5 0 0 0-1 0v7.48l-5.2-4a.5.5 0 0 0-.6 0l-5.2 4V5.75z"
										fill="currentcolor"
									></path>
								</svg>
							)}
						</button>
					</div>
					{/* <Link to={user ? `/post/${postId}` : "/"} onClick={scrollToTop}>
                  <div className="flex items-center gap-1">
                     <MessageCircle className="w-5 h-5 opacity-70" />
                  </div>
               </Link> */}
					<div className="flex items-center gap-1">
						<button onClick={user ? toggleLike : goHome}>
							{isLiked ? (
								<svg
									aria-label="Unlike"
									// @ts-ignore
									class="x1lliihq x1n2onr6"
									color="rgb(255, 48, 64)"
									fill={theme === "dark" ? "#ffffff" : "#000"}
									role="img"
									viewBox="0 0 48 48"
									className="w-4 h-4"
								>
									<title>Unlike</title>
									<path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
								</svg>
							) : (
								<Heart className="w-5 h-5 opacity-70" />
							)}
						</button>
					</div>{" "}
				</div>
			</div>
			<div className="w-full px-6 pb-4 border-b border-black/10 dark:border-white/10" />
		</div>
	);
};

export default MinimalPostCard;

// {userId === profile_id && (
//    <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//          <div>
//             <span className="sr-only">Open menu</span>
//             <Pin className="w-4 h-4 mr-2" />
//          </div>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//          {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
//          <DropdownMenuItem>Pin article</DropdownMenuItem>
//       </DropdownMenuContent>
//    </DropdownMenu>
// )}
