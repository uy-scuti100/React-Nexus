import useSWR from "swr";
import { Post } from "../../types";
import { fetchFollowingPosts } from "../lib/fetchFollowingPosts";

export const useFetchFollowingPosts = (
  ids: string[] | null
): {
  posts: Post[] | null | undefined;
  isLoading: boolean;
  isError: boolean;
} => {
  const { data: posts, error } = useSWR(
    ids ? `categoryPosts-${JSON.stringify(ids)}` : null,
    () => (ids ? fetchFollowingPosts(ids) : null), // Add a type guard here
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
