import React from "react";
import { LargePostsProp, PostsProp, largePosts, posts } from "../posts/posts";
import PostCard from "../posts/postCard";
import LargePostCard from "../posts/largePostCard";
import { Post } from "../../../../types";
import { usePost } from "../../../hooks/usePost";
import { Link } from "react-router-dom";

export const TrendingPostComponent = () => {
	const { posts } = usePost();
	return (
		<div className="grid px-6 py-8 gap-x-8 gap-y-4 md:grid-cols-2 lg:grid-cols-3 place-content-between">
			{posts?.slice(0, 6)?.map((post: Post, i: number) => {
				const { author, author_image, created_at, title, id } = post;
				const postNumber = (i + 1).toString().padStart(2, "0");
				return (
					<Link
						to={`/post/${id}`}
						key={i}
						className="flex gap-5 md:min-w-[320px] min-w-[300px]"
					>
						<span className="font-bold text-2xl text-foreground/30 font-[miracle] mt-5">
							{postNumber}
						</span>
						<PostCard
							title={title}
							date={created_at}
							user_img={author_image}
							author={author}
						/>
					</Link>
				);
			})}
		</div>
	);
};

export const LargePostComponent = () => {
	const { posts } = usePost();
	return (
		<div className="px-6 py-8 ">
			{posts?.slice(0, 6)?.map((post: Post, i: number) => {
				const { author, author_image, created_at, title, image, id } = post;

				// const postNumber = (i + 1).toString().padStart(2, "0");
				return (
					<Link to={`/post/${id}`} key={i} className="w-full pb-6 bg-blue-500">
						<LargePostCard
							title={title}
							date={created_at}
							user_img={author_image}
							author={author}
							post_image={image}
						/>
					</Link>
				);
			})}
		</div>
	);
};

{
	/* <span className="font-bold text-2xl text-foreground/30 font-[miracle] mt-5">
                     {postNumber}
                  </span> */
}
