import React from "react";

const Subscribe = () => {
   return (
      <div className="px-5 py-10 text-center bg-wh-10">
         <h4 className="text-base font-semibold text-black">
            Sign up for our Newsletter
         </h4>
         <p className="w-5/6 mx-auto my-3 text-wh-500">
            Provide your email to receive the latest news and exclusive offers.
         </p>
         <input
            className="text-center w-5/6 min-w-[100px] px-5 py-2 border-2"
            placeholder="Enter Email Address"
         />
         <button className="bg-accent-red text-wh-10 font-semibold w-5/6 min-w-[100px] py-2 px-5 mt-3">
            SUBSCRIBE
         </button>
      </div>
   );
};

export default Subscribe;
