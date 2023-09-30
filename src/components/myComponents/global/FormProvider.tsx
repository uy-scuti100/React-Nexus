// //;
// import React, { useState, useEffect, useRef, useContext } from "react";
// import { toast } from "react-hot-toast";
// import ReactQuill from "react-quill";
// import { Camera, ChevronLeft } from "lucide-react";
// import Image from "next/image";
// import { Category } from "@/types";
// import hljs from "highlight.js";
// import "react-quill/dist/quill.core.css";
// import "react-quill/dist/quill.snow.css";
// import "highlight.js/styles/atom-one-dark.css";
// import supabase from "@/lib/supabaseClient";
// import { useRouter } from "next/navigation";
// import { useFetchUser } from "@/hooks/useFetchUser";
// import { ModalContext, ModalContextProp } from "@/state/context/modalContext";
// hljs.configure({
//    // optionally configure hljs
//    languages: [
//       "javascript",
//       "python",
//       "c",
//       "c++",
//       "java",
//       "HTML",
//       "css",
//       "matlab",
//       "typescript",
//    ],
// });

// const modules = {
//    toolbar: [
//       [
//          { header: "1" },
//          { header: "2" },
//          { font: [] },
//          { list: "ordered" },
//          { list: "bullet" },
//          { indent: "-1" },
//          { indent: "+1" },
//          "code-block",
//          "clean",
//          "blockquote",
//          "strike",
//          "align",
//          "underline",
//          "italic",
//          "bold",
//          "color",
//          "link",
//          "image",
//          "video",
//          "background",
//       ],
//    ],
// };

// const formats = [
//    "header",
//    "font",
//    "size",
//    "bold",
//    "italic",
//    "underline",
//    "align",
//    "strike",
//    "script",
//    "blockquote",
//    "background",
//    "list",
//    "bullet",
//    "indent",
//    "link",
//    "image",
//    "color",
//    "code-block",
//    "video",
// ];

// // ... Other imports ...

// const PostForm = () => {
//    const postImageUrl = process.env.NEXT_PUBLIC_SUPABASE_IMAGE_URL;
//    const { toggleJotter } = useContext(ModalContext) as ModalContextProp;
//    const [loading, setLoading] = useState(false);
//    const [cats, setCats] = useState<Category[] | null>([]);
//    const [title, setTitle] = useState("");
//    const [categoryId, setCategoryId] = useState("");
//    const [snippet, setSnippet] = useState("");
//    const [content, setContent] = useState("");
//    const [postImage, setPostImage] = useState<string | File | null>(null);
//    const imageInputRef = useRef<HTMLInputElement | null>(null);
//    const { user } = useFetchUser();
//    const userId = user?.id;
//    const router = useRouter();

//    // Fetch categories on component mount
//    useEffect(() => {
//       const fetchCategories = async () => {
//          try {
//             const response = await supabase.from("categories").select("*");
//             if (response.error) {
//                throw response.error;
//             }
//             setCats(response.data || []);
//          } catch (error: any) {
//             console.error("Error fetching categories:", error.message);
//          }
//       };
//       fetchCategories();
//    }, []);

//    const handleCreatePost = async () => {
//       let imageUrl = "";
//       try {
//          setLoading(true);

//          if (postImage instanceof File) {
//             // Generate a random 10-digit number
//             const randomSuffix = Math.floor(
//                1000000000 + Math.random() * 9000000000
//             ).toString();

//             // Append the random number to the image name
//             const imageName = `${randomSuffix}-${postImage.name}`;

//             const { data: imageUploadResponse, error: imageUploadError } =
//                await supabase.storage
//                   .from("post_images")
//                   .upload(imageName, postImage, {
//                      cacheControl: "3600",
//                      upsert: true,
//                   });

//             if (imageUploadResponse) {
//                imageUrl = imageUploadResponse.path;
//             } else {
//                console.error(
//                   "Error uploading image:",
//                   imageUploadError?.message
//                );
//                toast.error("Failed to upload image");
//                return;
//             }
//          }

//          const { data: post, error } = await supabase
//             .from("posts")
//             .insert([
//                {
//                   title,
//                   profile_id: userId,
//                   category_id: categoryId,
//                   snippet,
//                   content,
//                   image: `${postImageUrl}${imageUrl}`,
//                },
//             ])
//             .select();

//          if (post) {
//             console.log(post);
//             toast.success("Post Created");
//             // router.refresh();
//          } else {
//             console.log(post);
//             toast.error("Failed to create Post");
//             console.log(error.message);
//          }
//       } catch (error: any) {
//          console.log("An error occurred:", error.message);
//       } finally {
//          setLoading(false);
//       }
//    };

