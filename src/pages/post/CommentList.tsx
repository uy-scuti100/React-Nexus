import React from "react";
import CommentCard from "./CommentCard";
import { Comment } from "@/types";

interface CommentListProps {
   comments: Comment[];
   fetchComments: () => void;
   commentCount: number;
   updateCommentCount: (newCount: number) => void;
}

const CommentList: React.FC<CommentListProps> = ({
   comments,
   fetchComments,
   commentCount,
   updateCommentCount,
}: CommentListProps) => {
   return (
      <div>
         {comments?.map((comment, i) => (
            <CommentCard
               key={i}
               comment={comment}
               fetchComments={fetchComments}
               commentCount={commentCount}
               updateCommentCount={updateCommentCount}
            />
         ))}
      </div>
   );
};

export default CommentList;
