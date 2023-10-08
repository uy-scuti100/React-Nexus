import useSWR from "swr";
import { fetchUser } from "../lib/authUtils";
import { User } from "../../types";

// Define __INITIAL_DATA__ as an empty object
declare global {
   interface Window {
      __INITIAL_DATA__: Record<string, any>;
   }
}

window.__INITIAL_DATA__ = {};

export const useUser = () => {
   const { data: userData, error } = useSWR("user", fetchUser, {
      initialData: window.__INITIAL_DATA__.user || null, // Use the initial data if available
      revalidateOnMount: true, // Revalidate data when the component mounts
   });

   return {
      user: userData,
      isLoading: !userData && !error,
      isError: !!error,
   };
};




// import useSWR from "swr";
// import { fetchUser } from "../lib/authUtils";
// import { User } from "../../types";

// export const useUser = (): {
//    user: User | null | undefined;
//    isLoading: boolean;
//    isError: boolean;
// } => {
//    const { data: user, error } = useSWR("user", fetchUser, {
//       refreshInterval: 1800000,
//    });

//    return {
//       user,
//       isLoading: !user && !error,
//       isError: error,
//    };
// };

// {
//    revalidateOnFocus: false, // Disable revalidation on window focus (optional)
//    revalidateOnReconnect: false, // Disable revalidation on reconnect (optional)
//    refreshInterval: 60000, // Set revalidation time in milliseconds (e.g., 1 minute)
// }
