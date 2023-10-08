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
      revalidateOnMount: true
   });

   return {
      user,
      isLoading: !user && !error,
      isError: error,
   };
};
