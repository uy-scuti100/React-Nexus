import * as z from "zod";
import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.core.css";
import "react-quill/dist/quill.snow.css";
import "highlight.js/styles/atom-one-dark.css";
import hljs from "highlight.js";
import { ChevronLeft, Image, X } from "lucide-react";
import "react-quill/dist/quill.core.css";
import "react-quill/dist/quill.snow.css";
import "highlight.js/styles/atom-one-dark.css";
import { useFetchUser } from "../../hooks/useFetchUser";
import supabase from "../../lib/supabaseClient";
import { Button } from "../../components/ui/button";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "../../components/ui/form";
import { useNavigate } from "react-router-dom";
import "./highlight.css";
import debounce from "lodash.debounce";
import { Badge } from "../../components/ui/badge";

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

interface Category {
   id: string;
   created_at: Date;
   name: string;
}

interface SuggestionProp {
   id: string;
   name: string;
}
const titleMaxLength = 80;
const snippetMaxLength = 500;
const contentMinLength = 1;

type NoteFormValues = z.infer<typeof formSchema>;
const formSchema = z.object({
   title: z.string().min(contentMinLength).max(titleMaxLength),
   snippet: z.string().min(contentMinLength).max(snippetMaxLength),
   content: z.string().min(contentMinLength),
   image: z.string(),
});

