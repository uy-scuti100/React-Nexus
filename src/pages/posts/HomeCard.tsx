import PostCard from "./PostCard";
import PostCardSkeleton from "../../components/myComponents/skeletons/PostCardSkeleton";
import { Post } from "../../../types";
import { calculateReadTime } from "../../lib/readTime";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../../lib/supabaseClient";
import { useFetchUser } from "../../hooks/useFetchUser";
import { TopicProp } from "../subsubtopic/Page";

export default function HomeCard({
   blogPosts,
   isLoading,
   totalPosts,
}: {
   blogPosts: Post[] | null | undefined;
   isLoading: boolean;
   totalPosts: number | null;
}) {
   const skeletonElements = Array.from(
      { length: totalPosts || 5 },
      (_, index) => <PostCardSkeleton key={index} />
   );

   return (
      <main>
         <div className="flex flex-col w-full"></div>
      </main>
   );
}
