import React, { useEffect, useRef, useState } from "react";
import rehypeKatex from "rehype-katex";
import hljs from "highlight.js";
import "react-quill/dist/quill.core.css";
import "react-quill/dist/quill.snow.css";
import "highlight.js/styles/atom-one-dark.css";
import ReactQuill from "react-quill";
import CategoryAndEdit from "./CategoryAndEdit";
import rehypeRaw from "rehype-raw";
import {
   Camera,
   Disc3,
   Heart,
   MessageCircle,
   MoreHorizontal,
   Pause,
   Play,
   Share,
} from "lucide-react";
import CommentList from "./CommentList";
import toast from "react-hot-toast";
import supabase from "../../lib/supabaseClient";
import { useFetchUser } from "../../hooks/useFetchUser";
import { useTheme } from "../../components/providers/theme/theme-provider";
import { Textarea } from "../../components/ui/textarea";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ReactMarkdown from "react-markdown";
import { Comment, Post } from "../../../types";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ContentSkeleton from "./ContentSkeleton";
import { Badge } from "../../components/ui/badge";
import { calculateReadTime } from "../../lib/readTime";
import AboutWriter from "./AboutWriter";
import Hover from "../posts/Hover";
import remarkGfm from "remark-gfm";
import { Toaster } from "../../components/ui/toaster";
// import remarkParse from "remark-parse";
// import remarkRehype from 'remark-rehype'

dayjs.extend(relativeTime);

// const dateFormatter = new Intl.DateTimeFormat(undefined, {
//    dateStyle: "medium",
// });
function cn(...classes: string[]) {
   return classes.filter(Boolean).join(" ");
}
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
      // toggle to add extra line breaks when pasting HTML:
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

