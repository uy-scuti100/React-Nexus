import { useState, useContext } from "react";

import { Button } from "../../ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "../../ui/card";
import { Input } from "../../ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormMessage,
} from "../../ui/form";

import { toast } from "react-hot-toast";
import { ChevronLeft, X } from "lucide-react";
import Confirmation from "./Confirmation";
import {
   ModalContext,
   ModalContextProp,
} from "../../../state/context/modalContext";
import supabase from "../../../lib/supabaseClient";

type SignupFormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
   email: z.string().email(),
});

const EmailSigninComponent = () => {
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [email, setEmail] = useState("");
   const {
      toggleEmailFormModal,
      setOpenEmailCompModal,
      setOpenJoinModal,
      openEmailCompModal,
      setOpenModal,
   } = useContext(ModalContext) as ModalContextProp;
   const handleSignup = async (data: SignupFormValues) => {
      if (isSubmitting) {
         return;
      }
      setIsLoading(true);

      const { email } = data;

      try {
         const { data: user, error } = await supabase.auth.signInWithOtp({
            email,
         });

         if (user) {
            toast.success("Check your mail for confirmation link!");
            setIsSubmitting(true);
            setEmail(email);
         } else if (error) {
            toast.error("Error confirming your email!");
         }
      } catch (error) {
         console.error("server error:", error);
         toast.error("server error");
      } finally {
         setTimeout(() => {
            setIsSubmitting(false);
            setOpenEmailCompModal(false);
            setOpenJoinModal(false);
            setOpenModal(false);
         }, 7000);
      }
   };

   const form = useForm<SignupFormValues>({
      resolver: zodResolver(formSchema),
   });

   const handleFormState = () => {
      if (openEmailCompModal) {
         setOpenEmailCompModal(false);
         setOpenJoinModal(true);
      }
   };
   return (
      <div>
         {isSubmitting ? (
            <Confirmation email={email} />
         ) : (
            <section className="fixed inset-0 z-50 flex items-center justify-center w-full h-full overflow-hidden text-white transition-all duration-300">
               {/* <div className="absolute inset-0 z-40 bg-white backdrop-blur-0 md:bg-white/60 md:backdrop-blur-xl dark:bg-black" /> */}

               <div className="absolute flex justify-center items-center z-50 top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
                  <div className="absolute right-0 p-2 top-[-60px] cursor-pointer ">
                     <X onClick={toggleEmailFormModal} />
                  </div>
               </div>
               <Card className="z-50 h-[490px] w-full ">
                  <CardHeader className="">
                     <CardTitle className="pb-5 text-3xl text-center">
                        Sign up with email
                     </CardTitle>
                     <CardDescription className="pb-10 text-center">
                        Enter your email address to create an account.
                     </CardDescription>
                     <CardDescription className="pb-5 text-center">
                        Your email
                     </CardDescription>
                  </CardHeader>
                  <CardContent>
                     <Form {...form}>
                        <form
                           className="grid gap-4 w-[350px] md:w-auto pt-50"
                           onSubmit={form.handleSubmit(handleSignup)}>
                           <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                 <FormItem className="grid gap-2">
                                    <FormControl>
                                       <Input
                                          disabled={isSubmitting}
                                          placeholder="abc@gmail.com"
                                          {...field}
                                          className="p-4 text-center border-b outline-none bg-none w-[300px] md:w-full "
                                       />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                           <Button
                              variant="default"
                              className="w-[300px] md:w-full"
                              type="submit"
                              disabled={isLoading}>
                              Ok
                           </Button>
                        </form>
                     </Form>
                  </CardContent>
                  <CardContent className="text-center cursor-pointer text-eccentric ">
                     <div
                        className="flex items-center justify-center"
                        onClick={handleFormState}>
                        <ChevronLeft className="mr-2" /> All other signup
                        options
                     </div>
                  </CardContent>
               </Card>
            </section>
         )}
      </div>
   );
};

// Check your inbox.
// Enter the code we sent to kokololo@hotmail.com to complete your account set-up.
// OK

export default EmailSigninComponent;