//    const uploadPostImage = (e: React.ChangeEvent<HTMLInputElement>) => {
//       const imageFile = e.target.files?.[0];
//       if (imageFile) {
//          setPostImage(imageFile);
//       }
//    };

//    return (
//       <>
//          <div className="fixed inset-0 z-50 px-6 py-6 pt-24 mx-auto mt-6 overflow-auto bg-background">
//             <div className="flex items-center justify-start mb-6">
//                <button
//                   disabled={loading}
//                   className="h-8 px-3 text-xs bg-transparent border rounded-md shadow-sm border-input hover:bg-accent hover:text-accent-foreground"
//                   onClick={toggleJotter}>
//                   <ChevronLeft className="w-6 h-6" />
//                   <span className="text-lg">Back</span>
//                </button>
//             </div>

//             <form
//                onSubmit={handleCreatePost}
//                className="w-full pb-20 space-y-8">
//                <div className="grid gap-8">
//                   {/* Image Upload */}
//                   <div>
//                      <label
//                         htmlFor="postImg"
//                         className="flex items-center justify-center cursor-pointer">
//                         <Camera className="w-10 h-10 mb-10" />
//                      </label>

//                      <input
//                         id="postImg"
//                         name="image"
//                         type="file"
//                         accept="image/*"
//                         className="sr-only"
//                         onChange={uploadPostImage}
//                         ref={imageInputRef}
//                         disabled={loading}
//                         style={{ display: "none" }}
//                      />

//                      {postImage instanceof File && (
//                         <Image
//                            src={URL.createObjectURL(postImage)}
//                            alt="Preview"
//                            width={400}
//                            height={400}
//                            className="h-[400px] w-full object-cover"
//                         />
//                      )}
//                   </div>

//                   {/* Title */}
//                   <div>
//                      <label
//                         htmlFor="title"
//                         className="block font-medium text-gray-700">
//                         Title
//                      </label>
//                      <div className="mt-1">
//                         <input
//                            type="text"
//                            id="title"
//                            className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
//                            value={title}
//                            onChange={(e) => setTitle(e.target.value)}
//                            disabled={loading}
//                            required
//                         />
//                      </div>
//                   </div>

//                   {/* Category */}
//                   <div>
//                      <label
//                         htmlFor="category"
//                         className="block font-medium text-gray-700">
//                         Category
//                      </label>
//                      <div className="mt-1">
//                         <select
//                            id="category"
//                            className="flex items-center justify-between w-full px-3 py-2 text-sm bg-transparent border rounded-md shadow-sm h-9 border-input ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
//                            value={categoryId}
//                            onChange={(e) => setCategoryId(e.target.value)}
//                            disabled={loading}
//                            required>
//                            <option value="">Select a category</option>
//                            {cats?.map(
//                               (category) =>
//                                  // Only render the option if category.id is not null
//                                  category.id !== null && (
//                                     <option
//                                        className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
//                                        key={category.id}
//                                        value={category.id}>
//                                        {category.name}
//                                     </option>
//                                  )
//                            )}
//                         </select>
//                      </div>
//                   </div>

//                   {/* Snippet */}
//                   <div>
//                      <label
//                         htmlFor="snippet"
//                         className="block font-medium text-gray-700">
//                         Snippet
//                      </label>
//                      <div className="mt-1">
//                         <textarea
//                            id="snippet"
//                            className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-20 resize-none"
//                            value={snippet}
//                            onChange={(e) => setSnippet(e.target.value)}
//                            disabled={loading}
//                            required></textarea>
//                      </div>
//                   </div>

//                   {/* Content */}
//                   <div>
//                      <label
//                         htmlFor="content"
//                         className="block font-medium text-gray-700">
//                         Content
//                      </label>
//                      <div className="mt-1">
//                         <ReactQuill
//                            theme="snow"
//                            value={content}
//                            onChange={setContent}
//                            className="h-40"
//                            modules={modules}
//                            formats={formats}
//                            placeholder="Write your note"
//                            style={{ height: 300 }}
//                         />
//                      </div>
//                   </div>

//                   {/* Submit Button */}
//                   <div>
//                      <button
//                         type="submit"
//                         className="inline-flex items-center justify-center w-full px-4 py-2 mt-20 text-sm font-medium transition-colors rounded-md shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-blue-900 h-9"
//                         disabled={loading}>
//                         {loading ? "Posting..." : "Post"}
//                      </button>
//                   </div>
//                </div>
//             </form>
//          </div>
//       </>
//    );
// };

// export default PostForm;
