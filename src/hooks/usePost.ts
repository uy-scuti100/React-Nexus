import useSWR from "swr";
import { fetchPosts } from "../lib/postUtils";
import { Post } from "../../types";

export const usePost = (): {
  posts: Post[] | null | undefined;
  isLoading: boolean;
  isError: boolean;
} => {
  const { data, error } = useSWR("posts", fetchPosts, {
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