// category_id:(z.string()), //
const PostForm = () => {
   const postImageUrl = import.meta.env.VITE_REACT_SUPABASE_IMAGE_URL;
   const [loading, setLoading] = useState(false);
   const [drafting, setDrafing] = useState(false);
   const [cats, setCats] = useState<Category[] | null>([]);
   const [postImage, setPostImage] = useState<string | File | null>(null);
   const imageInputRef = useRef<HTMLInputElement | null>(null);
   const [categoryInput, setCategoryInput] = useState("");
   const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
   const [imageSelected, setImageSelected] = useState(false);
   const [categorySuggestions, setCategorySuggestions] = useState<
      Array<SuggestionProp>
   >([]);
   const [selectedCategories, setSelectedCategories] = useState<
      Array<SuggestionProp>
   >([]);
   const { user } = useFetchUser();
   const userId = user?.id;
   const navigate = useNavigate();

   const form = useForm<NoteFormValues>({
      resolver: zodResolver(formSchema),
   });

   const uploadPostImage = (e: React.ChangeEvent<HTMLInputElement>) => {
      const imageFile = e.target.files?.[0]; // Safely access the selected file

      if (imageFile) {
         setPostImage(imageFile);
         setImageSelected(true);
      }
   };

   useEffect(() => {
      const fetchCategories = async () => {
         let { data: categories, error } = await supabase
            .from("categories")
            .select("*");

         if (error) {
            console.error("There was an error fetching data", error.message);
         }
         setCats(categories);
      };
      fetchCategories();
   }, []);

   const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
   };

   const handleCreatePost = async (data: NoteFormValues) => {
      if (selectedCategoryIds.length === 0) {
         // If no categories are selected, show an error message or take appropriate action
         toast.error("Please enter at least one category before submitting.");
         return; // Exit the function without submitting the form
      }
      let imageUrl = "";
      try {
         setLoading(true);

         if (postImage instanceof File) {
            // Generate a random 10-digit number to stop the error of supabase saying image already exists, incase youre using the same image for different posts
            const randomSuffix = Math.floor(
               1000000000 + Math.random() * 9000000000
            ).toString();

            const imageName = `${randomSuffix}-${postImage.name}`;

            const { data: imageUploadResponse, error: imageUploadError } =
               await supabase.storage
                  .from("post_images")
                  .upload(imageName, postImage, {
                     cacheControl: "3600",
                     upsert: true,
                  });

            if (imageUploadResponse) {
               imageUrl = imageUploadResponse.path;
            } else {
               console.error(
                  "Error uploading image:",
                  imageUploadError?.message
               );
               toast.error("Failed to upload image");
               return;
            }
         }

         const { data: post, error } = await supabase
            .from("posts")
            .insert([
               {
                  title: data.title,
                  profile_id: userId,
                  snippet: data.snippet,
                  content: data.content,
                  image: `${postImageUrl}${imageUrl}`,
                  category_Ids: selectedCategoryIds,
               },
            ])
            .select();

         if (post) {
            // Insert records into post_categories for each category ID

            navigate("/posts");
            scrollToTop();

            toast.success("Article Published");
         } else {
            toast.error("Failed to create Post");
         }
      } catch (error: any) {
         console.error("An error occurred:", error.message);
      } finally {
         setLoading(false);
      }
   };
   const debouncedHandleCategoryInputChange = debounce(async (inputValue) => {
      if (inputValue) {
         // Fetch suggestions from Topics, Subtopics, and Subsubtopics separately
         const { data: topics, error: topicsError } = await supabase
            .from("topics")
            .select("id, name, type")
            .ilike("name", `%${inputValue}%`)
            .limit(5);

         const { data: subtopics, error: subtopicsError } = await supabase
            .from("subtopics")
            .select("id, name, type")
            .ilike("name", `%${inputValue}%`)
            .limit(5);

         const { data: subsubtopics, error: subsubtopicsError } = await supabase
            .from("subsubtopics")
            .select("id, name, type")
            .ilike("name", `%${inputValue}%`)
            .limit(5);

         // Combine results from all three tables, handling null data
         const allCategories = [
            ...(topics || []),
            ...(subtopics || []),
            ...(subsubtopics || []),
         ];

         if (topicsError || subtopicsError || subsubtopicsError) {
            console.error(
               "Error fetching category suggestions:",
               topicsError,
               subtopicsError,
               subsubtopicsError
            );
         } else {
            setCategorySuggestions(allCategories);
         }
      } else {
         setCategorySuggestions([]);
      }
   }, 1000);

   // const debouncedHandleCategoryInputChanger = debounce(async (inputValue) => {
   //    // Fetch category suggestions from Supabase
   //    if (inputValue) {
   //       const { data: categories, error } = await supabase
   //          .from("categories")
   //          .select("id, name")
   //          .ilike("name", `%${inputValue}%`)
   //          .limit(5); // Limit the number of suggestions

   //       if (error) {
   //          console.error(
   //             "Error fetching category suggestions:",
   //             error.message
   //          );
   //       } else {
   //          setCategorySuggestions(categories);
   //       }
   //    } else {
   //       setCategorySuggestions([]);
   //    }
   // }, 1000);

   // Function to handle category input changes and fetch suggestions

   const handleCategoryInputChange = async (
      e: React.ChangeEvent<HTMLInputElement>
   ) => {
      const inputValue = e.target.value;
      setCategoryInput(inputValue);

      // Clear category suggestions when the input is empty
      if (!inputValue) {
         setCategorySuggestions([]);
         return; // Exit early to prevent further processing
      }

      // Call the debounced function with the current input value
      debouncedHandleCategoryInputChange(inputValue);
   };

   const handleCategorySelection = (selectedCategory: SuggestionProp) => {
      // Clear category suggestions when a category is selected
      clearCategorySuggestions();

      // Check if the category is already selected
      if (
         !selectedCategories.find(
            (category) => category.id === selectedCategory.id
         )
      ) {
         // Add the selected category to the array
         setSelectedCategories([...selectedCategories, selectedCategory]);
         setSelectedCategoryIds([...selectedCategoryIds, selectedCategory.id]);
      }
      // Clear the input field
      setCategoryInput("");
   };

   const handleRemoveCategory = (index: number) => {
      // Create a copy of the selectedCategories array without the removed category
      const updatedCategories = [...selectedCategories];
      updatedCategories.splice(index, 1); // Remove the category at the specified index
      setSelectedCategories(updatedCategories); // Update the state

      const updatedCategoriesIds = [...selectedCategoryIds];
      updatedCategoriesIds.splice(index, 1);
      setSelectedCategoryIds(updatedCategoriesIds);
   };
   // Function to clear category suggestions
   const clearCategorySuggestions = () => {
      setCategorySuggestions([]);
   };
   const handleFocus = (isFocused: boolean) => {
      if (!isFocused) {
         setCategoryInput("");
         setTimeout(() => {
            setCategorySuggestions([]);
         }, 5000); // 5000 milliseconds (5 seconds)
      }
   };
   return (
      <>
         <div className="bg-background max-w-[1104px] px-6 mx-auto pt-5 py-6">
            <div
               className="flex items-center justify-start mb-6"
               onClick={() => window.history.back()}>
               <Button disabled={loading} variant="outline" size="sm">
                  <ChevronLeft className="w-6 h-6" />{" "}
                  <span className="text-lg">Back</span>
               </Button>
            </div>

            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(handleCreatePost)}
                  className="w-full pb-20 space-y-8">
                  <div className="grid gap-8">
                     {/* Article Image */}
                     <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                           <div className="flex items-center justify-center">
                              <FormItem className="w-full border md:w-1/2 ">
                                 <FormControl>
                                    <div>
                                       <label
                                          htmlFor="postImg"
                                          className="flex flex-col px-3 md:h-[200px]h-[200px] pt-2  items-center justify-center cursor-pointer">
                                          <Image className="w-10 h-10 mb-10" />

                                          {postImage instanceof File ? (
                                             <span className="mb-5 text-xs text-center">
                                                Click the image Icon above to
                                                change article image
                                             </span>
                                          ) : (
                                             <span className="mb-5 text-xs text-center">
                                                Select a captivating cover image
                                                for your article. This image
                                                will be the visual centerpiece
                                                of your article, grabbing
                                                readers' attention and setting
                                                the tone for your content.
                                             </span>
                                          )}
                                       </label>
                                       <input
                                          id="postImg"
                                          name="image"
                                          type="file"
                                          accept="image/*"
                                          onChange={(e) => {
                                             uploadPostImage(e);
                                             field.onChange(e.target.value);
                                          }}
                                          value={field.value || ""}
                                          disabled={loading}
                                          ref={imageInputRef}
                                          style={{ display: "none" }}
                                       />
                                       {postImage instanceof File && (
                                          <img
                                             src={URL.createObjectURL(
                                                postImage
                                             )}
                                             alt="Preview"
                                             width={400}
                                             height={400}
                                             className="md:h-[300px] w-full object-contain md:pb-2"
                                          />
                                       )}
                                    </div>
                                 </FormControl>
                              </FormItem>
                           </div>
                        )}
                     />
                     {/* article Title */}
                     <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                           <FormItem className="flex flex-col gap-4">
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                 <input
                                    disabled={loading}
                                    placeholder="Title"
                                    {...field}
                                    className="h-10 bg-transparent border-b outline-none placeholder:text-xs placeholder:opacity-75"
                                 />
                              </FormControl>
                              <div className="flex items-start gap-2 pb-5 md:items-center opacity-80">
                                 <p className="text-xs ">
                                    Choose a compelling title for your article.
                                    This is what readers will see first and sets
                                    the stage for your article's content
                                 </p>
                              </div>

                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="snippet"
                        render={({ field }) => (
                           <FormItem className="flex flex-col gap-4">
                              <FormLabel>Article snippet</FormLabel>
                              <FormControl>
                                 <textarea
                                    disabled={loading}
                                    placeholder="enter your article snippet"
                                    {...field}
                                    className="h-10 bg-transparent border-b outline-none resize-none placeholder:text-xs placeholder:opacity-75"
                                 />
                              </FormControl>
                              <div className="pb-5 text-xs opacity-80">
                                 Please provide a short and captivating snippet
                                 . This will appear right next to your article's
                                 title and cover image, giving readers a glimpse
                                 of what your article is about
                              </div>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormLabel>Topics</FormLabel>
                     <div className="flex flex-wrap gap-2">
                        {selectedCategories.map((selectedCategory, index) => (
                           <Badge
                              onClick={clearCategorySuggestions}
                              key={index}
                              className="flex items-center px-3 py-2 border rounded-lg">
                              <span>
                                 <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24">
                                    <path
                                       fill="currentcolor"
                                       clip-rule="evenodd"
                                       d="M5 21V3h14v18H5zM4.75 2a.75.75 0 0 0-.75.75v18.5c0 .41.34.75.75.75h14.5c.41 0 .75-.34.75-.75V2.75a.75.75 0 0 0-.75-.75H4.75zM8 13a.5.5 0 0 0 0 1h8a.5.5 0 0 0 0-1H8zm-.5 3.5c0-.28.22-.5.5-.5h8a.5.5 0 0 1 0 1H8a.5.5 0 0 1-.5-.5zM8.75 10h6.5c.14 0 .25-.11.25-.25v-2.5a.25.25 0 0 0-.25-.25h-6.5a.25.25 0 0 0-.25.25v2.5c0 .14.11.25.25.25z"></path>
                                 </svg>
                              </span>
                              <span className="mx-2">
                                 {selectedCategory.name}
                              </span>
                              <button
                                 onClick={() => handleRemoveCategory(index)}>
                                 <X className="w-4 h-4 " />
                              </button>
                           </Badge>
                        ))}
                     </div>
                     <input
                        type="text"
                        placeholder="Enter and select categories that best decsribe your article"
                        value={categoryInput}
                        onChange={handleCategoryInputChange}
                        onFocus={() => handleFocus(true)}
                        onBlur={() => handleFocus(false)}
                        className="h-10 bg-transparent border-b outline-none placeholder:text-xs placeholder:opacity-75"
                     />
                     <ul
                        className={`${
                           categorySuggestions.length &&
                           "border-2 rounded border-foreground/10"
                        }`}>
                        {categorySuggestions.map((category) => (
                           <li
                              className="flex items-center gap-2 py-3 mx-2 text-lg border-b cursor-pointer hover:opacity-50 "
                              key={category.id}
                              onClick={() => handleCategorySelection(category)}>
                              <span>
                                 <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24">
                                    <path
                                       fill="currentcolor"
                                       clip-rule="evenodd"
                                       d="M5 21V3h14v18H5zM4.75 2a.75.75 0 0 0-.75.75v18.5c0 .41.34.75.75.75h14.5c.41 0 .75-.34.75-.75V2.75a.75.75 0 0 0-.75-.75H4.75zM8 13a.5.5 0 0 0 0 1h8a.5.5 0 0 0 0-1H8zm-.5 3.5c0-.28.22-.5.5-.5h8a.5.5 0 0 1 0 1H8a.5.5 0 0 1-.5-.5zM8.75 10h6.5c.14 0 .25-.11.25-.25v-2.5a.25.25 0 0 0-.25-.25h-6.5a.25.25 0 0 0-.25.25v2.5c0 .14.11.25.25.25z"></path>
                                 </svg>
                              </span>
                              <p className="text-sm">{category.name}</p>
                           </li>
                        ))}
                     </ul>
                     <span className="text-xs opacity-80">
                        Add or change topics (up to 5) so readers know what your
                        story is about
                     </span>

                     <FormMessage />

                     <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Content</FormLabel>
                              <FormControl>
                                 <div>
                                    <>
                                       <ReactQuill
                                          modules={modules}
                                          formats={formats}
                                          theme="snow"
                                          style={{ height: 300 }}
                                          {...field}
                                          placeholder="Knock yourself out and write your article... let's see where the Nexus takes us   🖋"
                                       />
                                    </>
                                 </div>
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <div className="flex items-center justify-center gap-3 ">
                        <button
                           disabled={drafting}
                           aria-disabled={drafting}
                           className="w-full px-5 py-2 mt-20 mr-3 font-semibold text-black bg-accent-red hover:bg-wh-500 dark:text-black"
                           type="submit">
                           {drafting ? "Saving as draft..." : "Save to draft"}
                        </button>
                        <button
                           aria-disabled={loading}
                           disabled={loading}
                           className="w-full px-5 py-2 mt-20 mr-3 font-semibold text-black bg-accent-red hover:bg-wh-500 dark:text-black"
                           type="submit">
                           {loading ? "Publishing..." : "Publish"}
                        </button>
                     </div>
                  </div>
               </form>
            </Form>
         </div>
      </>
   );
};

export default PostForm;