const Content = ({ post, loading }: { post: Post; loading: boolean }) => {
   const postImageUrl = import.meta.env.VITE_REACT_SUPABASE_IMAGE_URL;
   const [imageFile, setImageFile] = useState<File | null>(null);
   const { theme } = useTheme();
   const { user } = useFetchUser();
   const navigate = useNavigate();
   const [isEditing, setIsEditing] = useState(false);
   const [isEditable, setIsEditable] = useState<boolean>(false);
   const [commentText, setCommentText] = useState("");
   const { user: currentUser } = useFetchUser();
   const [isFollowing, setIsFollowing] = useState(false);
   const [isPublished, setIsPublished] = useState(false);
   const [followersCount, setFollowersCount] = useState(0);
   const [followingCount, setFollowingCount] = useState(0);
   const [title, setTitle] = useState<string>("");
   const [titleError, setTitleError] = useState<string | "">("");
   const [commentError, setCommentError] = useState<string | "">("");
   const [snippetError, setSnippetError] = useState<string | "">("");
   const [contentError, setContentError] = useState<string | "">("");
   const [postImageError, setPostImageError] = useState<string | "">("");
   const [snippet, setSnippet] = useState<string>(post?.snippet);
   const [tempTitle, setTempTitle] = useState<string | "">(post?.title);
   const [content, setContent] = useState<string | "">(post?.content);
   const [tempContent, setTempContent] = useState<string | "">(post?.content);
   const [tempSnippet, setTempSnippet] = useState<string | "">(post?.snippet);
   const userId = user?.id;
   const userImg = user?.display_pic;
   const postId = post?.id;
   const author_image = post?.author_image;
   const author = post?.author;
   const profile_id = post?.profile_id;
   const currentUserId = currentUser?.id;
   const [bookmarkCount, setBookmarkCount] = useState(0);
   const [bio, setBio] = useState("");
   const [username, setUsername] = useState("");
   const [category_Ids, setCategory_Ids] = useState<Array<string>>([]);
   const [readTime, setReadTime] = useState(0);
   const [joinedDate, setJoinedDate] = useState("");
   const [comments, setComments] = useState<Comment[]>([]);
   const [commentCount, setCommentCount] = useState(0);
   const [likeCount, setLikeCount] = useState(0);
   const [isBookmarked, setIsBookmarked] = useState(false);
   const [isLiked, setIsLiked] = useState(false);
   const [tempPostImage, setTempPostImage] = useState<string | File | null>(
      null
   );
   const [postImage, setPostImage] = useState<string | File | null>(
      post?.image
   );
   const [isAuthorized, setIsAuthorized] = useState<boolean | undefined>(
      undefined
   );
   const imageInputRef = useRef<HTMLInputElement | null>(null);
   const [postCategories, setPostCategories] = useState<
      Array<{ id: string; name: string; type: string }>
   >([]);

   const renderers = {
      image: (props: any) => {
         return <img src={props.src} alt={props.alt} />;
      },
   };
   // calculate read time
   useEffect(() => {
      const newReadTime = calculateReadTime(content as string);
      setReadTime(newReadTime);
   }, [content, postId]);
   // scroll to top
   const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
   };
   // navigate home
   const goHome = () => {
      navigate("/");
   };
   // setting iniial states
   useEffect(() => {
      const fetchData = async () => {
         try {
            if (post) {
               setTitle(post.title);
               setSnippet(post.snippet);
               setContent(post.content);
               setBookmarkCount(post.bookmark_count as number);
               setLikeCount(post.likes_count as number);
               setCommentCount(post.comment_count as number);
               setCategory_Ids(post.category_Ids);
               setTempPostImage(post.image);
            }

            if (category_Ids && category_Ids.length > 0) {
               const topicData = await supabase
                  .from("topics")
                  .select("id, name, type")
                  .in("id", category_Ids);

               const subtopicData = await supabase
                  .from("subtopics")
                  .select("id, name, type")
                  .in("id", category_Ids);

               const subsubtopicData = await supabase
                  .from("subsubtopics")
                  .select("id, name, type")
                  .in("id", category_Ids);

               if (
                  topicData.error ||
                  subtopicData.error ||
                  subsubtopicData.error
               ) {
                  console.error(
                     "Error fetching category names:",
                     topicData.error,
                     subtopicData.error,
                     subsubtopicData.error
                  );
               } else {
                  // Combine the results into one array of category names
                  const combinedData = [
                     ...topicData.data,
                     ...subtopicData.data,
                     ...subsubtopicData.data,
                  ];

                  // Extract the names and set the state
                  const categoryNames = combinedData.map((category) => ({
                     id: category.id,
                     name: category.name,
                     type: category.type,
                  }));

                  setPostCategories(categoryNames);
               }
            }
         } catch (error: any) {
            console.error("An error occurred:", error.message);
         }
      };

      fetchData();
   }, [post, category_Ids, postId]);

   // check following
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
   // check following useeffect
   useEffect(() => {
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

   // fetching article author data
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

   // post editing functionalities

   const handleIsEditable = (bool: boolean) => {
      setIsEditable(bool);
   };

   const handleOnChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (title) setTitleError("");
      setTitle(e.target.value);
   };

   const handleOnChangeSnippet = (
      e: React.ChangeEvent<HTMLTextAreaElement>
   ) => {
      if (snippet) setSnippetError("");
      setSnippet(e.target.value);
   };

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

               return;
            } else {
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
   // commentcount
   const updateCommentCount = (newCount: number) => {
      setCommentCount(newCount);
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

   const [isSpeaking, setIsSpeaking] = useState(false);
   const [speechSynthesisInstance, setSpeechSynthesisInstance] =
      useState<SpeechSynthesisUtterance | null>(null);

   function textToSpeech(content: string) {
      if (isSpeaking) {
         // If speech is currently in progress, pause it
         window.speechSynthesis.pause();
         setIsSpeaking(false);
      } else {
         if (speechSynthesisInstance) {
            // If speech is paused, resume it
            window.speechSynthesis.resume();
            setIsSpeaking(true);
         } else {
            const text = content;
            const instance = new SpeechSynthesisUtterance(text);

            instance.onstart = () => {
               setIsSpeaking(true);
            };

            instance.onend = () => {
               setIsSpeaking(false);
            };

            setSpeechSynthesisInstance(instance); // Store it in the component's state
            window.speechSynthesis.speak(instance);
         }
      }
   }

   // Add a listener for beforeunload event to stop speech when leaving the page
   window.addEventListener("beforeunload", () => {
      if (isSpeaking) {
         window.speechSynthesis.cancel();
      }
   });
   const location = useLocation();

   useEffect(() => {
      // Stop speech when navigating to a new page
      if (speechSynthesisInstance) {
         window.speechSynthesis.cancel();
         setIsSpeaking(false);
         setSpeechSynthesisInstance(null);
      }
   }, [location]);

   return (
      <>
         {post ? (
            <div className="w-full max-w-full mb-10 prose">
               {/* CATEGORY AND EDIT */}
               <CategoryAndEdit
                  isEditable={isEditable}
                  handleIsEditable={handleIsEditable}
                  title={title}
                  setTitle={setTitle}
                  tempTitle={tempTitle}
                  setTempTitle={setTempTitle}
                  content={content}
                  setContent={setContent}
                  tempContent={tempContent}
                  setTempContent={setTempContent}
                  snippet={snippet}
                  setSnippet={setSnippet}
                  tempSnippet={tempSnippet}
                  setTempSnippet={setTempSnippet}
                  postImage={postImage}
                  setPostImage={setPostImage}
                  tempPostImage={tempPostImage}
                  setTempPostImage={setTempPostImage}
                  post={post}
                  categoryIds={category_Ids}
                  postCategories={postCategories}
               />
               {/* POST UPDATE  */}
               <form onSubmit={handleSubmit}>
                  {/* TITLE */}
                  {isEditable ? (
                     <div>
                        <input
                           type="text"
                           className="w-full p-3 my-3 border-2 rounded-md bg-wh-50 dark:bg-black"
                           placeholder="Title"
                           onChange={handleOnChangeTitle}
                           value={title}
                        />
                        {titleError && (
                           <p className="mt-1 text-red-600">{titleError}</p>
                        )}
                     </div>
                  ) : (
                     <h3 className="mt-3 mb-[5px] text-[2rem] md:text-[2.625rem] leading-10 break-words box-border font-bold capitalize lead">
                        {title}
                     </h3>
                  )}

                  {/* SNIPPET */}
                  {isEditable ? (
                     <div>
                        <textarea
                           className="w-full h-24 p-3 mb-3 border-2 rounded-md resize-none bg-wh-50 dark:bg-black"
                           placeholder="Snippet"
                           onChange={handleOnChangeSnippet}
                           value={snippet}
                        />
                        {snippetError && (
                           <p className="mt-1 text-red-600">{snippetError}</p>
                        )}
                     </div>
                  ) : (
                     <p className="mt-[5px] mb-6 dark:text-wh-100 md:text-lg leading-6 ">
                        {post?.snippet}
                     </p>
                  )}

                  {/* features== ---- audio, share and more */}
                  <div className="flex flex-col gap-3">
                     <div className="flex flex-wrap items-start gap-5 pb-3">
                        <Hover
                           profile_id={profile_id}
                           author_image={author_image}
                           author={author}
                           isFollowing={isFollowing}
                           isAuthorized={isAuthorized}
                           handleFollow={handleFollow}
                           username={username}
                           followingCount={followingCount}
                           followersCount={followersCount}
                           joinedDate={joinedDate}
                           bio={bio}
                        />

                        <div className="flex items-center gap-3">
                           <p className="text-sm text-[#1A8917]">
                              {" "}
                              {isFollowing ? "Following" : ""}{" "}
                           </p>
                        </div>

                        <div className="flex items-center gap-3 pt-1">
                           <p className="text-xs">{readTime} min read.</p>{" "}
                           <p suppressHydrationWarning className="text-xs">
                              {dayjs().diff(post?.created_at, "seconds", true) <
                              30
                                 ? "just now"
                                 : dayjs(post?.created_at).fromNow()}
                           </p>
                        </div>
                     </div>
                     <div className="flex items-center gap-6 pb-16 opacity-70">
                        <p
                           onClick={() => textToSpeech(content)}
                           className="flex items-center gap-2 px-4 py-2 text-xs border rounded-full cursor-pointer border-foreground/20">
                           {" "}
                           {!isSpeaking ? (
                              <Play className="w-4 h-4 " />
                           ) : (
                              <Pause className="w-4 h-4 " />
                           )}
                           {!isSpeaking ? "Play" : "Pause"}
                        </p>
                        <p className="flex items-center gap-2 px-4 py-2 text-xs border rounded-full cursor-pointer border-foreground/20">
                           <Share className="w-4 h-4 " /> Share
                        </p>
                        <p className="flex items-center gap-2 px-4 py-2 text-xs border rounded-full cursor-pointer border-foreground/20">
                           <MoreHorizontal className="w-4 h-4 " /> More
                        </p>
                     </div>
                  </div>

                  {/* IMAGE */}
                  {isEditable ? (
                     <>
                        <form className="relative py-10 my-10 mb-20 rounded-xl">
                           <h1 className="mt-4 mb-8 text-xl font-bold text-center">
                              Change Post Image
                           </h1>
                           <label
                              htmlFor="postImage"
                              className="cursor-pointer ">
                              <div className="flex items-center justify-center mb-8">
                                 <Camera className="w-12 h-12" />
                              </div>
                           </label>
                           <input
                              id="postImage"
                              type="file"
                              accept="image/*"
                              onChange={handleOnChangePostImage}
                              ref={imageInputRef}
                              style={{ display: "none" }}
                           />

                           {postImageError && (
                              <p className="mt-1 text-red-600">
                                 {postImageError}
                              </p>
                           )}

                           {tempPostImage && (
                              <div className="flex items-center justify-center">
                                 <img
                                    src={
                                       typeof tempPostImage === "string"
                                          ? `${post?.image}`
                                          : URL.createObjectURL(tempPostImage)
                                    }
                                    alt="Preview"
                                    style={{
                                       objectFit: "cover",
                                       width: "100%",
                                       height: "350px",
                                    }}
                                    className="-z-20"
                                 />
                              </div>
                           )}
                        </form>
                     </>
                  ) : (
                     <div className="relative w-auto mt-2 mb-16 h-96">
                        <img
                           alt={post?.title}
                           src={post?.image}
                           style={{
                              objectFit: "cover",
                              maxWidth: "100%",
                              maxHeight: "100%",
                              width: "100%",
                              height: "100%",
                           }}
                           className="duration-700 ease-in-out"
                        />
                     </div>
                  )}

                  {/* content */}
                  <div className={isEditable ? "" : "w-full max-w-full"}>
                     {isEditable ? (
                        <ReactQuill
                           modules={modules}
                           formats={formats}
                           theme="snow"
                           // style={{ height: 300 }}
                           className="h-[80vh]"
                           value={content} // or defaultValue={content}
                           onChange={(value) => setContent(value)}
                        />
                     ) : (
                        <div className="ql-snow">
                           <div className="ql-editor">
                              <ReactMarkdown
                                 rehypePlugins={[rehypeRaw, rehypeKatex]}
                                 className="text-lg leading-8 md:text-xl">
                                 {content}
                              </ReactMarkdown>
                           </div>
                        </div>
                     )}
                  </div>

                  {/* SUBMIT BUTTON */}
                  {isEditable && (
                     <div className="flex justify-end">
                        <button
                           type="submit"
                           disabled={isEditing}
                           className={` ${
                              isEditing ?? "bg-wh-500"
                           } px-5 py-2 my-20 font-semibold bg-accent-red flex gap-1 items-center rounded-full text-black`}>
                           {isEditing && (
                              <Disc3 className="w-5 h-5 mr-3 animate-spin" />
                           )}
                           SUBMIT
                        </button>
                     </div>
                  )}
               </form>
               {/* post categories */}
               <div className="flex flex-wrap items-center gap-4 py-5">
                  {postCategories.map((cat, key) => {
                     let type;

                     if (cat.type === "Topic") {
                        type = "tag";
                     } else if (cat.type === "Subtopic") {
                        type = "subtopic";
                     } else {
                        type = "subsubtopic";
                     }

                     return (
                        <Link
                           to={`/${type}/${cat.id}`}
                           key={cat.id}
                           onClick={scrollToTop}>
                           <Badge className="flex items-center px-3 py-2 font-normal border rounded-full">
                              # {cat.name}
                           </Badge>
                        </Link>
                     );
                  })}
               </div>

               {/* like , bookmark and comment action buttons */}
               <div className="flex items-center justify-between w-full px-4 py-5 border-y md:gap-20 md:justify-normal ">
                  <div className="flex items-center gap-1">
                     <button onClick={user ? toggleBookmark : goHome}>
                        {isBookmarked ? (
                           // Bookmarked
                           <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              // @ts-ignore
                              className="ut">
                              <title>unbookmark</title>
                              <path
                                 d="M7.5 3.75a2 2 0 0 0-2 2v14a.5.5 0 0 0 .8.4l5.7-4.4 5.7 4.4a.5.5 0 0 0 .8-.4v-14a2 2 0 0 0-2-2h-9z"
                                 fill="currentcolor"></path>
                           </svg>
                        ) : (
                           // Not bookmarked
                           <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill={theme === "dark" ? "#ffffff" : "#000"}
                              // @ts-ignore
                              className="no">
                              <title>bookmark</title>
                              <path
                                 d="M17.5 1.25a.5.5 0 0 1 1 0v2.5H21a.5.5 0 0 1 0 1h-2.5v2.5a.5.5 0 0 1-1 0v-2.5H15a.5.5 0 0 1 0-1h2.5v-2.5zm-11 4.5a1 1 0 0 1 1-1H11a.5.5 0 0 0 0-1H7.5a2 2 0 0 0-2 2v14a.5.5 0 0 0 .8.4l5.7-4.4 5.7 4.4a.5.5 0 0 0 .8-.4v-8.5a.5.5 0 0 0-1 0v7.48l-5.2-4a.5.5 0 0 0-.6 0l-5.2 4V5.75z"
                                 fill="currentcolor"></path>
                           </svg>
                        )}
                     </button>
                     <p>{bookmarkCount > 0 ? <p>{bookmarkCount}</p> : ""}</p>
                  </div>
                  <a
                     href="#comment"
                     className="flex items-center gap-1 cursor-pointer">
                     <MessageCircle className="w-6 h-6 opacity-70" />
                     <p>{commentCount > 0 ? <p>{commentCount}</p> : ""}</p>
                  </a>
                  <div className="flex items-center gap-1">
                     <button onClick={user ? toggleLike : goHome}>
                        {isLiked ? (
                           <svg
                              aria-label="Unlike"
                              // @ts-ignore
                              class="x1lliihq x1n2onr6"
                              color="rgb(255, 48, 64)"
                              fill={theme === "dark" ? "#ffffff" : "#000"}
                              height="24"
                              role="img"
                              viewBox="0 0 48 48"
                              width="24">
                              <title>Unlike</title>
                              <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
                           </svg>
                        ) : (
                           <Heart className="w-6 h-6 opacity-70" />
                        )}
                     </button>
                     <p>{likeCount > 0 ? <p>{likeCount}</p> : ""}</p>
                  </div>
               </div>

               {/* COMMENT LOGIC */}
               <div className="w-full py-4 mt-4">
                  <form
                     className="flex flex-col items-center w-full gap-3"
                     onSubmit={user ? handleSubmitComment : goHome}>
                     <div className="flex items-center justify-between w-full gap-3">
                        <div className=" w-[60px]">
                           {user && userId ? (
                              <Link
                                 to={`/account/${userId}`}
                                 onClick={scrollToTop}>
                                 <img
                                    src={userImg || "/png.png"}
                                    width={48}
                                    height={48}
                                    alt="user-profile-img"
                                    className="rounded-full border border-accent-orange w-[48px] h-[48px] cursor-pointer object-cover"
                                 />
                              </Link>
                           ) : (
                              <img
                                 src={"/png.png"}
                                 width={48}
                                 height={48}
                                 alt="user-profile-img"
                                 className="rounded-full border border-accent-orange w-[48px] h-[48px]"
                              />
                           )}
                        </div>
                        <Textarea
                           placeholder="Add a comment..."
                           id="comment"
                           style={{
                              height: "100px",
                              resize: "none",
                           }}
                           value={commentText}
                           onChange={(e) => setCommentText(e.target.value)}
                        />
                        {commentError && (
                           <p className="mt-1 text-primary-500">
                              {commentError}
                           </p>
                        )}
                     </div>
                     <div className="flex justify-end w-full">
                        <button
                           type="submit"
                           className="w-full px-5 py-2 mt-5 font-semibold text-black rounded-full md:w-auto bg-accent-red hover:bg-wh-500 dark:text-black">
                           POST
                        </button>
                     </div>
                  </form>
               </div>

               {/* displaying comments on a post */}
               <div className="pt-4 border-t">
                  {/* Pass the comments array to the CommentList component */}
                  {comments && comments.length > 0 && (
                     <h1 className="pb-5 mb-5 text-2xl">
                        Comments ( {comments.length} )
                     </h1>
                  )}
                  <CommentList
                     comments={comments}
                     fetchComments={fetchComments}
                     commentCount={commentCount}
                     updateCommentCount={updateCommentCount}
                  />
               </div>
            </div>
         ) : (
            ""
         )}
         {loading && <ContentSkeleton />}

         <AboutWriter
            profile_id={profile_id}
            author_image={author_image}
            author={author}
            isAuthorized={isAuthorized}
            handleFollow={handleFollow}
            postId={postId}
            isFollowing={isFollowing}
            categoryIds={category_Ids}
         />
      </>
   );
};

export default Content;
