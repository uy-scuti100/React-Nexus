import { useEffect, useState } from "react";
import MinimalPostCard from "../../components/myComponents/global/MinimalPostCard";
import Navbar from "../../components/myComponents/global/Navbar";
import Sidebar from "../../components/myComponents/global/Sidebar";
import PostCardSkeleton from "../../components/myComponents/skeletons/PostCardSkeleton";
import supabase from "../../lib/supabaseClient";
import { Post } from "../../../types";
import { useFetchUser } from "../../hooks/useFetchUser";
import { calculateReadTime } from "../../lib/readTime";

interface Likes {
	profile_id: string;
	post_id: string;
}

const Page = () => {
	const { user } = useFetchUser();
	const currentUserId = user?.id;
	const [likedPosts, setLikedPosts] = useState<Post[] | null>([]);
	const [postIds, setPostIds] = useState<Likes[] | null>([]);
	// console.log(postIds);
	// console.log(likedPosts);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchBookmarkedData = async () => {
			try {
				setIsLoading(true);
				const { data: likesData, error: likesError } = await supabase
					.from("likes")
					.select("*")
					.eq("profile_id", currentUserId);

				if (likesData && !likesError) {
					setPostIds(likesData);
					const postIdsArray = likesData.map((like) => like.post_id);

					if (postIdsArray.length > 0) {
						const { data: postsData, error: postsError } = await supabase
							.from("posts")
							.select("*")
							.in("id", postIdsArray);

						if (postsData && !postsError) {
							setLikedPosts(postsData);
						} else {
							console.error("Error fetching bookmarked posts:", postsError);
						}
					}
				} else {
					console.error("Error fetching liked posts:", likesError);
				}
			} catch (error) {
				console.error("An error occurred:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchBookmarkedData();
	}, [currentUserId]);

	const skeletonElements = Array.from({ length: 5 }, (_, index) => (
		<PostCardSkeleton key={index} />
	));
	return (
		<main className="relative">
			<section className="px-6 pt-16">
				<h1 className="pt-5 text-xl font-bold text-center">Your Liked Posts</h1>
				<div className="gap-10 mb-5 md:flex md:px-20 md:pt-5">
					<div className="overflow-x-hidden md:basis-3/5 lg:basis-3/4 md:px-0 lg:px-24 ">
						{/* <RecommendedPosts /> */}
						<div className="flex flex-col w-full gap-5 mt-20">
							{likedPosts?.map((post: Post, i: number) => {
								const {
									author,
									id,
									image,
									snippet,
									category_Ids,
									title,
									created_at,
									profile_id,
									author_image,
									bookmark_count,
									likes_count,
									comment_count,
									content,
								} = post;

								const readTime = calculateReadTime(content);

								return (
									<MinimalPostCard
										content={content}
										key={id}
										readTime={readTime}
										author={author}
										id={id}
										image={image}
										snippet={snippet}
										title={title}
										author_image={author_image}
										bookmark_count={bookmark_count}
										category_Ids={category_Ids}
										created_at={created_at}
										likes_count={likes_count}
										comment_count={comment_count}
										profile_id={profile_id}
									/>
								);
							})}
						</div>
						{isLoading && (
							<div className="flex flex-col w-full gap-5">
								{skeletonElements}
							</div>
						)}

						{likedPosts === null ||
							(Array.isArray(likedPosts) && likedPosts.length === 0 && (
								<div>
									<div className="flex items-center justify-center">
										<div className="relative w-full md:w-[500px] h-[500px]">
											<img
												src="/No data-amico.png"
												alt="loading-image"
												className="object-cover"
											/>
										</div>
									</div>
									<div className="pb-10 text-2xl font-bold text-center">
										No Article from this topic
									</div>
								</div>
							))}
					</div>
					<div className="pl-8 md:border-l md:basis-2/5 lg:basis1/4 border-foreground/40 lg:px-6">
						<Sidebar type="home" />
					</div>
				</div>
			</section>
		</main>
	);
};

export default Page;
