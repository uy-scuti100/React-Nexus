import { X, PencilLine, Trash2, MoreHorizontal, Pin } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useFetchUser } from "../../hooks/useFetchUser";
import supabase from "../../lib/supabaseClient";
import { useState } from "react";
import { Post } from "../../../types";
import { Toaster } from "../../components/ui/toaster";
import { useToast } from "../../components/ui/use-toast";

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
	const { toast: toaster } = useToast();
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
			const { error } = await supabase.from("posts").delete().eq("id", post.id);
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
		<>
			<Toaster />

			<div className="flex items-center justify-end">
				{post?.profile_id === userId && (
					<div>
						{isEditable ? (
							<div className="flex justify-between gap-3">
								<button onClick={handleCancelEdit}>
									<X className="w-4 h-4 cursor-pointer opacity-70" />
								</button>
							</div>
						) : (
							<div className="flex items-center gap-8 pb-8">
								{/* {userId === post?.profile_id && ( */}
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<div>
											<span className="sr-only">Open menu</span>
											<Pin className="w-4 h-4 mr-2" />
										</div>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										{/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
										<DropdownMenuItem
											onClick={() => {
												toaster({
													title: "Featured Article",
													description:
														"This article has been highlighted and will be prominently displayed on your profile for easy access.",
												});
											}}
										>
											Pin article
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
								{/* )} */}
								<button onClick={handleEnableEdit}>
									<PencilLine className="w-4 h-4 cursor-pointer opacity-70" />
								</button>
								<div onClick={handleShowDialog}>
									<Trash2 className="w-4 h-4 cursor-pointer opacity-70" />
								</div>
								{showDialog && (
									<div className="fixed inset-0 z-50 h-screen mx-5 backdrop-blur">
										<div className="fixed grid w-full max-w-lg gap-4 p-6 duration-200 transform -translate-x-1/2 -translate-y-1/2 border shadow-lg left-1/2 top-1/2 bg-background animate-in fade-in-0">
											<div
												onClick={() => setShowDialog(false)}
												className="absolute cursor-pointer right-2 top-2"
											>
												<X className="w-6 h-6" />
											</div>
											<div>
												<div className="pt-5">
													<h1 className="text-lg font-semibold leading-none tracking-tight">
														Are you sure you want to delete this post?
													</h1>
													<p className="pt-3 text-sm text-muted-foreground">
														This action cannot be undone. This will permanently
														delete your post.
													</p>
												</div>
												<footer className="flex justify-end pt-5">
													<Button
														type="button"
														variant="destructive"
														onClick={handleDelete}
													>
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
		</>
	);
};

export default CategoryAndEdit;

// import { useEffect } from "react"; // Import useEffect if not already imported

// const CategoryAndEdit = ({
// 	post,
// 	isEditable,
// 	handleIsEditable,
// 	title,
// 	setTitle,
// 	tempTitle,
// 	setTempTitle,
// 	snippet,
// 	setSnippet,
// 	tempSnippet,
// 	setTempSnippet,
// 	content,
// 	setContent,
// 	tempContent,
// 	setTempContent,
// 	postImage,
// 	setPostImage,
// 	tempPostImage,
// 	setTempPostImage,
// }: Props) => {
// 	const { toast: toaster } = useToast();
// 	const navigate = useNavigate();
// 	const [showDialog, setShowDialog] = useState(false);
// 	const { user } = useFetchUser();
// 	const userId = user?.id;

// 	const handleEnableEdit = () => {
// 		handleIsEditable(true);
// 		setTempTitle(title);
// 		setTempPostImage(postImage);
// 		setTempSnippet(snippet);
// 		setTempContent(content);
// 	};

// 	const handleCancelEdit = () => {
// 		handleIsEditable(false);
// 		setTitle(tempTitle);
// 		setContent(tempContent);
// 		setSnippet(tempSnippet);
// 		setPostImage(tempPostImage); // Restore the previous postImage
// 	};

// 	const handleSaveEdit = async () => {
// 		// If tempPostImage is empty and postImage is not changed, retain the original postImage
// 		const finalPostImage = tempPostImage || postImage;

// 		// Update the post in the database
// 		try {
// 			const { error } = await supabase
// 				.from("posts")
// 				.update({
// 					title: tempTitle,
// 					snippet: tempSnippet,
// 					content: tempContent,
// 					image: finalPostImage, // Ensure this matches your Supabase schema
// 				})
// 				.eq("id", post.id);

// 			if (error) {
// 				throw error; // If there's an error, throw it to handle it in the catch block
// 			}

// 			toaster({
// 				title: "Post updated!",
// 				description: "Your post has been successfully updated.",
// 			});
// 		} catch (error) {
// 			toaster({
// 				title: "Error updating post",
// 				description: "Error updating post",
// 			});
// 			console.error("Error updating post:", error);
// 		} finally {
// 			handleIsEditable(false); // Exit edit mode after saving
// 		}
// 	};

// 	const handleShowDialog = () => {
// 		setShowDialog(true);
// 	};

// 	const handleDelete = async () => {
// 		try {
// 			const { error } = await supabase.from("posts").delete().eq("id", post.id);
// 			if (!error) {
// 				toast.success("Post deleted successfully!");
// 			} else {
// 				toast.error("Failed to delete post.");
// 				console.error("Error deleting post:", error);
// 			}
// 		} catch (error) {
// 			toast.error("Failed to delete!");
// 			console.error(error);
// 		} finally {
// 			navigate("/posts");
// 		}
// 	};
// 	// https://react-nexus-nine.vercel.app/
// 	return (
// 		<>
// 			<Toaster />

// 			<div className="flex items-center justify-end">
// 				{post?.profile_id === userId && (
// 					<div>
// 						{isEditable ? (
// 							<div className="flex justify-between gap-3">
// 								<button onClick={handleSaveEdit}>
// 									<span className="text-blue-600">Save</span>{" "}
// 									{/* Add a button for saving changes */}
// 								</button>
// 								<button onClick={handleCancelEdit}>
// 									<X className="w-4 h-4 cursor-pointer opacity-70" />
// 								</button>
// 							</div>
// 						) : (
// 							<div className="flex items-center gap-8 pb-8">
// 								<DropdownMenu>
// 									<DropdownMenuTrigger asChild>
// 										<div>
// 											<span className="sr-only">Open menu</span>
// 											<Pin className="w-4 h-4 mr-2" />
// 										</div>
// 									</DropdownMenuTrigger>
// 									<DropdownMenuContent align="end">
// 										<DropdownMenuItem
// 											onClick={() => {
// 												toaster({
// 													title: "Featured Article",
// 													description:
// 														"This article has been highlighted and will be prominently displayed on your profile for easy access.",
// 												});
// 											}}
// 										>
// 											Pin article
// 										</DropdownMenuItem>
// 									</DropdownMenuContent>
// 								</DropdownMenu>
// 								<button onClick={handleEnableEdit}>
// 									<PencilLine className="w-4 h-4 cursor-pointer opacity-70" />
// 								</button>
// 								<div onClick={handleShowDialog}>
// 									<Trash2 className="w-4 h-4 cursor-pointer opacity-70" />
// 								</div>
// 								{showDialog && (
// 									<div className="fixed inset-0 z-50 h-screen mx-5 backdrop-blur">
// 										<div className="fixed grid w-full max-w-lg gap-4 p-6 duration-200 transform -translate-x-1/2 -translate-y-1/2 border shadow-lg left-1/2 top-1/2 bg-background animate-in fade-in-0">
// 											<div
// 												onClick={() => setShowDialog(false)}
// 												className="absolute cursor-pointer right-2 top-2"
// 											>
// 												<X className="w-6 h-6" />
// 											</div>
// 											<div>
// 												<div className="pt-5">
// 													<h1 className="text-lg font-semibold leading-none tracking-tight">
// 														Are you sure you want to delete this post?
// 													</h1>
// 													<p className="pt-3 text-sm text-muted-foreground">
// 														This action cannot be undone. This will permanently
// 														delete your post.
// 													</p>
// 												</div>
// 												<footer className="flex justify-end pt-5">
// 													<Button
// 														type="button"
// 														variant="destructive"
// 														onClick={handleDelete}
// 													>
// 														delete
// 													</Button>
// 												</footer>
// 											</div>
// 										</div>
// 									</div>
// 								)}
// 							</div>
// 						)}
// 					</div>
// 				)}
// 			</div>
// 		</>
// 	);
// };

// export default CategoryAndEdit;
