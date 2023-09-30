//;
import useSWR from "swr";
import { fetchSingleUser } from "../lib/fetchUserUtil";
import { User } from "../../types";

export const useFetchUser = (): {
   user: User | null | undefined;
   isLoading: boolean;
   isError: boolean;
} => {
   const { data: user, error } = useSWR("currentUser", fetchSingleUser, {
      refreshInterval: 1800000, // 30 minutes
   });

   return {
      user,
      isLoading: !user && !error,
      isError: error,
   };
};
