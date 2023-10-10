import { useState } from "react";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
   Tabs,
   TabsContent,
   TabsList,
   TabsTrigger,
} from "../../components/ui/tabs";
import { Textarea } from "../../components/ui/textarea";
import { X } from "lucide-react";
import supabase from "../../lib/supabaseClient";
import toast from "react-hot-toast";

interface FormProp {
   id: string | null | undefined;
   bio: string | null | undefined;
   name: string | null | undefined;
   username: string | null | undefined;
   location: string | null | undefined;
   email: string | null | undefined;
   website: string | null | undefined;
   skills: string | null | undefined;
   learning: string | null | undefined;
   building: string | null | undefined;
   availability: string | null | undefined;
   pronouns: string | null | undefined;
   work: string | null | undefined;
   education: string | null | undefined;
   avatar: string | null | undefined;
   bannerPic: string | null | undefined;
   showEmail: boolean | null | undefined;
}

const maxLength = 200;
const bioLength = 160;
const locationLength = 30;
const usernameLength = 50;
const personalLength = 100;

export function Settings({
   prop,
   handleShowSettings,
   fetchUserData,
}: {
   prop: FormProp;
   handleShowSettings: () => void;
   fetchUserData: () => void;
}) {
   const id = prop.id;
   const bannerImageLink = import.meta.env.VITE_REACT_SUPABASE_BANNER_IMAGE_URL;
   const avatarImageUrl = import.meta.env.VITE_REACT_SUPABASE_AVATAR_IMAGE_URL;
   const [avatar, setAvatar] = useState(prop.avatar || "");
   const [loading, setLoading] = useState(false);
   const [avatarFile, setAvatarFile] = useState<File | null>(null);
   const [bannerPicFile, setBannerPicFile] = useState<File | null>(null);
   // temporary staes to store chnages before changing in the db
   const [tempName, setTempName] = useState(prop.name);
   const [tempShowEmail, setTempShowEmail] = useState(
      prop.showEmail?.valueOf()
   );
   const [tempUsername, setTempUsername] = useState(prop.username);
   const [tempEmail, setTempEmail] = useState(prop.email);
   const [tempWebsiteUrl, setTempWebsiteUrl] = useState(prop.website);
   const [tempLocation, setTempLocation] = useState(prop.location);
   const [tempBio, setTempBio] = useState(prop.bio);
   const [tempLearning, setTempLearning] = useState(prop.learning);
   const [tempSkills, setTempSkills] = useState(prop.skills);
   const [tempAvailability, setTempAvailability] = useState(prop.availability);
   const [tempPronouns, setTempPronouns] = useState(prop.pronouns);
   const [tempWork, setTempWork] = useState(prop.work);
   const [tempEducation, setTempEducation] = useState(prop.education);
   // const [tempBannerPic, setTempBannerPic] = useState(prop.bannerPic);

   const handleUpdateAccount = async () => {
      let imageUrl = prop.avatar || "";
      let bannerImageUrl = prop.bannerPic || "";

      try {
         setLoading(true);

         // Update avatar image if a new file is provided
         if (avatarFile instanceof File) {
            // Generate a random 10-digit number
            const randomSuffix = Math.floor(
               1000000000 + Math.random() * 9000000000
            ).toString();

            // Append the random number to the image name
            const imageName = `${randomSuffix}-${avatarFile.name}`;

            const { data: imageUploadResponse, error: imageUploadError } =
               await supabase.storage
                  .from("avatars")
                  .upload(imageName, avatarFile, {
                     cacheControl: "3600",
                     upsert: true,
                  });

            if (imageUploadResponse) {
               imageUrl = `${avatarImageUrl}${imageUploadResponse.path}`;
            } else {
               toast.error("Failed to upload avatar image");
               return;
            }
         }

         // Update bannerPic image if a new file is provided
         if (bannerPicFile instanceof File) {
            // Generate a random 10-digit number
            const randomSuffix = Math.floor(
               1000000000 + Math.random() * 9000000000
            ).toString();

            // Append the random number to the image name
            const imageName = `${randomSuffix}-${bannerPicFile.name}`;

            const { data: imageUploadResponse, error: imageUploadError } =
               await supabase.storage
                  .from("banner_images")
                  .upload(imageName, bannerPicFile, {
                     cacheControl: "3600",
                     upsert: true,
                  });

            if (imageUploadResponse) {
               bannerImageUrl = `${bannerImageLink}${imageUploadResponse.path}`;
            } else {
               console.log(
                  "Error uploading bannerPic image:",
                  imageUploadError?.message
               );
               toast.error("Failed to upload bannerPic image");
               return;
            }
         }

         const updatedUserData = {
            email: tempEmail,
            display_name: tempName,
            username: tempUsername,
            bio: tempBio,
            show_email: tempShowEmail,
            location: tempLocation,
            website: tempWebsiteUrl,
            skills_and_languages: tempSkills,
            currently_learning: tempLearning,
            availability: tempAvailability,
            pronouns: tempPronouns,
            work: tempWork,
            education: tempEducation,
            display_pic: imageUrl,
            banner_pic: bannerImageUrl,
         };

         const { data: updatedUser, error } = await supabase
            .from("profiles")
            .update(updatedUserData)
            .eq("id", id)
            .select();

         if (updatedUser && !error) {
            handleShowSettings();
            fetchUserData();
            toast.success("Account Updated");
         } else {
            toast.error("Failed to update Account");
         }
      } catch (error: any) {
         console.error("An error occurred:", error.message);
      } finally {
         setLoading(false);
      }
   };

   // Function to handle avatar file input change
   const handleAvatarInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;

      if (files && files.length > 0) {
         // Store the selected avatar file in state
         setAvatarFile(files[0]);
      }
   };

   // Function to handle bannerPic file input change
   const handleBannerPicInputChange = (
      e: React.ChangeEvent<HTMLInputElement>
   ) => {
      const files = e.target.files;

      if (files && files.length > 0) {
         // Store the selected bannerPic file in state
         setBannerPicFile(files[0]);
      }
   };

   const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTempName(e.target.value);
   };

   const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTempEmail(e.target.value);
   };

   const handleDisplayEmailChange = (
      e: React.ChangeEvent<HTMLInputElement>
   ) => {
      const newValue = e.target.checked;
      setTempShowEmail(newValue);
   };

   const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTempWebsiteUrl(e.target.value);
   };

   const handleLocationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTempLocation(e.target.value);
   };

   const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTempBio(e.target.value);
   };

   const handleLearningChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTempLearning(e.target.value);
   };

   const handleSkillsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTempSkills(e.target.value);
   };

   const handleAvailabilityChange = (
      e: React.ChangeEvent<HTMLTextAreaElement>
   ) => {
      setTempAvailability(e.target.value);
   };

   const handlePronounsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTempPronouns(e.target.value);
   };

   const handleWorkChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTempWork(e.target.value);
   };

   const handleEducationChange = (
      e: React.ChangeEvent<HTMLTextAreaElement>
   ) => {
      setTempEducation(e.target.value);
   };

   const handleShowSettingsAndRevertProfileChanges = () => {
      handleShowSettings();
   };

   return (
      <>
         <div className="relative">
            <div
               onClick={handleShowSettingsAndRevertProfileChanges}
               className="absolute left-0 text-white cursor-pointer md:left-[250px] lg:left-[400px] -top-10">
               <X />
            </div>
         </div>
         <Tabs defaultValue="account" className="min-w-[300px] h-[450px]">
            <TabsList className="grid w-full grid-cols-4 gap-2">
               <TabsTrigger value="account">User</TabsTrigger>
               <TabsTrigger value="basic">Basic</TabsTrigger>
               <TabsTrigger value="interests">Interests</TabsTrigger>
               <TabsTrigger value="personal">Personal</TabsTrigger>
            </TabsList>
            {/* User */}
            <TabsContent value="account">
               <Card className="py-6 md:px-3">
                  <CardTitle className="pb-3 ml-6 text-lg text-accent-orange hover:text-foreground">
                     {prop.username}
                  </CardTitle>

                  <CardContent className="space-y-2">
                     <div className="space-y-1">
                        <Label htmlFor="name">Name</Label>
                        <Input
                           id="name"
                           type="text"
                           maxLength={usernameLength}
                           onChange={handleNameChange}
                           defaultValue={tempName as string}
                        />
                     </div>
                     <span className="flex justify-end mt-1 text-xs opacity-75">
                        {typeof tempName === "string" && tempName.length}/
                        {usernameLength}
                     </span>
                     <div className="space-y-1">
                        <Label htmlFor="username">Username</Label>
                        <div className="flex items-center">
                           {/* <span className="mt-1 translate-x-[20px]">@</span> */}
                           <Input
                              id="username"
                              type="text"
                              maxLength={usernameLength}
                              defaultValue={prop.username as string}
                              onChange={(e) => {
                                 let value = e.target.value;
                                 if (!value.startsWith("@")) {
                                    value = `@${value}`;
                                 }

                                 if (value.length === 1) {
                                    value = "@";
                                 }
                                 e.target.value = value;
                                 setTempUsername(e.target.value);
                                 // console.log(tempUsername);
                              }}
                           />
                        </div>
                     </div>
                     <span className="flex justify-end mt-1 text-xs opacity-75">
                        {typeof tempUsername === "string" &&
                           tempUsername.length}
                        /{usernameLength}
                     </span>
                     <div className="space-y-1">
                        <Label htmlFor="email">Email</Label>
                        <Input
                           type="email"
                           id="email"
                           defaultValue={tempEmail as string}
                           onChange={handleEmailChange}
                        />
                     </div>

                     <div className="flex items-center space-x-3 ">
                        <input
                           type="checkbox"
                           name="show_email"
                           id="show_email"
                           onChange={handleDisplayEmailChange}
                           checked={tempShowEmail === true}
                        />
                        <label
                           className="text-sm opacity-75 cursor-pointer"
                           htmlFor="show_email">
                           Display email on profile
                        </label>
                     </div>
                     <div className="space-y-1">
                        <Label htmlFor="avatar">Avatar</Label>
                        <div className="flex items-center">
                           <img
                              src={avatar}
                              alt="Avatar Preview"
                              className="w-10 h-10 mr-2 rounded-full"
                           />
                           <Input
                              className="cursor-pointer text-foreground"
                              id="avatar"
                              type="file"
                              accept="image/*"
                              onChange={handleAvatarInputChange}
                           />
                           {/* Avatar Preview */}
                           {avatarFile && (
                              <img
                                 src={URL.createObjectURL(avatarFile)}
                                 alt="Avatar Preview"
                                 className="w-10 h-10 ml-2"
                              />
                           )}
                        </div>
                     </div>
                     {/* Banner Pic Input */}
                     <div className="space-y-1">
                        <Label htmlFor="bannerPic">Banner Pic</Label>
                        {/* <img
                        src={prop.bannerPic as string}
                        alt="Banner Pic Preview"
                        className="w-full h-20 mr-2"
                     /> */}
                        {bannerPicFile && (
                           <img
                              src={URL.createObjectURL(bannerPicFile)}
                              alt="Banner Pic Preview"
                              className="object-cover w-full h-20 md:h-40"
                           />
                        )}
                        <div className="flex items-center pt-2">
                           <Input
                              id="bannerPic"
                              type="file"
                              accept="image/*"
                              onChange={handleBannerPicInputChange}
                           />
                           {/* Banner Pic Preview */}
                        </div>
                     </div>
                  </CardContent>
                  <CardFooter>
                     <button
                        disabled={loading}
                        onClick={handleUpdateAccount}
                        className="w-full px-5 py-2 mt-5 font-semibold md:hidden md:w-auto bg-accent-red hover:bg-wh-500 text-wh-10 dark:text-black">
                        {loading ? "Saving changes" : "Save changes"}
                     </button>
                  </CardFooter>
               </Card>
            </TabsContent>
            {/* Basic */}
            <TabsContent value="basic" className="overflow-auto">
               {" "}
               <Card className="py-6 md:px-3">
                  <CardTitle className="ml-6 text-lg text-accent-orange hover:text-foreground">
                     @{prop.username}
                  </CardTitle>
                  <CardHeader>
                     <CardDescription>
                        Make changes to your account here. Click save when
                        you're done.
                     </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                     <div className="space-y-1">
                        <Label htmlFor="website">Website URL</Label>
                        <Input
                           id="website"
                           defaultValue={tempWebsiteUrl as string}
                           onChange={handleWebsiteChange}
                           maxLength={personalLength}
                           type="url"
                        />
                     </div>
                     <span className="flex justify-end mt-1 text-xs opacity-75">
                        {typeof tempWebsiteUrl === "string" &&
                           tempWebsiteUrl.length}
                        /{personalLength}
                     </span>

                     <div className="space-y-1">
                        <Label htmlFor="location">Location</Label>
                        <Textarea
                           id="location"
                           defaultValue={tempLocation as string}
                           onChange={handleLocationChange}
                           maxLength={locationLength}
                           className="h-20 resize-none"
                        />
                     </div>
                     <span className="flex justify-end mt-1 text-xs opacity-75">
                        {typeof tempLocation === "string" &&
                           tempLocation.length}
                        /{locationLength}
                     </span>
                     <div className="space-y-1">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                           id="bio"
                           defaultValue={tempBio as string}
                           maxLength={bioLength}
                           className="h-20 resize-none"
                           onChange={handleBioChange}
                        />
                     </div>
                     <span className="flex justify-end mt-1 text-xs opacity-75">
                        {typeof tempBio === "string" && tempBio.length}/
                        {bioLength}
                     </span>
                  </CardContent>
                  <CardFooter>
                     <button
                        disabled={loading}
                        onClick={handleUpdateAccount}
                        className="w-full px-5 py-2 mt-5 font-semibold md:hidden md:w-auto bg-accent-red hover:bg-wh-500 text-wh-10 dark:text-black">
                        {loading ? "Saving changes" : "Save changes"}
                     </button>
                  </CardFooter>
               </Card>
            </TabsContent>
            {/* interests */}
            <TabsContent value="interests" className="overflow-auto">
               <Card className="py-3 md:px-3">
                  {/* learning */}
                  <CardHeader>
                     <CardTitle className="text-base ">
                        Currently learning
                     </CardTitle>
                     <CardDescription>
                        What are you learning right now? What are the new tools
                        and languages you're picking up right now?
                     </CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-1">
                        <Textarea
                           id="name"
                           defaultValue={tempLearning as string}
                           onChange={handleLearningChange}
                           maxLength={maxLength}
                           className="h-20 resize-none"
                        />
                     </div>
                     <span className="flex justify-end mt-1 text-xs opacity-75">
                        {typeof tempLearning === "string" &&
                           tempLearning.length}
                        /{maxLength}
                     </span>
                  </CardContent>
                  {/* availability */}
                  <CardHeader>
                     <CardTitle className="text-base ">
                        Skills/Languages
                     </CardTitle>
                     <CardDescription>
                        What tools and languages are you most experienced with?
                        Are you specialized or more of a generalist?
                     </CardDescription>
                  </CardHeader>
                  {/* skills */}
                  <CardContent>
                     <div className="space-y-1">
                        <Textarea
                           id="name"
                           defaultValue={tempSkills as string}
                           onChange={handleSkillsChange}
                           maxLength={maxLength}
                           className="h-20 resize-none"
                        />
                     </div>
                     <span className="flex justify-end mt-1 text-xs opacity-75">
                        {typeof tempSkills === "string" && tempSkills.length}/
                        {maxLength}
                     </span>
                  </CardContent>
                  {/* building */}
                  <CardHeader>
                     <CardTitle className="text-base ">Available for</CardTitle>
                     <CardDescription>
                        What kinds of collaborations or discussions are you
                        available for? What's a good reason to say Hey! to you
                        these days?
                     </CardDescription>
                  </CardHeader>

                  <CardContent>
                     <div className="space-y-1">
                        <Textarea
                           id="name"
                           defaultValue={tempAvailability as string}
                           onChange={handleAvailabilityChange}
                           maxLength={maxLength}
                           className="h-20 resize-none"
                        />
                     </div>
                     <span className="flex justify-end mt-1 text-xs opacity-75">
                        {typeof tempAvailability === "string" &&
                           tempAvailability.length}
                        /{maxLength}
                     </span>
                  </CardContent>
                  <CardFooter>
                     <button
                        disabled={loading}
                        onClick={handleUpdateAccount}
                        className="w-full px-5 py-2 mt-5 font-semibold md:hidden md:w-auto bg-accent-red hover:bg-wh-500 text-wh-10 dark:text-black">
                        {loading ? "Saving changes" : "Save changes"}
                     </button>
                  </CardFooter>
               </Card>
            </TabsContent>
            {/* Personal */}
            <TabsContent value="personal" className="overflow-auto">
               {" "}
               <Card className="py-6 md:px-3">
                  <CardContent className="space-y-2">
                     <div className="space-y-1">
                        <Label htmlFor="name">Pronouns</Label>
                        <Input
                           id="name"
                           defaultValue={tempPronouns as string}
                           onChange={handlePronounsChange}
                           maxLength={15}
                        />
                     </div>
                     <span className="flex justify-end mt-1 text-xs opacity-75">
                        {typeof tempPronouns === "string" &&
                           tempPronouns.length}
                        /15
                     </span>
                     <div className="space-y-1">
                        <Label htmlFor="name">Work</Label>
                        <Textarea
                           id="name"
                           defaultValue={tempWork as string}
                           onChange={handleWorkChange}
                           maxLength={personalLength}
                           className="h-20 resize-none"
                        />
                     </div>
                     <span className="flex justify-end mt-1 text-xs opacity-75">
                        {typeof tempWork === "string" && tempWork.length}/
                        {personalLength}
                     </span>
                     <div className="space-y-1">
                        <Label htmlFor="name">Education</Label>
                        <Textarea
                           id="name"
                           defaultValue={tempEducation as string}
                           onChange={handleEducationChange}
                           maxLength={personalLength}
                           className="h-20 resize-none"
                        />
                     </div>
                     <span className="flex justify-end mt-1 text-xs opacity-75">
                        {typeof tempEducation === "string" &&
                           tempEducation.length}
                        /{personalLength}
                     </span>
                  </CardContent>
                  <CardFooter>
                     <button
                        disabled={loading}
                        onClick={handleUpdateAccount}
                        className="w-full px-5 py-2 mt-5 font-semibold md:hidden md:w-auto bg-accent-red hover:bg-wh-500 text-wh-10 dark:text-black">
                        {loading ? "Saving changes" : "Save changes"}
                     </button>
                  </CardFooter>
               </Card>
            </TabsContent>
         </Tabs>
      </>
   );
}
