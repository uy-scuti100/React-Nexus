import { useEffect, useState } from "react";

const [divStyles, setDivStyles] = useState({
   height: "100px",
   width: "200px",
   minWidth: "100px",
   marginLeft: "70px",
});
useEffect(() => {
   const handleResize = () => {
      if (window.innerWidth <= 768) {
         setDivStyles({
            height: "56px",
            width: "80px",
            minWidth: "80px",
            marginLeft: "40px",
         });
      } else {
         setDivStyles({
            height: "112px",
            width: "112px",
            minWidth: "112px",
            marginLeft: "70px",
         });
      }
   };

   window.addEventListener("resize", handleResize);

   handleResize();

   // Clean up the event listener when the component unmounts
   return () => {
      window.removeEventListener("resize", handleResize);
   };
}, []);

export default function MinimalSkeleton() {
   return (
      <div className="p-4 mb-5 bg-gray-800 animate-pulse">
         {/* Loader content goes here */}
         <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
            <div className="flex items-center gap-3 text-xs font-medium text-gray-600">
               <div className="w-20 h-4 bg-gray-600 rounded"></div>
               <div className="w-10 h-4 bg-gray-600 rounded"></div>
            </div>
         </div>
         <div className="flex justify-between pt-2">
            <div className="flex flex-col">
               <div className="w-3/4 h-4 bg-gray-600 rounded"></div>
               <div className="pt-3 pb-4 text-sm font-medium">
                  <div className="w-full h-4 bg-gray-600 rounded"></div>
                  <div className="w-3/4 h-4 bg-gray-600 rounded"></div>
               </div>
            </div>
            <div className="cursor-pointer" style={divStyles}>
               <div className="w-48 h-40 bg-gray-600 rounded-lg animate-pulse"></div>
            </div>
         </div>
         <div className="flex items-center justify-between pt-3">
            <div className="flex items-center gap-5">
               <div className="flex flex-wrap items-center gap-4">
                  <div className="w-20 h-6 bg-gray-600 rounded-full"></div>
                  <div className="w-12 h-4 bg-gray-600 rounded"></div>
               </div>
               <div className="w-12 h-4 bg-gray-600 rounded"></div>
            </div>
            <div className="flex items-center gap-3">
               <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
               <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
               <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
            </div>
         </div>
         <div className="w-full px-6 pb-4 border-b border-gray-600" />
      </div>
   );
}
