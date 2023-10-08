import React, { useEffect, useRef, useState } from "react";
import hljs from "highlight.js";
import "react-quill/dist/quill.core.css";
import "react-quill/dist/quill.snow.css";
import "highlight.js/styles/atom-one-dark.css";
import ReactQuill from "react-quill";
import CategoryAndEdit from "./CategoryAndEdit";
import rehypeRaw from "rehype-raw";
import {
   BadgeCheck,
   CalendarIcon,
   Camera,
   Disc3,
   MessageCircle,
} from "lucide-react";
import CommentList from "./CommentList";
import toast from "react-hot-toast";
import supabase from "../../lib/supabaseClient";
import { useFetchUser } from "../../hooks/useFetchUser";
import { useTheme } from "../../components/providers/theme/theme-provider";
import { Textarea } from "../../components/ui/textarea";
import SocialLinks from "../../components/myComponents/global/SocialLinks";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ReactMarkdown from "react-markdown";
import { Comment, Post } from "../../../types";
import { Link } from "react-router-dom";
import {
   HoverCard,
   HoverCardContent,
   HoverCardTrigger,
} from "../../components/ui/hover-card";
import {
   Avatar,
   AvatarFallback,
   AvatarImage,
} from "../../components/ui/avatar";
import PostSlider from "../../components/myComponents/global/PostSlider";

dayjs.extend(relativeTime);

const dateFormatter = new Intl.DateTimeFormat(undefined, {
   dateStyle: "medium",
});

hljs.configure({
   // optionally configure hljs
   languages: [
      "javascript",
      "python",
      "c",
      "c++",
      "java",
      "HTML",
      "css",
      "matlab",
      "typescript",
   ],
});

const modules = {
   syntax: {
      highlight: function (text: string) {
         return hljs.highlightAuto(text).value;
      },
   },
   clipboard: {
      matchVisual: false,
   },
   toolbar: [
      [
         { header: "1" },
         { header: "2" },
         { font: [] },
         { list: "ordered" },
         { list: "bullet" },
         { indent: "-1" },
         { indent: "+1" },
         "code-block",
         "clean",
         "blockquote",
         "strike",
         "align",
         "underline",
         "italic",
         "bold",
         "color",
         "link",
         "image",
         "video",
         "background",
      ],
   ],
};

const formats = [
   "header",
   "font",
   "size",
   "bold",
   "italic",
   "underline",
   "align",
   "strike",
   "script",
   "blockquote",
   "background",
   "list",
   "bullet",
   "indent",
   "link",
   "image",
   "color",
   "code-block",
   "video",
];

// const dateFormatter = new Intl.DateTimeFormat(undefined, {
//    dateStyle: "medium",
//    timeStyle: "short",
// });

