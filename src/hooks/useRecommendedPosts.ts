import useSWR from "swr";
import { Post } from "../../types";
import { fetchRecommendedPosts } from "../lib/recommendedPostsUtil";

export const useRecommendedPost = (): {
  posts: Post[] | null;
  isLoading: boolean;
  isError: boolean;
} => {

  const { data, error } = useSWR("recommendedposts", () => fetchRecommendedPosts(), {
    revalidateOnMount: true,
  });

  const posts = data || null;

  const isLoading = !data && !error;
  const isError = !!error;

  return {
    posts,
    isLoading,
    isError,
  };
};
