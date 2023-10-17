import { X, PencilLine, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "../../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useFetchUser } from "../../hooks/useFetchUser";
import supabase from "../../lib/supabaseClient";
import { useState } from "react";
import { Post } from "../../../types";

type Props = {
   postCategories: Array<{ id: string; name: string }>;
   categoryIds: string[];
   isEditable: boolean;
   handleIsEditable: (isEditable: boolean) => void;
   title: string;
   setTitle: (title: string) => void;
   content: string;
   setContent: (content: string) => void;
   snippet: string;
   setSnippet: (snippet: string) => void;
   tempTitle: string;
   setTempTitle: (tempTitle: string) => void;
   tempContent: string;
   setTempContent: (tempContent: string) => void;
   tempSnippet: string;
   setTempSnippet: (tempSnippet: string) => void;
   post: Post;
   postImage: any;
   setPostImage: (postImage: any) => void;
   tempPostImage: any;
   setTempPostImage: (tempPostImage: any) => void;
};

const CategoryAndEdit = ({
   post,
   isEditable,
   handleIsEditable,
   title,
   setTitle,
   tempTitle,
   setTempTitle,
   snippet,
   setSnippet,
   tempSnippet,
   setTempSnippet,
   content,
   setContent,
   tempContent,
   setTempContent,
   postImage,
   setPostImage,
   tempPostImage,
   setTempPostImage,
}: Props) => {
   const navigate = useNavigate();
   const [showDialog, setShowDialog] = useState(false);
   const handleEnableEdit = () => {
      handleIsEditable(!isEditable);
      setTempTitle(title);
      setTempPostImage(postImage);
      setTempSnippet(snippet);
      setTempContent(content);
   };

   const handleCancelEdit = () => {
      handleIsEditable(!isEditable);
      setTitle(tempTitle);
      setContent(tempContent);
      setSnippet(tempSnippet);
      setPostImage(tempPostImage);
   };

   const { user } = useFetchUser();
   const userId = user?.id;

   const handleShowDialog = () => {
      setShowDialog(true);
   };

   const handleDelete = async () => {
      try {
         const { error } = await supabase
            .from("posts")
            .delete()
            .eq("id", post.id);
         if (!error) {
            toast.success("Post deleted successfully !");
         } else {
            toast.error("Failed to upodate Post");
            console.error("Error updating Post:", error);
         }
      } catch (error) {
         toast.error("Failed to delete !");
         console.error(error);
      } finally {
         navigate("/posts");
      }
   };

   return (
      <div className="flex items-center justify-end">
         {/* <Link
            to={`/categories/${
               postCategories.length > 0 ? postCategories[0].id : ""
            }`}>
            <h4 className="px-5 py-2 text-sm font-bold capitalize bg-accent-orange text-white-900">
               {postCategories.length > 0 ? postCategories[0].name : ""}
            </h4>
         </Link> */}

         {post?.profile_id === userId && (
            <div>
               {isEditable ? (
                  <div className="flex justify-between gap-3">
                     <button onClick={handleCancelEdit}>
                        <X className="w-6 h-6 cursor-pointer" />
                     </button>
                  </div>
               ) : (
                  <div className="flex items-center gap-8 pb-8">
                     <button onClick={handleEnableEdit}>
                        <PencilLine className="w-6 h-6 cursor-pointer" />
                     </button>
                     <div onClick={handleShowDialog}>
                        <Trash2 className="w-6 h-6 cursor-pointer" />
                     </div>
                     {showDialog && (
                        <div className="fixed inset-0 z-50 h-screen mx-5 backdrop-blur">
                           <div className="fixed grid w-full max-w-lg gap-4 p-6 duration-200 transform -translate-x-1/2 -translate-y-1/2 border shadow-lg left-1/2 top-1/2 bg-background animate-in fade-in-0">
                              <div
                                 onClick={() => setShowDialog(false)}
                                 className="absolute cursor-pointer right-2 top-2">
                                 <X className="w-6 h-6" />
                              </div>
                              <div>
                                 <div className="pt-5">
                                    <h1 className="text-lg font-semibold leading-none tracking-tight">
                                       Are you sure you want to delete this
                                       post?
                                    </h1>
                                    <p className="pt-3 text-sm text-muted-foreground">
                                       This action cannot be undone. This will
                                       permanently delete your post.
                                    </p>
                                 </div>
                                 <footer className="flex justify-end pt-5">
                                    <Button
                                       type="button"
                                       variant="destructive"
                                       onClick={handleDelete}>
                                       delete
                                    </Button>
                                 </footer>
                              </div>
                           </div>
                        </div>
                     )}
                  </div>
               )}
            </div>
         )}
      </div>
   );
};

export default CategoryAndEdit;
