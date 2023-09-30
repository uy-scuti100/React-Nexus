"use client";
import { useState } from "react";

interface CommentEditorProps {
   initialContent: string;
   onSave: (newContent: string) => void;
   onCancel: () => void;
}
const CommentEditor = ({
   initialContent,
   onSave,
   onCancel,
}: CommentEditorProps) => {
   const [tempContent, setTempContent] = useState(initialContent);
   const [tempContentError, setTempContentError] = useState("");

   const handleSaveClick = async () => {
      if (tempContent.trim() === "") {
         setTempContentError("Comment field can't be empty.");
         return;
      }

      // Perform the save action with tempContent
      onSave(tempContent);
   };

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTempContent(e.target.value);
   };

   return (
      <div className="flex flex-col gap-2">
         <textarea
            autoFocus={true}
            style={{
               height: "50px",
               resize: "none",
               border: "1px solid #ccc",
            }}
            value={tempContent}
            onChange={(e) => handleInputChange}
         />
         {tempContentError && (
            <p className="mt-1 text-primary-500">{tempContentError}</p>
         )}
         <div className="flex items-center justify-end">
            <button
               onClick={onCancel}
               className="px-5 py-2 mt-5 mr-3 font-semibold bg-accent-red hover:bg-wh-500 text-wh-10 dark:text-black">
               Revert
            </button>
            <button
               onClick={handleSaveClick}
               className="px-5 py-2 mt-5 font-semibold bg-accent-red hover:bg-wh-500 text-wh-10 dark:text-black">
               Save
            </button>
         </div>
      </div>
   );
};

export default CommentEditor;
