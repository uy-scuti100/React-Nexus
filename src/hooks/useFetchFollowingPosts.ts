import useSWR from "swr";
import { Post } from "../../types";
import { fetchFollowingPosts } from "../lib/fetchFollowingPosts";

export const useFetchFollowingPosts = (followingIds: string[] | null): {posts: Post[] | null | undefined; isLoading: boolean;isError: boolean; } => {
  const { data: posts, error } = useSWR(
    followingIds ? `categoryPosts-${JSON.stringify(followingIds)}` : null,
    () => (followingIds ? fetchFollowingPosts(followingIds) : null), // Add a type guard here
    {
      revalidateOnMount: true
    }
  );

  return {
    posts,
    isLoading: !posts && !error,
    isError: !!error
  };
};
