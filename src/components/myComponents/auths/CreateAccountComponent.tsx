import { Button } from "../../ui/button";
import { AiOutlineGithub, AiOutlineMail } from "react-icons/ai";
import { PiGoogleLogo, PiTwitterLogo } from "react-icons/pi";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../../ui/card";

import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import supabase from "../../../lib/supabaseClient";
import {
	ModalContext,
	ModalContextProp,
} from "../../../state/context/modalContext";
import EmailSigninComponent from "./EmailSigninComponent";
interface OAuthProvider {
	type: "github" | "google" | "twitter";
}

export function CreateAccountComponent({
	title,
	type,
	question,
}: {
	title: string;
	type: string;
	question: string;
}) {
	const {
		openModal,
		openJoinModal,
		toggleEmailFormModal,
		openEmailCompModal,
		setOpenJoinModal,
		setOpenModal,
	} = useContext(ModalContext) as ModalContextProp;
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleFormState = () => {
		if (openJoinModal) {
			setOpenModal(true);
			setOpenJoinModal(false);
		} else if (openModal) {
			setOpenJoinModal(true);
			setOpenModal(false);
		}
	};

	const handleSignUpWithProvider = async (provider: OAuthProvider) => {
		setIsSubmitting(true);
		try {
			const { data: user, error } = await supabase.auth.signInWithOAuth({
				provider: provider.type,
			});

			if (error) {
				console.error(error.message);
			}
		} catch (error: any) {
			console.error("Error:", error.message);
			toast.error("Error signing up:", error.message);
		}
	};

	return (
		<main>
			<Card className="w-[350px]  md:w-auto z-50 ">
				<CardHeader className="space-y-1">
					<CardTitle className="pb-10 text-2xl text-center">{title}</CardTitle>
					<CardDescription className="text-center">
						Select a sign in option to {type}
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4">
					<div className="flex flex-col items-center justify-center gap-4 w-[300px] md:w-full ">
						<Button
							variant="outline"
							disabled={isSubmitting}
							onClick={() => handleSignUpWithProvider({ type: "github" })}
						>
							<AiOutlineGithub className="w-4 h-4 mr-2 dark:text-white" />
							Sign in with Github
						</Button>
						<Button
							variant="outline"
							disabled={isSubmitting}
							onClick={() => handleSignUpWithProvider({ type: "google" })}
						>
							<PiGoogleLogo className="w-4 h-4 mr-2 dark:text-white" />
							Sign in with Google
						</Button>
						{/* <Button
                     variant="outline"
                     disabled={isSubmitting}
                     onClick={() =>
                        handleSignUpWithProvider({ type: "twitter" })
                     }>
                     <PiTwitterLogo className="w-4 h-4 mr-2 dark:text-white" />
                     Sign in with Twitter
                  </Button>
                  <Button
                     variant="outline"
                     disabled={isSubmitting}
                     onClick={toggleEmailFormModal}>
                     <AiOutlineMail className="w-4 h-4 mr-2 dark:text-white" />
                     Sign in with Email
                  </Button> */}
					</div>
				</CardContent>
				<CardFooter className="pt-8">
					<CardContent>
						<p
							className="text-xs text-center cursor-pointer"
							onClick={handleFormState}
						>
							{question}
							<span className="ml-2 font-bold text-eccentric">{type}</span>
						</p>

						<p className="pt-10 text-xs text-center">
							Forgot email or trouble signing in? Get help.
						</p>
					</CardContent>
				</CardFooter>
			</Card>
			{openEmailCompModal && <EmailSigninComponent />}
		</main>
	);
}
