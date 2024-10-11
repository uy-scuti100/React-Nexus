import { useEffect, useState } from "react";
import Navbar from "../../components/myComponents/global/Navbar";
import Sidebar from "../../components/myComponents/global/Sidebar";
import supabase from "../../lib/supabaseClient";
import { usePost } from "../../hooks/usePost";
import { Post } from "../../../types";
import TopicSlider from "../../components/myComponents/global/TopicSlider";
import PostCardSkeleton from "../../components/myComponents/skeletons/PostCardSkeleton";
import { calculateReadTime } from "../../lib/readTime";

import RecommendedPosts from "./RecommendedPosts";
import debounce from "lodash.debounce";
import MinimalPostCard from "../../components/myComponents/global/MinimalPostCard";

const page = () => {
	const [isFetching, setIsFetching] = useState(false);
	const [scrollPosition, setScrollPosition] = useState(0);
	const [totalPosts, setTotalPosts] = useState<number | null>(0);
	const { posts, isLoading } = usePost();
	const [blogPosts, setBlogPosts] = useState<Post[] | null | undefined>([]);
	const [error, setError] = useState(false);
	const FROM = Number(blogPosts?.length);

	useEffect(() => {
		if (typeof window !== "undefined" && posts !== null) {
			setBlogPosts(posts);
		}
	}, [posts]);

	//  Function to fetch the total number of posts
	useEffect(() => {
		const fetchTotalPosts = async () => {
			try {
				const { count, error } = await supabase
					.from("posts")
					.select("count", { count: "exact" });

				if (!error) {
					setTotalPosts(count); // Set the total number of posts
				} else {
					console.log(error);
				}
			} catch (error) {
				console.log(error);
			}
		};
		fetchTotalPosts();
	}, []);

	//  Fetch more posts
	const fetchMorePosts = async () => {
		if (isFetching) {
			return; // If already fetching, do nothing
		}
		setIsFetching(true);

		try {
			const { data, error } = await supabase
				.from("posts")
				.select("*")
				.range(FROM, FROM + 4)
				.order("created_at", { ascending: false });

			if (data && data.length > 0) {
				if (blogPosts !== null) {
					setBlogPosts(blogPosts?.concat(data));
				}
			} else {
				setError(true);
			}
		} catch (error) {
			setError(true);
		} finally {
			setIsFetching(false);
		}
	};

	const skeletonElements = Array.from(
		{ length: totalPosts || 5 },
		(_, index) => <PostCardSkeleton key={index} />
	);

	useEffect(() => {
		const handleScroll = () => {
			const currentPosition = window.scrollY;

			const viewportHeight = window.innerHeight;
			const scrollThreshold = 1 * viewportHeight;

			if (currentPosition - scrollPosition > scrollThreshold) {
				fetchMorePosts();
				setScrollPosition(currentPosition);
			}
		};

		const debouncedHandleScroll = debounce(handleScroll, 300);

		window.addEventListener("scroll", debouncedHandleScroll);

		return () => {
			window.removeEventListener("scroll", debouncedHandleScroll);
		};
	}, [scrollPosition, fetchMorePosts]);

	return (
		<main className="relative">
			<section className="px-6 pt-[5.625rem]">
				<div className="grid-cols-5 gap-10 pt-5 mb-5 lg:grid md:px-28">
					<div className="overflow-x-hidden lg:col-span-3 md:px-0 lg:px-12">
						<div className="flex flex-col gap-2 py-5">
							<p className="text-2xl font-bold ">Recent Articles</p>
							<p className="pb-5 text-sm">
								Explore the latest publications from authors covering a wide
								range of subjects
							</p>
						</div>
						<TopicSlider />
						<RecommendedPosts />

						<div className="pt-20">
							{blogPosts?.map((post: Post) => {
								const {
									author,
									id,
									image,
									snippet,
									title,
									created_at,
									profile_id,
									author_image,
									bookmark_count,
									likes_count,
									comment_count,
									category_Ids,
									content,
								} = post;
								const readTime = calculateReadTime(content);

								return (
									<MinimalPostCard
										key={id}
										author={author}
										id={id}
										image={image}
										snippet={snippet}
										title={title}
										author_image={author_image}
										bookmark_count={bookmark_count}
										created_at={created_at}
										likes_count={likes_count}
										comment_count={comment_count}
										profile_id={profile_id}
										category_Ids={category_Ids}
										readTime={readTime}
										content={content}
									/>
								);
							})}
						</div>
						{isLoading && (
							<div className="flex flex-col w-full">{skeletonElements}</div>
						)}
						{blogPosts === null ||
							(Array.isArray(blogPosts) && blogPosts.length === 0 && (
								<div className="flex flex-col w-full">{skeletonElements}</div>
							))}

						{isLoading && (
							<div className="flex flex-col w-full">{skeletonElements}</div>
						)}
					</div>

					<div className="md:pl-8 md:border-l lg:col-span-2 border-foreground/40 lg:px-6">
						<Sidebar type="home" />
					</div>
				</div>
			</section>
		</main>
	);
};

export default page;
