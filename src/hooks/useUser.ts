import useSWR from "swr";
import { fetchUser } from "../lib/authUtils";
import { User } from "../../types";

export const useUser = (): {
   user: User | null | undefined;
   isLoading: boolean;
   isError: boolean;
} => {
   const { data: user, error } = useSWR("user", fetchUser, {
      refreshInterval: 1800000,
   });

   return {
      user,
      isLoading: !user && !error,
      isError: error,
   };
};

// {
//    revalidateOnFocus: false, // Disable revalidation on window focus (optional)
//    revalidateOnReconnect: false, // Disable revalidation on reconnect (optional)
//    refreshInterval: 60000, // Set revalidation time in milliseconds (e.g., 1 minute)
// }