const Content = ({ post, loading }: { post: Post; loading: boolean }) => {
   const postImageUrl = import.meta.env.VITE_REACT_SUPABASE_IMAGE_URL;
   const [tempPostImage, setTempPostImage] = useState<string | File | null>(
      post?.image
   );
   const [imageFile, setImageFile] = useState<File | null>(null);
   const { theme } = useTheme();
   const [isEditing, setIsEditing] = useState(false);
   const [isEditable, setIsEditable] = useState<boolean>(false);
   const [commentText, setCommentText] = useState("");
   const [title, setTitle] = useState<string>(post?.title);
   const [postImage, setPostImage] = useState<string | File | null>(
      post?.image
   );
   const [snippet, setSnippet] = useState<string>(post?.snippet);
   const [titleError, setTitleError] = useState<string | "">("");
   const [commentError, setCommentError] = useState<string | "">("");
   const [snippetError, setSnippetError] = useState<string | "">("");
   const [tempTitle, setTempTitle] = useState<string | "">(post?.title);
   const [content, setContent] = useState<string | "">(post?.content);
   const [contentError, setContentError] = useState<string | "">("");
   const [postImageError, setPostImageError] = useState<string | "">("");
   const [tempContent, setTempContent] = useState<string | "">(post?.content);
   const [tempSnippet, setTempSnippet] = useState<string | "">(post?.snippet);
   const [bookmarkCount, setBookmarkCount] = useState(
      post?.bookmark_count || 0
   );
   const [bio, setBio] = useState("");
   const [username, setUsername] = useState("");
   const [joinedDate, setJoinedDate] = useState("");
   const [comments, setComments] = useState<Comment[]>([]);
   const [commentCount, setCommentCount] = useState(post?.comment_count || 0);
   const [likeCount, setLikeCount] = useState(post?.likes_count || 0);
   const [isBookmarked, setIsBookmarked] = useState(false);
   const [isLiked, setIsLiked] = useState(false);
   const [isAuthorized, setIsAuthorized] = useState<boolean | undefined>(
      undefined
   );
   const imageInputRef = useRef<HTMLInputElement | null>(null);
   const { user } = useFetchUser();
   const userId = user?.id;
   const name = user?.display_name;
   const userImg = user?.display_pic;
   const postId = post?.id;
   const profile_id = post?.profile_id;
   const { user: currentUser } = useFetchUser();
   const [isFollowing, setIsFollowing] = useState(false);
   const [followersCount, setFollowersCount] = useState(0);
   const [followingCount, setFollowingCount] = useState(0);
   const currentUserId = currentUser?.id;

   // check following
   useEffect(() => {
      async function checkFollowing() {
         const { data, error } = await supabase
            .from("follow")
            .select()
            .eq("follower_id", currentUserId)
            .eq("following_id", profile_id);

         if (data && data.length > 0) {
            setIsFollowing(true);
         } else {
            setIsFollowing(false);
         }
      }

      if (currentUserId && profile_id) {
         checkFollowing();
      }
   }, [currentUserId, profile_id]);

   // Function to handle the follow/unfollow action
   const handleFollow = async () => {
      if (isFollowing) {
         // If already following, unfollow
         const { error } = await supabase
            .from("follow")
            .delete()
            .eq("follower_id", currentUserId)
            .eq("following_id", profile_id);

         if (!error) {
            setIsFollowing(false);
            setFollowersCount((prevCount) => prevCount - 1);
         }
      } else {
         // If not following, follow
         const { error } = await supabase.from("follow").insert([
            {
               follower_id: currentUserId,
               following_id: profile_id,
            },
         ]);

         if (!error) {
            setIsFollowing(true);
            setFollowersCount((prevCount) => prevCount + 1);
         }
      }
   };

   // funtion to manage following count ]]==
   useEffect(() => {
      async function fetchCounts() {
         // Fetch the followers count
         const { data: followersData, error: followersError } = await supabase
            .from("follow")
            .select("follower_id")
            .eq("following_id", profile_id);

         if (!followersError) {
            setFollowersCount(followersData.length);
         }

         // Fetch the following count
         const { data: followingData, error: followingError } = await supabase
            .from("follow")
            .select("following_id")
            .eq("follower_id", profile_id);

         if (!followingError) {
            setFollowingCount(followingData.length);
         }
      }

      if (currentUserId) {
         fetchCounts();
      }
   }, [currentUserId, profile_id]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const { data: profiles, error } = await supabase
               .from("profiles")
               .select("*")
               .eq("id", profile_id)
               .single();

            if (error) {
               console.error("Error fetching profile:", error);
            } else {
               const bio = profiles?.bio;
               const joinedDate = profiles?.created_at;
               const username = profiles?.username;
               const isAuthorized = profiles?.isVerified === true;
               setBio(bio);
               setUsername(username);
               setIsAuthorized(isAuthorized);
               setJoinedDate(joinedDate);
            }
         } catch (error) {
            console.error("An error occurred:", error);
         }
      };
      fetchData();
   }, [profile_id]);

   const updateCommentCount = (newCount: number) => {
      setCommentCount(newCount);
   };

   // post editing functionalities

   const handleIsEditable = (bool: boolean) => {
      setIsEditable(bool);
   };

   const handleOnChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (title) setTitleError("");
      setTitle(e.target.value);
   };

   const handleOnChangeSnippet = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (snippet) setSnippetError("");
      setSnippet(e.target.value);
   };

   // const handleOnChangeContent = (content: string) => {
   //    if (content.trim() !== "<p><br></p>") setContentError("");
   //    setContent(con);
   // };
   const handleOnChangePostImage = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0]; // Safely access the selected file

      if (selectedFile) {
         // Reset the error when a valid image is selected
         setPostImageError("");

         // Update the imageFile state with the selected file
         setImageFile(selectedFile);

         // Set tempPostImage to the selected file
         setTempPostImage(selectedFile);
      }
   };

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Validation checks (title, snippet, content, and postImage)
      if (title.trim() === "") {
         setTitleError("Title is required.");
         return;
      }

      if (snippet.trim() === "") {
         setSnippetError("Snippet is required.");
         return;
      }

      if (content.trim() === "<p><br></p>") {
         setContentError("Content is required.");
         return;
      }

      if (!tempPostImage) {
         setPostImageError("Image is required.");
         return;
      }

      const currentImage = post ? post.image : "";
      // Upload the new image if it has changed
      if (imageFile) {
         try {
            setIsEditing(true);

            const randomSuffix = Math.floor(
               1000000000 + Math.random() * 9000000000
            ).toString();

            // Append the random number to the image name
            const imageName = `${randomSuffix}-${imageFile.name}`;
            const { data: imageUploadData, error: imageUploadError } =
               await supabase.storage
                  .from("post_images")
                  .upload(`${imageName}`, tempPostImage, {
                     cacheControl: "3600",
                     upsert: false,
                  });

            if (imageUploadError) {
               console.error("Error uploading image:", imageUploadError);
               // Handle the error, e.g., display an error message
               console.log(tempPostImage, currentImage);
               return;
            } else {
               // console.log("upload success", imageUploadData);
            }

            // Update the post with the new data (including the updated image URL)
            const updatedPostData = {
               title: title,
               snippet: snippet,
               content: content,
               image: `${postImageUrl}${imageUploadData.path}`,
            };

            const { data: postUpdateData, error: postUpdateError } =
               await supabase
                  .from("posts")
                  .update(updatedPostData)
                  .eq("id", post.id)
                  .single();

            if (postUpdateError) {
               console.error("Error updating the post:", postUpdateError);
               console.log(postUpdateData);

               return;
            } else {
               console.log(postUpdateData);
            }
         } catch (error) {
            console.error("Error updating post and image:", error);
            // Handle the error, e.g., display an error message
            return;
         }
      } else {
         // The image has not changed, update only post content
         const { data, error } = await supabase
            .from("posts")
            .update({
               title: title,
               snippet: snippet,
               content: content,
            })
            .eq("id", postId)
            .single();

         if (error) {
            console.error("Error updating the post:", error);
            // Handle the error, e.g., display an error message
            return;
         } else {
            toast.success("Post Updated Successfully !");
            window.location.reload();
         }
      }
      setIsEditing(false);
      setTitle(title || "");
      setSnippet(snippet || "");
      setContent(content || "");
      setPostImage(tempPostImage || null);
      handleIsEditable(false);
   };

   // function to submit Comment
   const handleSubmitComment = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (commentText.trim() === "") {
         setCommentError("Comment field cant be empty.");
         return;
      }

      try {
         // Make an API request to submit the comment using Supabase
         const { data, error } = await supabase
            .from("comments")
            .insert([
               {
                  content: commentText,
                  profile_id: userId,
                  post_id: postId,
               },
            ])
            .select();

         if (!error) {
            setCommentText("");
            setCommentCount((prev: number) => prev + 1);

            if (data && data.length > 0) {
               setComments([data[0], ...comments]);
            }
            fetchComments();
            toast.success("comment sent");
         } else {
            // Handle errors, e.g., show an error message
            toast.error("Failed to upodate Post");
            console.error("Error submitting comment:", error);
         }
      } catch (error) {
         console.error("Error submitting comment:", error);
      }
   };

   // Fetch comments when the component mounts
   useEffect(() => {
      fetchComments();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   // comment like and bookmmark functionalitt

   // function to check if post has already been bookmarked by the currentUser, this is used to determine the svg icon to be displayed
   useEffect(() => {
      const checkBookmarkStatus = async () => {
         if (postId && userId) {
            const { data, error } = await supabase
               .from("bookmarks")
               .select("*")
               .eq("profile_id", userId)
               .eq("post_id", postId);

            if (data && data.length > 0) {
               setIsBookmarked(true);
            }
         }
      };

      checkBookmarkStatus();
   }, [postId, userId]);

   // Check if the user has liked the post alrady, this is used to determine the svg icon to be displayed
   const checkLikeStatus = async () => {
      if (postId && userId) {
         const { data, error } = await supabase
            .from("likes")
            .select("*")
            .eq("profile_id", userId)
            .eq("post_id", postId);

         if (data && data.length > 0) {
            setIsLiked(true);
         }
      }
   };

   //use effect to fire the ChecklikeStatus
   useEffect(() => {
      checkLikeStatus();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [postId, userId]);

   //    function to toggle bookmark button
   const toggleBookmark = async () => {
      if (isBookmarked) {
         // Remove the bookmark
         await supabase
            .from("bookmarks")
            .delete()
            .eq("profile_id", userId)
            .eq("post_id", postId);

         setIsBookmarked(false);
         // Decrement the bookmark_count
         setBookmarkCount((prevCount: number) => prevCount - 1);
      } else {
         // Add the bookmark
         await supabase.from("bookmarks").insert([
            {
               profile_id: userId,
               post_id: postId,
            },
         ]);

         setIsBookmarked(true);
         // Increment the bookmark_count
         setBookmarkCount((prevCount: number) => prevCount + 1);
      }
   };

   // funtion to toggle the like button
   const toggleLike = async () => {
      if (isLiked) {
         // Remove the like
         await supabase
            .from("likes")
            .delete()
            .eq("profile_id", userId)
            .eq("post_id", postId);

         setIsLiked(false);
         // Decrement the like_count (if you have it)
         setLikeCount((prevCount: number) => prevCount - 1);
      } else {
         // Add the like
         await supabase.from("likes").insert([
            {
               profile_id: userId,
               post_id: postId,
            },
         ]);

         setIsLiked(true);
         // Increment the like_count (if you have it)
         setLikeCount((prevCount: number) => prevCount + 1);
      }
   };

   // funtion to fetch the comments
   const fetchComments = async () => {
      try {
         const { data, error } = await supabase
            .from("comments")
            .select("*")
            .eq("post_id", postId)
            .order("created_at", { ascending: false });

         if (!error) {
            setComments(data || []);
         } else {
            console.error("Error fetching comments:", error);
         }
      } catch (error) {
         console.error("Error fetching comments:", error);
      }
   };

return(

    <>
   {post ? (
      <div className="w-full max-w-full mb-10 prose">
         {/* BREADCRUMBS */}
         <h5 className="pb-5 text-wh-300">
            {`Home > ${post?.category_name} > ${post?.title.substring(
               0,
               20
            )}...`}
         </h5>

         {/* CATEGORY AND EDIT */}
         <div className="skeleton-line"></div>

         {/* POST UPDATE  */}
         <form onSubmit={handleSubmit}>
            {/* HEADER */}
            <div className="skeleton-title"></div>
            <div className="skeleton-snippet"></div>

            {/* IMAGE */}
            <div className="skeleton-image"></div>

            {/* CONTENT */}
            <div className="skeleton-content"></div>

            {/* SUBMIT BUTTON */}
            <div className="skeleton-button"></div>
         </form>

         {/* PostSlider Skeleton */}
         <div className="skeleton-slider"></div>

         {/* COMMENT LOGIC */}
         <div className="w-full py-4 mt-4">
            <form className="skeleton-comment-form">
               {/* User Image */}
               <div className="skeleton-user-image"></div>

               {/* Textarea */}
               <div className="skeleton-comment-textarea"></div>
            </form>
         </div>

         {/* Comments */}
         <div className="pt-4 border-t">
            <h1 className="pb-5 mb-5 text-2xl">Comments</h1>
            <div className="skeleton-comments"></div>
         </div>

         {/* SOCIAL LINKS */}
         <div className="hidden w-1/3 mt-10 md:block">
            {/* SocialLinks */}
            <div className="skeleton-social-links"></div>
         </div>
      </div>
   ) : (
      <div className="text-center">
         <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
            Post not found
         </p>
      </div>
   )}
</>;
)
   }
