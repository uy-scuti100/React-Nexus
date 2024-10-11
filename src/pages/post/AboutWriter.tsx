import { BadgeDollarSign, Heart, MailPlus, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../../components/ui/tooltip";
import { Link, useNavigate } from "react-router-dom";
import { useFetchUser } from "../../hooks/useFetchUser";
import supabase from "../../lib/supabaseClient";
import { Post } from "../../../types";
import { useTheme } from "../../components/providers/theme/theme-provider";
import { calculateReadTime } from "../../lib/readTime";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
interface WriterProp {
	profile_id: string;
	author_image: string;
	author: string;
	isFollowing: boolean;
	isAuthorized: boolean | undefined;
	handleFollow: () => void;
	postId: string;
	categoryIds: string[];
}

const AboutWriter = ({
	profile_id,
	author_image,
	author,
	isAuthorized,
	handleFollow,
	isFollowing,
	postId,
	categoryIds,
}: WriterProp) => {
	const theme = useTheme();
	const [followersCount, setFollowersCount] = useState<number | null>(null);
	const [recommendedPosts, setRecommendedPosts] = useState<Array<Post> | null>(
		[]
	);
	const [authorPosts, setAuthorPosts] = useState<Array<Post>>([]);
	const [bio, setBio] = useState<string | null | undefined>("");
	const { user } = useFetchUser();
	const currentUserId = user?.id;
	const image = author_image;
	const scrollToTop = () => {
		window.scrollTo({ top: 0 });
	};
	const navigate = useNavigate();
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
		}
		fetchCounts();
	}, [profile_id]);

	useEffect(() => {
		async function fetchBio() {
			const { data, error } = await supabase
				.from("profiles")
				.select("bio")
				.eq("id", profile_id)
				.single();

			if (!error) {
				setBio(String(data.bio));
			}
		}

		fetchBio();
	}, [profile_id]);

	// fetch more posts
	useEffect(() => {
		const fetchMorePosts = async () => {
			const { data, error } = await supabase
				.from("posts")
				.select("*")
				.eq("profile_id", profile_id)
				.limit(5)
				.order("created_at", { ascending: false });

			if (data && !error) {
				// Filter out the current post based on postId
				const filteredPosts = data.filter((post) => post.id !== postId);
				setAuthorPosts(filteredPosts);
			}
		};

		fetchMorePosts();
	}, [profile_id, postId]);

	const goHome = () => {
		navigate("/");
	};
	// Fetch recommended posts based on currentPost's category_ids
	useEffect(() => {
		// Fetch recommended posts based on currentPost's category_ids
		const fetchRecommendedPosts = async () => {
			if (categoryIds) {
				const { data, error } = await supabase
					.from("posts")
					.select("*")
					.contains("category_Ids", [categoryIds])
					.limit(4)
					.order("created_at", { ascending: false });

				if (data) {
					const filteredPosts = data.filter((post) => post.id !== postId);
					setRecommendedPosts(filteredPosts);
				}
			}
		};

		fetchRecommendedPosts();
	}, [categoryIds, postId]);

	return (
		<section>
			<div className="w-full px-6 py-4 border-b border-black/10 dark:border-white/10" />
			<Link
				to={`/account/${profile_id}`}
				onClick={scrollToTop}
				className="gap-4 pt-10 md:flex"
			>
				<img
					src={image}
					width={64}
					height={64}
					alt="author_image"
					className="w-[64px] h-[64px] rounded-full cursor-pointer object-cover mb-4 md:mb-0"
				/>
				<div className="flex flex-col gap-2">
					<div>{bio}</div>
					<p>
						{followersCount} <span className="opacity-75"> Followers</span>{" "}
						<span className="hidden">Writer for Osiris</span>
					</p>
				</div>
			</Link>
			<div className="justify-between mt-10 md:flex">
				<div className="flex items-center gap-2 pb-5 text-xl font-bold md:pb-0">
					<div className="relative">
						Written by {author}
						<p className="absolute top-2 -right-6">
							{isAuthorized && (
								<img
									src="/bluecheck-removebg-preview.png"
									alt="checkmark"
									height={14}
									width={14}
								/>
							)}
						</p>
					</div>
				</div>
				<div className="flex items-center gap-5 md:gap-3">
					{profile_id !== currentUserId && (
						<>
							<button
								className="w-auto px-3 py-2 text-xs font-semibold text-black md:px-5 bg-accent-red hover:bg-wh-500 "
								onClick={handleFollow}
							>
								{isFollowing ? "UnFollow" : "Follow"}
							</button>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger>
										<button
											className="p-2 rounded-full text-background bg-foreground"
											onClick={() =>
												alert("Feature coming Soon.. Stay Tuned 😉😁📧")
											}
										>
											<MailPlus />
										</button>
									</TooltipTrigger>
									<TooltipContent>
										<p className="text-center">
											Subcribe to get an email <br /> whenever {author} <br />{" "}
											publishes an article
										</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger>
										<button
											className="p-2 rounded-full text-background bg-foreground "
											onClick={() =>
												alert("Feature coming Soon.. Stay Tuned 😁🤑💲")
											}
										>
											<BadgeDollarSign />
										</button>
									</TooltipTrigger>
									<TooltipContent>
										<p>Give a tip to {author}</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</>
					)}
				</div>
			</div>
			<div className="w-full px-6 py-4 border-b border-black/10 dark:border-white/10" />
			<div>
				{authorPosts.length > 0 && (
					<div className="pt-10 md:pt-20">
						<p className="pb-5 text-xl font-bold capitalize md:text-3xl">
							More Articles from {author}
						</p>

						<div className="grid-cols-2 gap-20 px-4 py-5 md:grid md:px-0">
							{authorPosts?.map((post: Post, i: number) => {
								const readTime = calculateReadTime(post.content);
								return (
									<div className="flex flex-col md:h-[360px] " key={post.id}>
										<Link
											to={`/post/${post.id}`}
											key={i}
											className="mx-2"
											onClick={scrollToTop}
										>
											<img
												src={post.image}
												alt="post-image"
												className="w-full h-[200px] mb-5 object-cover"
											/>
											<p className="mb-2 text-xl font-bold capitalize">
												{post.title.substring(0, 40)}...
											</p>
											<p className="text-sm opacity-50 first-letter:uppercase">
												{post.snippet.substring(0, 30)}...
											</p>
											<div className="flex items-center gap-8 pt-2">
												<p>{readTime} min read.</p>
												<p suppressHydrationWarning className="text-[14px]">
													{" "}
													{dayjs().diff(post.created_at, "seconds", true) < 30
														? "just now"
														: dayjs(post.created_at).fromNow()}
												</p>
											</div>
										</Link>
										<div className="w-full py-4 mb-8 border-b md:hidden border-black/10 dark:border-white/10" />
									</div>
								);
							})}
						</div>
					</div>
				)}
			</div>

			<div className="flex items-center justify-center mt-10">
				<Link to={`/account/${profile_id}`}>
					<button
						className="w-full px-4 py-3 transition-colors duration-300 border rounded-full md:w-auto hover:bg-accent-red hover:border-none whitespace-nowrap"
						onClick={scrollToTop}
					>
						See all articles from {author}
					</button>
				</Link>
			</div>
			{recommendedPosts && (
				<div className="py-20 ">
					<h1 className="py-20 text-xl font-bold text-center md:text-left md:text-3xl">
						Recommendations from Nexus.
					</h1>

					<div className="grid-cols-2 gap-20 px-4 py-5 md:grid md:px-0">
						{recommendedPosts?.map((post: Post, i: number) => {
							const readTime = calculateReadTime(post.content);
							return (
								<div className="flex flex-col md:h-[360px]" key={post.id}>
									<Link
										to={`/post/${post.id}`}
										key={i}
										className="mx-2"
										onClick={scrollToTop}
									>
										<img
											src={post.image}
											alt="post-image"
											className="w-full h-[200px] mb-5 object-cover"
										/>
										<Link
											to={`/account/${post.profile_id}`}
											className="flex items-center gap-4 pb-4"
										>
											<div>
												<img
													src={post.author_image}
													alt="author image"
													className="rounded-full w-[2.75rem] h-[2.75rem] object-cover"
												/>
											</div>
											<p className="font-semibold ">{post.author}</p>
										</Link>
										<p className="mb-2 text-xl font-bold capitalize">
											{post.title.substring(0, 40)}...
										</p>
										<p className="text-sm opacity-50 first-letter:uppercase">
											{post.snippet.substring(0, 30)}...
										</p>
										<div className="flex items-center gap-8 pt-2">
											<p>{readTime} min read.</p>
											<p suppressHydrationWarning className="text-[14px]">
												{" "}
												{dayjs().diff(post.created_at, "seconds", true) < 30
													? "just now"
													: dayjs(post.created_at).fromNow()}
											</p>
										</div>
									</Link>

									<div className="w-full mb-8 border-b md:hidden border-black/10 dark:border-white/10" />
								</div>
							);
						})}
					</div>
				</div>
			)}
		</section>
	);
};

export default AboutWriter;
