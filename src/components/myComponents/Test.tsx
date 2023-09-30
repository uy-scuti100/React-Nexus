import React from "react";

interface User {
   id: string | null | undefined;
   email: string | null | undefined;
   avatarUrl: string | null | undefined;
   fullName?: string | null | undefined;
}

const Test = ({ data }: { data: User | null }) => {
   if (!data) {
      return null; // Handle the case where data is null
   }

   return (
      <div className="pt-24">
         {/* You can access the properties like this */}
         <p>ID: {data.id}</p>
         <p>Email: {data.email}</p>
         <p>Avatar URL: {data.avatarUrl}</p>
         <p>Full Name: {data.fullName}</p>
      </div>
   );
};

export default Test;
