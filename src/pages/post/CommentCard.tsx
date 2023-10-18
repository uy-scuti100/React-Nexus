import { Edit, Reply, Trash } from "lucide-react";
import { useState, useEffect, ChangeEvent } from "react";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Comment } from "../../../types";
import { useTheme } from "../../components/providers/theme/theme-provider";
import { useFetchUser } from "../../hooks/useFetchUser";
import supabase from "../../lib/supabaseClient";
import { Textarea } from "../../components/ui/textarea";
import { Link, useNavigate } from "react-router-dom";
dayjs.extend(relativeTime);

const CommentCard = ({
   comment,
   fetchComments,
   commentCount,
   updateCommentCount,
}: {
   comment: Comment;
   fetchComments: () => void;
   commentCount: number;
   updateCommentCount: (newCount: number) => void;
}) => {
   const [content, setContent] = useState(comment?.content);
   const [tempContent, setTempContent] = useState("");
   const [isEditing, setIsEditing] = useState(false);
   const [isLiked, setIsLiked] = useState(false);
   const [tempContentError, setTempContentError] = useState<string>("");
   const [showReplyForm, setShowReplyForm] = useState(false);
   const [commentCounts, setCommentCounts] = useState(comment?.comment_count);
   const [likeCount, setLikeCount] = useState(comment?.likes_count);
   const [replyContent, setReplyContent] = useState("");
   const [replies, setReplies] = useState<Comment[]>([]);
   const [areChildrenHidden, setAreChildrenHidden] = useState(true);
   const { theme } = useTheme();
   const { user } = useFetchUser();
   const userId = user?.id;
   const commentId = comment?.id;
   const navigate = useNavigate();
   /////////////////////////////////////////////////////////

   // useEffect(() => {
   //    // Fetch the initial content when the component mounts
   //    // You might want to add error handling here as well
   //    async function fetchCommentContent() {
   //       const { data, error } = await supabase
   //          .from("comments")
   //          .select("content")
   //          .eq("id", commentId);

   //       if (!error && data && data.length > 0) {
   //          setContent(data[0].content);
   //       }
   //    }

   //    fetchCommentContent();
   // }, [commentId]);

   const goHome = () => {
      navigate("/");
   };

   const handleEditClick = (contentToEdit: string) => {
      // Set the temporary content to the content of the comment being edited
      setTempContent(contentToEdit);
      setIsEditing(true);
   };

   const handleRevertClick = () => {
      // Revert to the previous content
      // setTempContent(content);
      setIsEditing(false);
   };

   const handleSaveClick = async () => {
      if (tempContent.trim() === "") {
         setTempContentError("Comment field cant be empty.");
         return;
      }
      const { data, error } = await supabase
         .from("comments")
         .update({ content: tempContent })
         .eq("id", commentId)
         .select();

      if (!error && data && data.length > 0) {
         fetchComments();
         setTempContent("");
         setContent(tempContent);
         setIsEditing(false);
      }
   };
   const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      // Update the temporary content as the user types
      setTempContent(e.target.value);
   };

   //  function to reply to a comment
   const handleReplySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
         const { data, error } = await supabase.from("comments").upsert([
            {
               content: replyContent,
               parent_comment_id: comment.id,
               profile_id: userId,
            },
         ]);

         if (error) {
            console.error("Error inserting reply:", error.message);
         } else {
            fetchReplies();
            setReplyContent("");
            toast.success("reply sent");
            setCommentCounts(commentCounts + 1);
            setShowReplyForm(false);
            setAreChildrenHidden(false);
         }
      } catch (error) {
         console.error("API request error:", error);
      }
   };

   // function to toggle the reply textarea on and off
   const toggleReplyForm = () => {
      setShowReplyForm(!showReplyForm);
   };

   // Check if the user has liked the post
   const checkLikeStatus = async () => {
      if (commentId && userId) {
         const { data, error } = await supabase
            .from("comment_likes")
            .select("*")
            .eq("profile_id", userId)
            .eq("comment_id", commentId);

         if (data && data.length > 0) {
            setIsLiked(true);
         }
      }
   };

   // funtion to  toggle the like button
   const toggleLike = async () => {
      if (isLiked) {
         // Remove the like
         await supabase
            .from("comment_likes")
            .delete()
            .eq("profile_id", userId)
            .eq("comment_id", commentId);

         setIsLiked(false);
         // Decrement the like_count (if you have it)
         setLikeCount((prevCount: number): number => prevCount - 1);
      } else {
         // Add the like
         await supabase.from("comment_likes").insert([
            {
               profile_id: userId,
               comment_id: commentId,
            },
         ]);

         setIsLiked(true);
         // Increment the like_count (if you have it)
         setLikeCount((prevCount: number): number => prevCount + 1);
      }
   };
   // funtion to  fetch replies
   const fetchReplies = async () => {
      try {
         const { data, error } = await supabase
            .from("comments")
            .select("*")
            .eq("parent_comment_id", comment.id);

         if (!error) {
            setReplies(data || []);
         } else {
            console.error("Error fetching replies:", error.message);
         }
      } catch (error) {
         console.error("Error fetching comments:", error);
      }
   };

   // funtion todelete a comment
   const handleDeleteComment = async () => {
      try {
         // Delete the comment and its associated replies
         const { error } = await supabase
            .from("comments")
            .delete()
            .eq("id", comment.id);

         if (!error) {
            updateCommentCount(commentCount - 1);

            fetchComments();
            toast.success("Comment Deleted!!!");
         } else {
            console.log("Error deleting comment:", error.message);
         }
      } catch (error) {
         console.error("API request error:", error);
      }
   };

   // useEffect to fetchReplies
   useEffect(() => {
      fetchReplies();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [comment]);

   //   useEffect to fire the checkLikeStatus
   useEffect(() => {
      checkLikeStatus();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [commentId, userId]);

   return (
      <>
         <div className="pb-3 mb-4">
            <div className="w-full p-4 border rounded-xl">
               <div key={comment?.id} className="flex items-start gap-3 pb-4">
                  <Link to={`/account/${comment.profile_id}`}>
                     <img
                        src={comment?.comment_author_pic}
                        alt="Comment Author"
                        className="w-12 h-12 rounded-full"
                        width={48}
                        height={48}
                     />
                  </Link>
                  <div className="flex flex-col flex-1 ">
                     <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold">
                           {comment?.comment_author_name}
                        </p>
                        <p suppressHydrationWarning>
                           {dayjs().diff(comment?.created_at, "seconds", true) <
                           30
                              ? "just now"
                              : dayjs(comment?.created_at).fromNow()}
                        </p>
                     </div>
                     {isEditing ? (
                        <div className="flex flex-col gap-2">
                           <Textarea
                              style={{
                                 height: "50px",
                                 resize: "none",
                                 border: "1px solid #ccc",
                              }}
                              value={tempContent}
                              onChange={
                                 (e: ChangeEvent<HTMLTextAreaElement>) =>
                                    handleInputChange(e) // Call handleInputChange with e.target.value
                              }
                           />

                           {tempContentError && (
                              <p className="mt-1 text-primary-500">
                                 {tempContentError}
                              </p>
                           )}
                           <div className="flex items-center justify-end ">
                              <button
                                 onClick={handleRevertClick}
                                 className="px-5 py-2 mt-5 mr-3 font-semibold text-black rounded-full bg-accent-red hover:bg-wh-500 dark:text-black">
                                 Revert
                              </button>
                              <button
                                 onClick={handleSaveClick}
                                 className="px-5 py-2 mt-5 font-semibold text-black rounded-full bg-accent-red hover:bg-wh-500 dark:text-black">
                                 Save
                              </button>
                           </div>
                        </div>
                     ) : (
                        <p className="p-2 rounded-md bg-input">
                           {comment?.content}
                        </p>
                     )}
                  </div>
               </div>
               <div className="flex items-center justify-end gap-5">
                  <div className="flex items-center gap-1">
                     <button onClick={user ? toggleLike : goHome}>
                        {isLiked ? (
                           <svg
                              aria-label="Unlike"
                              // @ts-ignore
                              class="x1lliihq x1n2onr6"
                              color="rgb(255, 48, 64)"
                              fill={theme === "dark" ? "#ffffff" : "#000"}
                              height="20"
                              role="img"
                              viewBox="0 0 48 48"
                              width="20">
                              <title>Unlike</title>
                              <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
                           </svg>
                        ) : (
                           <svg
                              className="opacity-70"
                              aria-label="Like"
                              // @ts-ignore
                              class="x1lliihq x1n2onr6"
                              color="rgb(255, 48, 64)"
                              fill="rgb(225, 225, 225)"
                              height="24"
                              role="img"
                              viewBox="0 0 24 24"
                              width="24">
                              <title>Like</title>
                              <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
                           </svg>
                        )}
                     </button>
                     <p>{likeCount > 0 ? <p>{likeCount}</p> : ""}</p>
                  </div>
                  <div
                     className="flex items-center gap-1 cursor-pointer"
                     onClick={user ? toggleReplyForm : goHome}>
                     <Reply className="w-6 h-6 opacity-70" />
                     <p>{commentCounts > 0 ? <p>{commentCounts}</p> : ""}</p>
                  </div>
                  {comment?.profile_id === userId && (
                     <div
                        className="flex items-center gap-1 cursor-pointer"
                        onClick={() => handleEditClick(comment?.content)}>
                        <Edit className="w-6 h-6 opacity-70" />
                     </div>
                  )}

                  {comment?.profile_id === userId && (
                     <div
                        className="flex items-center gap-1 cursor-pointer"
                        onClick={handleDeleteComment}>
                        <Trash className="w-6 h-6 text-red-600 opacity-70" />
                     </div>
                  )}
               </div>
            </div>
            {showReplyForm && (
               <form onSubmit={user ? handleReplySubmit : goHome}>
                  <div className="pl-8 mt-4">
                     <Textarea
                        placeholder="Reply to this comment..."
                        style={{
                           height: "100px",
                           resize: "none",
                        }}
                        value={replyContent}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                           setReplyContent(e.target.value)
                        }
                     />

                     <div className="flex justify-end">
                        <button
                           type="button"
                           className="px-5 py-2 mt-5 mr-3 font-semibold rounded-full bg-accent-red hover:bg-wh-500 text-wh-10 dark:text-black"
                           onClick={toggleReplyForm}>
                           Cancel
                        </button>
                        <button
                           type="submit"
                           className="px-5 py-2 mt-5 font-semibold rounded-full bg-accent-red hover:bg-wh-500 text-wh-10 dark:text-black">
                           Post Reply
                        </button>
                     </div>
                  </div>
               </form>
            )}
         </div>
         {replies?.length > 0 && (
            <>
               <div className={`flex ${areChildrenHidden ? "hidden" : ""}`}>
                  <button
                     className="collapse-line"
                     aria-label="Hide Replies"
                     onClick={() => setAreChildrenHidden(true)}
                  />
                  <div className="pl-[0.5rem] flex-grow">
                     {replies?.map((reply) => (
                        <CommentCard
                           key={reply.id}
                           comment={reply}
                           fetchComments={fetchComments}
                           commentCount={commentCount}
                           updateCommentCount={updateCommentCount}
                        />
                     ))}
                  </div>
               </div>
               {areChildrenHidden && (
                  <button
                     className="px-5 py-2 my-5 font-semibold text-black bg-accent-red hover:bg-wh-500 dark:text-black"
                     onClick={() => setAreChildrenHidden(false)}>
                     Show replies
                  </button>
               )}
            </>
         )}
      </>
   );
};

export default CommentCard;
